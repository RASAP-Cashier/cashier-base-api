import { ParameterizedContext } from "koa";

import { createUser, getUser, updateUser } from "../services/user.service";
import {
  createAuthorizationToken,
  forgotPassword,
  loginUser,
  resetPassword,
  sendVerifyEmail,
  socialLogin,
} from "../services/auth.service";
import knex from "../shared/utils/knex";
import {
  customUnprocessableError,
  USER_CODE_NOT_VALID,
  USER_HASH_NOT_VALID,
  USER_NOT_FOUND,
} from "../shared/constants";
import { ActivateAccountDto, LoginDto, RegistrationDto, SetPasswordDto, SocialLoginDto, UserDto } from "../shared/dto";
import { getUserName } from "../shared/functions";
import { RequestInterface } from "../interfaces";

/**
 * Auth Controller
 * @namespace AuthController
 */

/**
 * Function that checks if a user exists in the system.
 * @function checkUserHandler
 * @memberOf AuthController
 * @param {RequestInterface<{ email: string }>} ctx - The context object encapsulating the request with
 * a body containing an email string.
 * @returns {Promise<{isUserExist: boolean}>} Returns a Promise that resolves to an object with a
 * boolean property "isUserExist".
 */
export const checkUserHandler = async (ctx: RequestInterface<{ email: string }>) => {
  const user = await getUser({ email: ctx.request.body.email });

  ctx.ok({
    isUserExist: !!user,
  });
};

/**
 * Function that logs in a user and provides an access token.
 * It calls the {@link loginUser} function which attempts to log in the user and returns a token.
 * @function loginHandler
 * @memberOf AuthController
 * @param {RequestInterface<LoginDto>} ctx - The context object encapsulating the request with a body of type LoginDto.
 * @returns {Promise<{token: string}>} Returns a Promise that resolves to an object with a token string.
 */
export const loginHandler = async (ctx: RequestInterface<LoginDto>) => {
  const { body } = ctx.request;

  const result = await loginUser(body);
  ctx.ok(result);
};

/**
 * Function that registers a user and provides an access token.
 * It calls the {@link getUser} function which checks if the user exists.
 * If the user exists, it throws an error.
 * If the user does not exist, it calls {@link createUser} which creates and returns the user.
 * After the user is created, it calls {@link createAuthorizationToken} which generates a token from the user data.
 * @function registrationHandler
 * @memberOf AuthController
 * @param {RequestInterface<RegistrationDto>} ctx - The context object encapsulating the request with
 * a body of type RegistrationDto.
 * @returns {Promise<{token: string}>} Returns a Promise that resolves to an object with a token string.
 */
export const registrationHandler = async (ctx: RequestInterface<RegistrationDto>) => {
  const data: RegistrationDto = ctx.request.body;

  return knex.transaction(async (transaction) => {
    const { password_confirm, ...userData } = data;
    const exists = !!(await getUser({ email: userData.email }, null, transaction));

    if (exists) {
      throw customUnprocessableError("Email already exists");
    }

    const user = await createUser({ ...userData }, transaction);

    const token = await createAuthorizationToken(user);

    ctx.ok({ token });
  });
};

/**
 * Function that verifies a user's account.
 * It calls the {@link getUser} function which checks if the user exists and retrieves the username.
 * If the user's confirmation_hash does not match payload.confirmation_hash, it throws an error.
 * If the confirmation_hash matches, it calls {@link updateUser} to set is_email_verified to
 * true and confirmation_hash to null.
 * @function verifyAccountHandler
 * @memberOf AuthController
 * @param {RequestInterface<ActivateAccountDto>} ctx - The context object encapsulating the request
 * with a body of type ActivateAccountDto.
 * @returns {Promise<{status: string}>} Returns a Promise that resolves to an object with a status string.
 */
export const verifyAccountHandler = async (ctx: RequestInterface<ActivateAccountDto>) => {
  const data: ActivateAccountDto = ctx.request.body;

  return knex.transaction(async (transaction) => {
    const user = await getUser({ email: data.email }, USER_NOT_FOUND, transaction);
    const userName = getUserName(user);

    if (user.confirmation_hash !== data.confirmation_hash) {
      throw USER_CODE_NOT_VALID;
    }

    await updateUser(
      user.id,
      {
        is_email_verified: true,
        confirmation_hash: null,
      },
      userName,
      transaction,
    );

    ctx.ok({ status: "ok" });
  });
};

/**
 * Function that sends a password restore link to the user's email.
 * It calls the {@link forgotPassword} function which checks if the user exists.
 * @function forgotPasswordHandler
 * @memberOf AuthController
 * @param {RequestInterface<{ email: string }>} ctx - The context object encapsulating the request
 * with a body containing the user's email.
 * @returns {Promise<{status: string}>} Returns a Promise that resolves to an object with a status string.
 */
export const forgotPasswordHandler = async (ctx: RequestInterface<{ email: string }>) => {
  const { body } = ctx.request;
  const currentUserName = getUserName(ctx.user);
  return knex.transaction(async (transaction) => {
    await forgotPassword(body, currentUserName, transaction);
    return ctx.ok({ status: "ok" });
  });
};

/**
 * Function to update the user's password.
 * It calls the {@link getUser} function to verify if the confirmation_hash is valid. If not,
 * it throws an error.
 * If the hash is valid, it calls the {@link resetPassword} function to update the user's password.
 * @function resetPasswordHandler
 * @memberOf AuthController
 * @param {RequestInterface<SetPasswordDto>} ctx - The context object encapsulating the request with a body
 * of type SetPasswordDto.
 * @returns {Promise<{token:string}>} Returns a Promise that resolves to a token string.
 */
export const resetPasswordHandler = async (ctx: RequestInterface<SetPasswordDto>) => {
  const { body } = ctx.request;
  const currentUserName = getUserName(ctx.user);

  await getUser({ confirmation_hash: body.hash }, USER_HASH_NOT_VALID);

  const token = await resetPassword(body, currentUserName);
  return ctx.ok(token);
};

/**
 * Function that logs in or registers a user with a social login provider.
 * It calls the {@link socialLogin} function, which will log in the user. If the user does not exist, it creates one.
 * If the user is logging in with the current provider for the first time, it creates a row in the social_logins table.
 * @function socialLoginHandler
 * @memberOf AuthController
 * @param {RequestInterface<SocialLoginDto>} ctx - The context object encapsulating the request with a body
 * of type SocialLoginDto.
 * @returns {Promise<string>} Returns a Promise that resolves to a token string.
 */
export const socialLoginHandler = async (ctx: RequestInterface<SocialLoginDto>) => {
  const data: SocialLoginDto = ctx.request.body;
  return knex.transaction(async (transaction) => {
    const token = await socialLogin(data, transaction);
    return ctx.ok(token);
  });
};

/**
 * Function to resend the activation email to the user.
 * It calls the {@link sendVerifyEmail} function, which checks if the user exists.
 * If the user does not exist, it throws an error as defined by {@link ErrorInterface}.
 * @function resendEmailHandler
 * @memberOf AuthController
 * @param {RequestInterface<{ email: string }>} ctx - The context object encapsulating the request with a
 * body that contains an email property.
 * @returns {Promise<{status:string}>} Returns a Promise that resolves to an object with a status string.
 */
export const resendEmailHandler = async (ctx: RequestInterface<{ email: string }>) => {
  const user = await getUser({ email: ctx.request.body.email }, USER_NOT_FOUND);
  const currentUserName = getUserName(user);
  await sendVerifyEmail(user.email, currentUserName);

  ctx.ok({ status: "ok" });
};
