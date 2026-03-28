import { Migration } from '@mikro-orm/migrations';

export class Migration20260328085518 extends Migration {

  override up(): void | Promise<void> {
    this.addSql(`create table "comment" ("id" serial primary key, "content" text not null, "created_at" timestamptz not null, "author_id" int not null, "article_id" int not null);`);

    this.addSql(`alter table "comment" add constraint "comment_author_id_foreign" foreign key ("author_id") references "user" ("id");`);
    this.addSql(`alter table "comment" add constraint "comment_article_id_foreign" foreign key ("article_id") references "article" ("id");`);
  }

  override down(): void | Promise<void> {
    this.addSql(`drop table if exists "comment" cascade;`);
  }

}
