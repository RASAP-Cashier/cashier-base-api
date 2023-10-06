import { Model } from "objection";

export class RolesPermission extends Model {
  static tableName = "role_permissions";

  readonly id!: number;
  role_id!: number;
  permission_id!: string;
}
