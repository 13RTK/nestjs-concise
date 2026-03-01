import { Entity, PrimaryKey, Property } from '@mikro-orm/core';

@Entity()
export class User {
  @PrimaryKey()
  id: number;

  @Property({ unique: true })
  email: string;

  @Property()
  password: string;
}
