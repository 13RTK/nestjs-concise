import { faker } from "@faker-js/faker";
import { Seeder } from "@mikro-orm/seeder";

import { ArticleFactory } from "./ArticleFactory";
import { UserFactory } from "./UserFactory";

import type { EntityManager } from "@mikro-orm/core";

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
  }
}
