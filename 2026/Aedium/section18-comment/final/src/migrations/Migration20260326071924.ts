import { Migration } from '@mikro-orm/migrations';

export class Migration20260326071924 extends Migration {

  override up(): void | Promise<void> {
    this.addSql(`alter table "user" add "roles" text[] not null default '{user}';`);
    this.addSql(`alter table "user" add constraint "user_username_unique" unique ("username");`);
    this.addSql(`alter table "user" add constraint "user_email_unique" unique ("email");`);
    this.addSql(`alter table "user" add constraint "user_roles_check" check ("roles" <@ array['user'::text, 'admin'::text]);`);
  }

  override down(): void | Promise<void> {
    this.addSql(`alter table "user" drop constraint "user_username_unique";`);
    this.addSql(`alter table "user" drop constraint "user_email_unique";`);
    this.addSql(`alter table "user" drop constraint "user_roles_check";`);
    this.addSql(`alter table "user" drop column "roles";`);
  }

}
