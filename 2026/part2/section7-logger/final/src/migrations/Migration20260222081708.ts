import { Migration } from '@mikro-orm/migrations';

export class Migration20260222081708 extends Migration {

  override async up(): Promise<void> {
    this.addSql(`create table "todo" ("id" serial primary key, "title" varchar(255) not null, "content" varchar(255) not null, "is_completed" boolean not null);`);

    this.addSql(`drop table if exists "user" cascade;`);
  }

  override async down(): Promise<void> {
    this.addSql(`create table "user" ("id" serial primary key, "email" varchar(255) not null, "password" varchar(255) not null);`);
    this.addSql(`alter table "user" add constraint "user_email_unique" unique ("email");`);

    this.addSql(`drop table if exists "todo" cascade;`);
  }

}
