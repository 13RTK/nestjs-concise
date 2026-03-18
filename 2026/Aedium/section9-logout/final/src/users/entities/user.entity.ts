import { Collection } from '@mikro-orm/core';
import {
  Entity,
  OneToMany,
  PrimaryKey,
  Property,
} from '@mikro-orm/decorators/legacy';
import { Article } from '../../articles/entities/article.entity';

@Entity()
export class User {
  @PrimaryKey()
  id: number;

  @Property()
  username: string;

  @Property()
  email: string;

  @Property({ type: 'text' })
  password: string;

  @OneToMany(() => Article, (article) => article.author, { nullable: true })
  articles = new Collection<Article>(this);

  @Property({ type: 'text', nullable: true })
  refreshToken?: string | null;
}
