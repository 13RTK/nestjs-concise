import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateTodoDto } from './dto/create-todo.dto';
import { UpdateTodoDto } from './dto/update-todo.dto';
import { EntityManager, EntityRepository } from '@mikro-orm/postgresql';
import { InjectRepository } from '@mikro-orm/nestjs';
import { Todo } from './entities/todo.entity';

@Injectable()
export class TodosService {
  constructor(
    private readonly em: EntityManager,
    @InjectRepository(Todo)
    private readonly todoRepository: EntityRepository<Todo>,
  ) {}

  async create(createTodoDto: CreateTodoDto) {
    const todo = this.todoRepository.create(createTodoDto);

    await this.em.flush();

    return todo;
  }

  async findAll() {
    return await this.todoRepository.findAll();
  }

  async findOne(id: number) {
    const todo = await this.todoRepository.findOne(id);

    if (!todo) {
      throw new NotFoundException();
    }

    return todo;
  }

  async update(id: number, updateTodoDto: UpdateTodoDto) {
    const todo = await this.findOne(id);

    this.em.assign(todo, updateTodoDto);
    await this.em.flush();

    return todo;
  }

  async remove(id: number) {
    const todo = await this.findOne(id);

    await this.em.remove(todo).flush();

    return todo;
  }
}
