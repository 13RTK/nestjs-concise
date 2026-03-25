import { Migration } from "@mikro-orm/migrations";

export class Migration20260318100255 extends Migration {
  override async up(): Promise<void> {
    this.addSql(`alter table "user" add "refresh_token" text null;`);
  }

  override async down(): Promise<void> {
    this.addSql(`alter table "user" drop column "refresh_token";`);
  }
}
