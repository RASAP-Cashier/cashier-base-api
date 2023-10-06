import { Model } from "objection";

import { BaseModel } from "./BaseModel";

export class Permission extends BaseModel {
  static tableName = "permissions";

  readonly id!: number;
  name: string;
  description: string;
}
