import {
  ConflictException,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { UsersService } from '../users/users.service';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
  ) {}

  async signIn(email: string, pass: string): Promise<{ access_token: string }> {
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
    const payload = { sub: user.id, email: user.email };
    return {
      access_token: await this.jwtService.signAsync(payload),
    };
  }

  async signUp(email: string, pass: string): Promise<{ access_token: string }> {
    // Check if user already exists
    const user = await this.usersService.findUserByEmail(email);
    if (user) {
      throw new ConflictException('User with this email already exists');
    }

    // Hash the password
    const rounds = 10;
    const hashedPassword = await bcrypt.hash(pass, rounds);

    // Create the user
    const createdUser = await this.usersService.create({
      email,
      password: hashedPassword,
    });

    const payload = { sub: createdUser.id, email: createdUser.email };
    // Generate a JWT and return it here
    return {
      access_token: await this.jwtService.signAsync(payload),
    };
  }
}
