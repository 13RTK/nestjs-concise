import { OptionalProps, type Rel } from "@mikro-orm/core";
import { Entity, ManyToOne, PrimaryKey, Property } from "@mikro-orm/decorators/legacy";
import { User } from "../../users/entities/user.entity";
import { Article } from "../../articles/entities/article.entity";

@Entity()
export class Comment {
  [OptionalProps]?: 'createdAt';

  @PrimaryKey()
  id: number;

  @Property({ type: 'text' })
  content!: string;

  @Property()
  createdAt = new Date();

  @ManyToOne(() => User)
  author: Rel<User>;

  @ManyToOne(() => Article)
  article: Rel<Article>;
}
