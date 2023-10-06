import { Joi } from "koa-joi-router";

import { ELoginProvider } from "../../models";

/**
 * @interface LoginDto
 * @property {string} password  user password
 * @property {string} email user email
 */
export interface LoginDto {
  password: string;
  email: string;
}

/**
 * @interface ForgotPasswordDto
 * @property {string} email user email
 */
export interface ForgotPasswordDto {
  email: string;
}

/**
 * @interface SetPasswordDto
 * @property {string} hash unique string
 * @property {string} password string
 */
export interface SetPasswordDto {
  hash: string;
  password: string;
}

/**
 * @interface ActivateAccountDto
 * @property {string} email user email
 * @property {string} confirmation_hash hash string generated on BE
 */
export interface ActivateAccountDto {
  confirmation_hash: string;
  email: string;
}

/**
 * @interface RegistrationDto
 * @property {string} first_name user name
 * @property {string} last_name user last name
 * @property {string} password user password
 * @property {string} password_confirm user password
 * @property {string} nickname user nickname
 */
export interface RegistrationDto {
  first_name: string;
  last_name: string;
  password: string;
  password_confirm: string;
  nickname: string;
  email: string;
}

/**
 @typedef {Object} SocialLoginDto
 @property {string} first_name - The user's first name.
 @property {string} last_name - The user's last name.
 @property {string} email - The user's email.
 @property {string} phone - The user's phone number.
 @property {string} photo - The user's photo URL.
 @property {ELoginProvider} provider - The provider of the social login service used by the user.
 @property {string} social_id - The user's unique ID from the social login provider.
 */
export interface SocialLoginDto {
  first_name: string;
  last_name: string;
  email: string;
  phone: string;
  photo: string;
  provider: ELoginProvider;
  social_id: string;
}
