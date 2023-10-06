import { join } from "path";

import { Model, QueryBuilder } from "objection";

import { User } from "./User";

/**
 * Enumeration for Login Providers.
 * @enum {string}
 * @property {string} google - Represents Google as a login provider.
 * @property {string} facebook - Represents Facebook as a login provider.
 * @property {string} apple - Represents Apple as a login provider.
 */
export enum ELoginProvider {
  google = "google",
  facebook = "facebook",
  apple = "apple",
}

export interface SocialLoginAttr {
  readonly id: number;
  provider: ELoginProvider;
  social_id: string;
  first_login: Date;
  last_login: Date;
  user_id: number;
  first_name: string;
  last_name: string;
  photo: string;
  email: string;
}

export type SocialLoginFields = keyof SocialLogin;

export const defaultSocialLoginFields: SocialLoginFields[] = ["id", "first_name", "last_name", "email", "photo"];

export class SocialLogin extends Model {
  static tableName = "social_logins";

  readonly id!: number;
  provider: ELoginProvider;
  social_id: string;
  first_login: Date;
  last_login: Date;
  user_id: number;

  first_name: string;
  last_name: string;
  photo: string;
  email: string;

  user?: User;

  static modifiers = {
    defaultSelects(builder: QueryBuilder<SocialLogin>) {
      builder.select(defaultSocialLoginFields.map((field) => `${SocialLogin.tableName}.${field}`));
    },
  };

  static relationMappings = {
    user: {
      relation: Model.HasOneRelation,
      modelClass: join(__dirname, "User"),
      join: {
        from: `${SocialLogin.tableName}.user_id`,
        to: `users.id`,
      },
    },
  };
}
