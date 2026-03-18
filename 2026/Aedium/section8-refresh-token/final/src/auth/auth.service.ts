import {
  ConflictException,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { UsersService } from '../users/users.service';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import { User } from '../users/entities/user.entity';

const HASH_ROUNDS = 10;

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
  ) {}

  async signIn(
    email: string,
    pass: string,
  ): Promise<{ access_token: string; refresh_token: string }> {
    // Check if user exists
    const user = await this.usersService.findUserByEmail(email);
    if (!user) {
      throw new NotFoundException('User not found');
    }

    // Check if password is correct
    const comparedResult = await bcrypt.compare(pass, user.password);
    if (!comparedResult) {
      throw new UnauthorizedException('Invalid credentials');
    }

    // Generate a JWT and return it here
    return await this.issueTokens(user);
  }

  async signUp(
    email: string,
    pass: string,
  ): Promise<{ access_token: string; refresh_token: string }> {
    // Check if user already exists
    const user = await this.usersService.findUserByEmail(email);
    if (user) {
      throw new ConflictException('User with this email already exists');
    }

    // Hash the password
    const hashedPassword = await bcrypt.hash(pass, HASH_ROUNDS);

    // Create the user
    const createdUser = await this.usersService.create({
      email,
      password: hashedPassword,
    });

    // Generate JWT tokens and return them
    return await this.issueTokens(createdUser);
  }

  private async issueTokens(user: User) {
    // Generate JWT
    const tokens = await this.generateTokenByUser(user);

    // Hash the refresh token
    const hashedRefreshToken = await bcrypt.hash(
      tokens.refresh_token,
      HASH_ROUNDS,
    );

    // Update the user refresh token
    await this.usersService.update(user.id, {
      refreshToken: hashedRefreshToken,
    });

    return tokens;
  }

  private async generateTokenByUser(user: User) {
    // Define environment variables
    const accessSecret = process.env.JWT_ACCESS_SECRET;
    const refreshSecret = process.env.JWT_REFRESH_SECRET;
    if (!accessSecret || !refreshSecret) {
      throw new Error('JWT_SECRET is not defined');
    }

    // Generate JWT
    const payload = { sub: user.id, email: user.email };
    const tokens = {
      access_token: await this.jwtService.signAsync(payload, {
        expiresIn: '15m',
        secret: accessSecret,
      }),
      refresh_token: await this.jwtService.signAsync(payload, {
        expiresIn: '7d',
        secret: refreshSecret,
      }),
    };
    return tokens;
  }
}
