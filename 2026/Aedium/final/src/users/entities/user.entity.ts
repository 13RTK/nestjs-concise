import { Collection } from '@mikro-orm/core';
import {
  Entity,
  Enum,
  OneToMany,
  PrimaryKey,
  Property,
} from '@mikro-orm/decorators/legacy';

import { Article } from '../../articles/entities/article.entity';
import { Role } from '../../auth/enums/role.enum';
import { Comment } from '../../comments/entities/comment.entity';

@Entity()
export class User {
  @PrimaryKey()
  id: number;

  @Property({ unique: true })
  username!: string;

  @Property({ unique: true })
  email!: string;

  @Property({ type: 'text' })
  password!: string;

  @OneToMany(() => Article, (article) => article.author, { nullable: true })
  articles = new Collection<Article>(this);

  @OneToMany(() => Comment, (comment) => comment.author, { nullable: true })
  comments = new Collection<Comment>(this);

  @Property({ type: 'text', nullable: true })
  refreshToken?: string | null;

  @Enum({ items: () => Role, array: true, default: [Role.User] })
  roles = [Role.User];
}
