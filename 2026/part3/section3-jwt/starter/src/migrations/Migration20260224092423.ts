import { Migration } from '@mikro-orm/migrations';

export class Migration20260224092423 extends Migration {

  override async up(): Promise<void> {
    this.addSql(`alter table "todo" alter column "content" type text using ("content"::text);`);
  }

  override async down(): Promise<void> {
    this.addSql(`alter table "todo" alter column "content" type varchar(255) using ("content"::varchar(255));`);
  }

}
