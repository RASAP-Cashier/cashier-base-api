import { join } from "path";

import { Model } from "objection";

import { Role } from "./Role";

export class UserRole extends Model {
  static tableName = "user_roles";

  readonly id!: number;
  role_id!: number;
  user_id!: number;

  role?: Role;

  static relationMappings = {
    role: {
      relation: Model.HasOneRelation,
      modelClass: join(__dirname, "Role"),
      join: {
        from: "user_roles.role_id",
        to: "roles.id",
      },
    },
  };
}
