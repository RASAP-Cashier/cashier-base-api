import * as jwt from "jsonwebtoken";
import { compare } from "bcryptjs";
import { Transaction } from "objection";

import { SocialLogin, SocialLoginAttr, User } from "../models";
import config from "../config";
import { createUser, generateConfirmationHash, getUser, updateUserPassword, verifyConfirmation } from "./user.service";
import { BAD_LOGIN, INACTIVE_USER, permissionDenied, USER_NOT_FOUND } from "../shared/constants";
import { LoginDto, SetPasswordDto, SocialLoginDto, UserDto } from "../shared/dto";
import { getFullName, getUserName } from "../shared/functions";
import { sendEmail } from "../shared/external_api/postmark";

/**
 * Auth Service
 * @namespace AuthService
 */

/**
 * Function to create a JWT (JSON Web Token) for authorization.
 * @function createAuthorizationToken
 * @memberOf AuthService
 * @param {User} user - A User object from the UserModel.
 * @returns {Promise<string>} Returns a Promise that resolves to a JWT token string.
 */
export const createAuthorizationToken = async (user: User) => {
  const date = new Date();
  const expired = date.setHours(date.getHours() + 72);
  return jwt.sign(
    {
      user,
      expired,
      id: user.id,
    },
    config.jwt_secret,
  );
};

/**
 * Function to remove 'Bearer' prefix from an authorization token and return the token string.
 * @function getToken
 * @memberOf AuthService
 * @param {string} authorization - The user's authorization token, prefixed with 'Bearer'.
 * @returns {string|null} Returns the token string if present, otherwise null.
 */
export const getToken = (authorization: string): string => {
  if (!authorization) {
    return null;
  }

  const [, token] = authorization.split(" ");
  return token;
};

/**
 * Function to verify a user token. If the token is invalid, a permissionDenied {@link ErrorInterface} is thrown.
 * If the token is verified successfully, the function calls {@link getUser} and returns a User model.
 * If the user does not exist, a USER_NOT_FOUND {@link ErrorInterface} is thrown.
 * @function getUserFromToken
 * @memberOf AuthService
 * @param {string} token - The user's authorization token.
 * @returns {Promise<User>} - Returns a promise that resolves to the User model.
 * @throws {ErrorInterface} - Throws an error if the token is invalid or if the user does not exist.
 */
export const getUserFromToken = async (token: string): Promise<User> => {
  try {
    const decoded: any = jwt.verify(token, config.jwt_secret);
    const { id } = decoded;
    return getUser({ id }, USER_NOT_FOUND);
  } catch (e) {
    throw permissionDenied();
  }
};

/**
 * Function that tries to find a user by email. If the user does not exist, it throws a UserNotFound {@link ErrorInterface}.
 * It generates a confirmation hash using {@link generateConfirmationHash} and sends an email to the user.
 * @function sendVerifyEmail
 * @memberOf AuthService
 * @param {string} email - The user's email.
 * @param {string} currentUserName - The current user's name.
 * @param {Transaction} [transaction] - Optional knex transaction.
 * @returns {Promise<string>} - Returns the verification code (confirmation hash).
 */
export const sendVerifyEmail = async (email: string, currentUserName: string, transaction?: Transaction) => {
  const user = await getUser({ email }, USER_NOT_FOUND, transaction);
  const userName = currentUserName ? currentUserName : getUserName(user);

  const pin = await generateConfirmationHash(user, currentUserName, transaction);

  sendEmail({
    To: user.email,
    TemplateAlias: "confirm_email",
    TemplateModel: {
      PIN_CODE: pin,
    },
  });

  return pin;
};

/**
 * Function to verify user credentials and generate an authentication token.
 * It first checks if the user exists using the {@link getUser} method.
 * If the user does not exist, it throws a {@link ErrorInterface} with BAD_LOGIN.
 * If the user exists, it compares the provided password with the hashed password stored in UserModel.
 * If the user is not active, it triggers the {@link sendVerifyEmail} method and throws an error with INACTIVE_USER.
 * If all the checks are passed, it generates an authorization token using the
 * {@link createAuthorizationToken} method and returns the token.
 * @function loginUser
 * @memberOf AuthService
 * @param {LoginDto} payload - The user's email and password.
 * @returns {Promise<Object>} - Returns a promise that resolves to an object with a token string.
 * @throws {ErrorInterface} - Throws an error if the user does not exist, the password is incorrect, or the user is inactive.
 */
