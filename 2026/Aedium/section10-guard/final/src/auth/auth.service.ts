import {
  ConflictException,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { UsersService } from '../users/users.service';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import { createHash, randomUUID } from 'node:crypto';

const HASH_ROUNDS = 10;

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
  ) {}
  ACCESS_SECRET = process.env.JWT_ACCESS_SECRET;
  REFRESH_SECRET = process.env.JWT_REFRESH_SECRET;

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
    return await this.issueTokens(user.id, user.email);
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
    return await this.issueTokens(createdUser.id, createdUser.email);
  }

  async refresh(refreshToken: string) {
    // Verify the refresh token
    // TODO: Add payload parse strategy
    const payload = await this.jwtService.verifyAsync(refreshToken, {
      secret: this.REFRESH_SECRET,
    });

    // Check if the user exists
    const user = await this.usersService.findOne(payload.sub);
    if (!user.refreshToken) {
      throw new UnauthorizedException('Invalid credentials');
    }

    // Check if the refresh token is valid
    const comparedResult =
      this.hashRefreshToken(refreshToken) === user.refreshToken;
    if (!comparedResult) {
      throw new UnauthorizedException('Invalid credentials');
    }

    // Generate a new JWT
    return await this.issueTokens(user.id, user.email);
  }

  async signOut(accessToken: string) {
    // Verify the access token
    // TODO: Add payload parse strategy
    const payload = await this.jwtService.verifyAsync(accessToken, {
      secret: this.ACCESS_SECRET,
    });

    await this.usersService.update(payload.sub, { refreshToken: null });
  }

  private async issueTokens(id: number, email: string) {
    // Generate JWT
    const tokens = await this.generateTokenByUser(id, email);

    // Hash the refresh token
    const hashedRefreshToken = this.hashRefreshToken(tokens.refresh_token);

    // Update the user refresh token
    await this.usersService.update(id, {
      refreshToken: hashedRefreshToken,
    });

    return tokens;
  }

  private hashRefreshToken(refreshToken: string) {
    return createHash('sha256').update(refreshToken).digest('hex');
  }

  private async generateTokenByUser(id: number, email: string) {
    // Define environment variables
    if (!this.ACCESS_SECRET || !this.REFRESH_SECRET) {
      throw new Error('JWT_SECRET is not defined');
    }

    // Generate JWT
    const payload = { sub: id, email, jti: randomUUID() };
    const tokens = {
      access_token: await this.jwtService.signAsync(payload, {
        expiresIn: '15m',
        secret: this.ACCESS_SECRET,
      }),
      refresh_token: await this.jwtService.signAsync(payload, {
        expiresIn: '7d',
        secret: this.REFRESH_SECRET,
      }),
    };
    return tokens;
  }
}
