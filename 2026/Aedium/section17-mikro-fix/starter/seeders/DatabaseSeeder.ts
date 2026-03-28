import { faker } from '@faker-js/faker';
import { Seeder } from '@mikro-orm/seeder';
import * as bcrypt from 'bcrypt';

import { ArticleFactory } from './ArticleFactory';
import { UserFactory } from './UserFactory';

import type { EntityManager } from '@mikro-orm/core';
import { Role } from '../src/auth/enums/role.enum';

export class DatabaseSeeder extends Seeder {
  async run(em: EntityManager): Promise<void> {
    new UserFactory(em)
      .each((user) => {
        const articleCount = faker.number.int({ min: 0, max: 3 });

        if (!articleCount) {
          return;
        }

        user.articles.set(new ArticleFactory(em).make(articleCount));
      })
      .make(10);

    const ADMIN_PASSWORD = 'alexjohnadmin';
    const password = await bcrypt.hash(ADMIN_PASSWORD, 10);

    new UserFactory(em).makeOne({
      username: ADMIN_PASSWORD,
      email: `${ADMIN_PASSWORD}@example.com`,
      password,
      roles: [Role.Admin],
    });
  }
}