export const loginUser = async (payload: LoginDto) => {
  const user = await getUser({ email: payload.email }, BAD_LOGIN);
  const userName = getUserName(user);

  if (!(await compare(payload.password, user.password_hash))) {
    throw BAD_LOGIN;
  }

  if (!user.is_active) {
    await sendVerifyEmail(payload.email, userName);
    throw {
      message: `${INACTIVE_USER.message}. Check your email.`,
      httpStatus: INACTIVE_USER.httpStatus,
      meta: {
        isActive: false,
      },
    };
  }

  const token = await createAuthorizationToken(user);
  return { token };
};

/**
 * Function to send a password reset link to the user's email.
 * It checks if the user exists using the {@link getUser} method. If the user does not exist, it throws an {@link ErrorInterface}.
 * It generates a confirmation hash for the email using the {@link generateConfirmationHash} method.
 * It sends an email to the user with the password reset link and returns the generated hash.
 * @function forgotPassword
 * @memberOf AuthService
 * @param {Object} payload - The payload object containing the user's email.
 * @param {string} payload.email - The user's email.
 * @param {string} currentUserName - The current user's name.
 * @param {Transaction} [transaction] - Optional knex transaction.
 * @returns {Promise<string>} - Returns a promise that resolves to the generated hash.
 */
export const forgotPassword = async (
  payload: { email: string },
  currentUserName: string,
  transaction?: Transaction,
) => {
  const { email } = payload;
  const user = await getUser(
    { email },
    {
      message: "Email doesn't exist",
      httpStatus: BAD_LOGIN.httpStatus,
    },
    transaction,
  );

  const hash = await generateConfirmationHash(user, currentUserName, transaction);

  const url = `${config.frontend_url}auth/reset/${hash}`;

  const userName = getUserName(user);

  sendEmail({
    To: user.email,
    TemplateAlias: "password-reset",
    TemplateModel: {
      name: userName,
      action_url: url,
    },
  });

  return hash;
};

/**
 * Function which update user password.
 * Get user by hash with {@link verifyConfirmation}.
 * Update user password {@link updateUserPassword}.
 * return user token.
 * @function resetPassword
 * @memberOf AuthService
 * @param payload {SetPasswordDto}  - hash and password
 * @param currentUserName {string}
 * @returns {token:string}
 */
export const resetPassword = async (payload: SetPasswordDto, currentUserName: string) => {
  const { hash, password } = payload;
  const user = await verifyConfirmation({ confirmation_hash: hash }, currentUserName);
  return updateUserPassword(user.id, password, currentUserName);
};

/**
 * Function to login or register a user with a social login provider.
 * It checks if the user exists using the {@link getUser} method.
 * If the user does not exist, it calls the {@link createUser} method.
 * Next, it checks if a SocialLogin row exists with the social_id. If the row exists, it updates the row;
 * if it does not exist, it creates a new row.
 * @function socialLogin
 * @memberOf AuthService
 * @param {Transaction} [transaction] - Optional knex transaction.
 * @param {SocialLoginDto} payload - The payload containing the social login data.
 * @returns {Promise<{ token: string }>} - Returns a promise that resolves to an object with a token string.
 */
export const socialLogin = async (payload: SocialLoginDto, transaction?: Transaction) => {
  let user = await getUser({ email: payload.email });

  if (!user) {
    const { provider, social_id, ...rest } = payload;

    const userPayload: UserDto = rest;
    userPayload.first_name = payload.first_name || "John";
    userPayload.last_name = payload.last_name || "Doe";
    userPayload.password = (Math.random() + 1).toString(36).substring(2);

    user = await createUser({ ...userPayload, created_by: getFullName(userPayload) }, transaction);
  }
  const socialLoginPayload: Partial<SocialLoginAttr> = payload;
  socialLoginPayload.user_id = user.id;

  const social_login = await SocialLogin.query(transaction).where({ social_id: payload.social_id }).first();

  if (social_login) {
    await SocialLogin.query(transaction).updateAndFetchById(social_login.id, socialLoginPayload);
  } else {
    await SocialLogin.query(transaction).insertAndFetch(socialLoginPayload);
  }

  const token = await createAuthorizationToken(user);
  return { token };
};
