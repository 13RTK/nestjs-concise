import { Collection } from '@mikro-orm/core';
import { Entity, Enum, OneToMany, PrimaryKey, Property } from '@mikro-orm/decorators/legacy';

import { Article } from '../../articles/entities/article.entity';
import { Role } from '../../auth/enums/role.enum';

@Entity()
export class User {
  @PrimaryKey()
  id: number;

  @Property({ unique: true })
  username: string;

  @Property({ unique: true })
  email: string;

  @Property({ type: 'text' })
  password: string;

  @OneToMany(() => Article, (article) => article.author, { nullable: true })
  articles = new Collection<Article>(this);

  @Property({ type: 'text', nullable: true })
  refreshToken?: string | null;

  @Enum({ default: [Role.User] })
  roles = [Role.User];
}
