import { Model } from "objection";

import { Permission } from "./Permission";
import { BaseModel } from "./BaseModel";
import { RolesPermission } from "./RolePermission";

export class Role extends BaseModel {
  static tableName = "roles";

  readonly id!: number;
  name: string;
  description: string;
  permissions?: Permission[];

  static relationMappings = {
    permissions: {
      relation: Model.ManyToManyRelation,
      modelClass: Permission,
      join: {
        from: `${Role.tableName}.id`,
        through: {
          from: `${RolesPermission.tableName}.role_id`,
          to: `${RolesPermission.tableName}.permission_id`,
        },
        to: `${Permission.tableName}.id`,
      },
    },
  };
}
