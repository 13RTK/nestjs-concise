import { faker } from '@faker-js/faker';
import { Factory } from '@mikro-orm/seeder';

import { Comment } from '../src/comments/entities/comment.entity';

export class CommentFactory extends Factory<Comment> {
  model = Comment;

  definition(): Partial<Comment> {
    return {
      content: faker.lorem.lines(1),
    };
  }
}
