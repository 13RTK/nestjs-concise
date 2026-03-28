import { Collection, OptionalProps, type Rel } from '@mikro-orm/core';
import {
  Entity,
  Enum,
  ManyToOne,
  OneToMany,
  PrimaryKey,
  Property,
} from '@mikro-orm/decorators/legacy';

import { User } from '../../users/entities/user.entity';
import { Comment } from '../../comments/entities/comment.entity';

export enum ArticleStatus {
  DRAFT = 'draft',
  PUBLISHED = 'published',
}

@Entity()
export class Article {
  [OptionalProps]?: 'createdAt' | 'updatedAt';

  @PrimaryKey()
  id: number;

  @Property()
  title!: string;

  @Property({ type: 'text' })
  content!: string;

  @Enum(() => ArticleStatus)
  status!: ArticleStatus;

  @Property()
  createdAt = new Date();

  @Property({ onUpdate: () => new Date() })
  updatedAt = new Date();

  @ManyToOne(() => User)
  author: Rel<User>;

  @OneToMany(() => Comment, (comment) => comment.article, { nullable: true })
  comments = new Collection<Comment>(this);
}
