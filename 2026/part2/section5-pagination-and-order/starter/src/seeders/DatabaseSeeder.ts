import type { EntityManager } from '@mikro-orm/core';
import { Seeder } from '@mikro-orm/seeder';
import { TodoFactory } from './TodoFactory';

export class DatabaseSeeder extends Seeder {
  async run(em: EntityManager): Promise<void> {
    new TodoFactory(em).make(10);
  }
}
