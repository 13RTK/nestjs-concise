import { ConflictException, Injectable } from '@nestjs/common';
import { UsersService } from '../users/users.service';
import * as bcrypt from 'bcrypt';

@Injectable()
export class AuthService {
  constructor(private usersService: UsersService) {}

  async signUp(email: string, password: string): Promise<any> {
    const user = await this.usersService.findOne(email);
    if (user) {
      throw new ConflictException('User with this email already exists');
    }

    // Hash password, create user
    const hashedPassword = await bcrypt.hash(password, 10);

    await this.usersService.create({
      email,
      password: hashedPassword,
    });

    return {
      email,
    };
  }
}
