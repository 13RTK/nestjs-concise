import { Factory } from '@mikro-orm/seeder';
import { faker } from '@faker-js/faker';
import { Todo } from '../todos/entities/todo.entity';

export class TodoFactory extends Factory<Todo> {
  model = Todo;

  definition(): Partial<Todo> {
    return {
      title: faker.book.title(),
      content: faker.lorem.text(),
      isCompleted: faker.datatype.boolean(),
    };
  }
}
