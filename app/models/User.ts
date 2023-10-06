import { join } from "path";

import { Model } from "objection";

import { Role } from "./Role";
import { SocialLogin } from "./SocialLogin";

export interface UserAttr {
  readonly id: number;
  first_name: string;
  last_name: string;
  phone: string;
  email: string;
  photo: string;
  password_hash: string;
  is_active: boolean;
  is_email_verified: boolean;
  created_at: Date;
  updated_at: Date;
  created_by: string;
  updated_by: string;
  questionnaire_confirmation_date: Date;
  questionnaire_skip_date: Date;
  resized_photo: string;
}

export type UserFields = keyof User;

export const defaultUserFields: UserFields[] = ["id", "first_name", "last_name", "phone", "email", "is_active"];

//todo remove city from db
//todo add is_email_verified from db

export class User extends Model {
  static tableName = "users";

  readonly id!: number;
  first_name!: string;
  last_name!: string;
  phone: string;
  email!: string;
  photo: string;
  password_hash: string;

  created_at: Date;
  updated_at: Date;
  created_by: string;
  updated_by: string;
  is_active: boolean;
  is_email_verified: boolean;
  confirmation_hash: string;

  roles?: Role[];

  static relationMappings = {
    roles: {
      relation: Model.ManyToManyRelation,
      modelClass: join(__dirname, "Role"),
      join: {
        from: "users.id",
        through: {
          from: "user_roles.user_id",
          to: "user_roles.role_id",
        },
        to: "roles.id",
      },
    },
    social_login: {
      relation: Model.HasManyRelation,
      modelClass: join(__dirname, "SocialLogin"),
      join: {
        to: `${User.tableName}.id`,
        from: `${SocialLogin.tableName}.user_id`,
      },
    },
  };
}
