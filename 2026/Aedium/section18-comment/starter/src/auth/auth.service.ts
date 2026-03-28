import {
  ConflictException,
  HttpStatus,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { Request } from 'express';
import { createHash, randomUUID } from 'node:crypto';

import { UsersService } from '../users/users.service';
import { Role } from './enums/role.enum';

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
    return await this.issueTokens(user.id, user.email, user.roles);
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
    return await this.issueTokens(createdUser.id, createdUser.email, createdUser.roles);
  }

  async refresh(request: Request) {
    // Extract the refresh token
    const refreshToken = this.extractTokenFromHeader(request);
    if (!refreshToken) {
      throw new UnauthorizedException('Invalid credentials');
    }

    // Verify the refresh token
    const payload = await this.jwtService.verifyAsync(refreshToken, {
      secret: this.REFRESH_SECRET,
    });

    // Check if the user exists
    const user = await this.usersService.findOne(Number(payload.sub));
    if (!user.refreshToken) {
      throw new UnauthorizedException('Invalid credentials');
    }

    // Check if the refresh token is valid
    const comparedResult = this.hashRefreshToken(refreshToken) === user.refreshToken;
    if (!comparedResult) {
      throw new UnauthorizedException('Invalid credentials');
    }

    // Generate a new JWT
    return await this.issueTokens(user.id, user.email, user.roles);
  }

  async signOut(payload: any) {
    await this.usersService.update(payload.sub, { refreshToken: null });

    return { statusCode: HttpStatus.OK, message: 'Successfully signed out' };
  }

  private async issueTokens(id: number, email: string, roles: Role[]) {
    // Generate JWT
    const tokens = await this.generateTokenByUser(id, email, roles);

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

  private async generateTokenByUser(id: number, email: string, roles: Role[]) {
    // Define environment variables
    if (!this.ACCESS_SECRET || !this.REFRESH_SECRET) {
      throw new Error('JWT_SECRET is not defined');
    }

    // Generate JWT
    const payload = { sub: id, email, jti: randomUUID(), roles };
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

  extractTokenFromHeader(request: Request): string | undefined {
    const [type, token] = request.headers.authorization?.split(' ') ?? [];

    return type === 'Bearer' ? token : undefined;
  }
}
