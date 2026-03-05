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

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
  ) {}

  async signIn(email: string, pass: string): Promise<{ access_token: string }> {
    const user = await this.usersService.findOne(email);
    if (!user) {
      throw new NotFoundException('User not found');
    }

    const comparedResult = await bcrypt.compare(pass, user.password);
    if (!comparedResult) {
      throw new UnauthorizedException('Invalid credentials');
    }

    return this.generateUserToken(user);
  }

  private async generateUserToken(user: User) {
    const payload = { sub: user.id, username: user.email };
    return {
      access_token: await this.jwtService.signAsync(payload),
    };
  }

  async signUp(
    email: string,
    password: string,
  ): Promise<{ access_token: string }> {
    const user = await this.usersService.findOne(email);
    if (user) {
      throw new ConflictException('User with this email already exists');
    }

    // Hash password, create user
    const hashedPassword = await bcrypt.hash(password, 10);

    const createdUser = await this.usersService.create({
      email,
      password: hashedPassword,
    });

    return this.generateUserToken(createdUser);
  }
}
