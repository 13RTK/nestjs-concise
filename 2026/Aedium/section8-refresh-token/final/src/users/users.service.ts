import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { InjectRepository } from '@mikro-orm/nestjs';
import { User } from './entities/user.entity';
import { EntityManager, EntityRepository } from '@mikro-orm/postgresql';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: EntityRepository<User>,
    private readonly em: EntityManager,
  ) {}

  async create(createUserDto: CreateUserDto) {
    const user = this.userRepository.create({
      username: `${Date.now()}`,
      ...createUserDto,
    });

    await this.em.flush();

    return user;
  }

  // Admin
  findAll() {
    return `This action returns all users`;
  }

  async findOne(id: number) {
    const user = await this.userRepository.findOne(id, {
      populate: ['articles'],
      exclude: [
        'password',
        'articles.content',
        'articles.createdAt',
        'articles.updatedAt',
      ],
    });

    if (!user) {
      throw new NotFoundException('User not found');
    }

    return user;
  }

  async findUserByEmail(email: string) {
    const user = await this.userRepository.findOne({ email });

    return user;
  }

  update(id: number, updateUserDto: UpdateUserDto) {
    return `This action updates a #${id} user`;
  }

  remove(id: number) {
    return `This action removes a #${id} user`;
  }
}
