import * as securePin from "secure-pin/index";
import { genSalt, hash } from "bcryptjs";
import { Transaction } from "objection";

import { defaultUserFields, User } from "../models";
import { USER_CODE_NOT_VALID, USER_HASH_NOT_VALID, USER_NOT_FOUND } from "../shared/constants";
import { ErrorInterface, ModelWhere } from "../interfaces";
import { UpdateUserDto, UserDto } from "../shared/dto";
import { createAuthorizationToken } from "./auth.service";
import { uploadImage, uploadResizedImage } from "../shared/external_api/s3";
import { getUserName } from "../shared/functions";

/**
 * User Service
 * @namespace UserService
 */

/**
 * Function to change the user's password.
 * It checks if the user exists by userId. If the user does not exist, it throws a {@link ErrorInterface} with USER_NOT_FOUND.
 * If the user is found, it generates a new password hash using the {@link generatePasswordHash} method.
 * @function changeUserPassword
 * @memberOf UserService
 * @param {Object} options - The options object containing the userId and password.
 * @param {number} options.userId - The id of the user in the database.
 * @param {string} options.password - The new password.
 * @param {string} currentUserName - The name of the user who made the changes.
 * @param {Transaction} [transaction] - Optional knex transaction.
 * @returns {Promise<User>} - Returns a promise that resolves to the updated User model.
 * @throws {ErrorInterface} - Throws an error if the user does not exist.
 */
export const changeUserPassword = async (
  { userId, password }: { userId: number; password: string },
  currentUserName: string,
  transaction?: Transaction,
): Promise<User> => {
  const user = await User.query().findById(userId);

  if (!user) throw USER_NOT_FOUND;

  const password_hash = await generatePasswordHash(password);

  return User.query(transaction).updateAndFetchById(userId, {
    password_hash,
    updated_by: currentUserName,
  });
};

/**
 * Function to update a user.
 * It checks if the user exists by userId. If the user does not exist, it throws a {@link ErrorInterface} with USER_NOT_FOUND.
 * If there is a password in the userDto, it also changes the user's password using the {@link changeUserPassword} method.
 * @function updateUser
 * @memberOf UserService
 * @param {number} userId - The id of the user in the database.
 * @param {Partial<UserDto>} userDto - The payload containing the user data to be updated.
 * @param {string} currentUserName - The name of the user who made the changes.
 * @param {Transaction} [transaction] - Optional knex transaction.
 * @returns {Promise<User>} - Returns a promise that resolves to the updated User model.
 * @throws {ErrorInterface} - Throws an error if the user does not exist.
 */
export const updateUser = async (
  userId: number,
  userDto: Partial<UserDto>,
  currentUserName: string,
  transaction?: Transaction,
): Promise<User> => {
  const user = await User.query(transaction).findById(userId);

  if (!user) throw USER_NOT_FOUND;

  const { password, ...data } = userDto;

  if (password) {
    await changeUserPassword({ userId, password }, currentUserName, transaction);
  }

  const updatedUser = await User.query(transaction).updateAndFetchById(userId, {
    updated_by: currentUserName,
    ...data,
  });

  return updatedUser;
};

/**
 * Function to generate a confirmation hash and save it in the user using the {@link updateUser} method.
 * @function generateConfirmationHash
 * @memberOf UserService
 * @param {User} user - The user model.
 * @param {string} currentUserName - The name of the user who made the changes.
 * @param {Transaction} [transaction] - Optional knex transaction.
 * @returns {Promise<string>} - Returns a promise that resolves to the generated confirmation hash.
 */
export const generateConfirmationHash = async (
  user: User,
  currentUserName: string,
  transaction?: Transaction,
): Promise<string> => {
  const hash = securePin.generateStringSync(20, securePin.defaultCharset);

  const payload: Partial<UserDto> = {
    confirmation_hash: hash,
  };

  await updateUser(user.id, payload, currentUserName, transaction);
  return hash;
};

/**
 * Function to generate a hash string from a password.
 * @function generatePasswordHash
 * @memberOf UserService
 * @param {string} payload - The password to generate the hash from.
 * @returns {Promise<string>} - Returns a promise that resolves to the generated hash.
 */
export const generatePasswordHash = async (payload: string) => {
  const salt = await genSalt(10);
  return hash(payload.toString(), salt);
};

/**
 * Function to find a user based on a WHERE clause that partially includes UserModel fields.
 * If the user is not found and an error is provided, it throws the provided error.
 * @function getUser
 * @memberOf UserService
 * @param {ModelWhere<User>} where - The WHERE clause according to the user model.
 * @param {ErrorInterface} [error] - The error to throw if the user is not found.
 * @param {Transaction} [transaction] - Optional knex transaction.
 * @returns {Promise<User>} - Returns a promise that resolves to the user model.
 * @throws {ErrorInterface} - Throws the provided error if the user is not found.
 */
export const getUser = async (
  where: ModelWhere<User>,
  error?: ErrorInterface,
  transaction?: Transaction,
): Promise<User> => {
  const user = await User.query(transaction).where(where).first();

  if (!user && error) {
    throw error;
  }

  return user;
};

/**
 * Function to create a user from a UserDto and generate a password hash using the {@link generatePasswordHash} method.
 * @function createUser
 * @memberOf UserService
 * @param {UserDto} userDto - The user data.
 * @param {Transaction} [transaction] - Optional knex transaction.
 * @returns {Promise<User>} - Returns a promise that resolves to the created User model.
 */
export const createUser = async (userDto: UserDto, transaction?: Transaction) => {
  const { password, ...data } = userDto;

  const password_hash = await generatePasswordHash(password);

  return User.query(transaction).insertAndFetch({
    ...data,
    password_hash,
  });
};

/**
 * Function to activate a user.
 * It tries to find a user by confirmation_hash using the {@link getUser} method.
 * If the user is found, it updates the user using the {@link updateUser} method,
 * or throws a {@link ErrorInterface} if the confirmation_hash is not valid.
 * @function verifyConfirmation
 * @memberOf UserService
 * @param {Object} confirmationData - The object containing the confirmation_hash string.
 * @param {string} confirmationData.confirmation_hash - The confirmation hash.
 * @param {string} currentUserName - The name of the user who made the changes.
 * @returns {Promise<User>} - Returns a promise that resolves to the updated User model.
 * @throws {ErrorInterface} - Throws an error if the confirmation_hash is not valid.
 */
export const verifyConfirmation = async (confirmationData: { confirmation_hash?: string }, currentUserName: string) => {
  const user = await getUser(
    confirmationData,
    confirmationData.confirmation_hash ? USER_CODE_NOT_VALID : USER_HASH_NOT_VALID,
  );

  return updateUser(
    user.id,
    {
      confirmation_hash: null,
      is_active: true,
    },
    currentUserName,
  );
};

/**
 * Function to change a user's password.
 * It changes the user's password using the {@link changeUserPassword} method,
 * and then provides the user's token using the {@link createAuthorizationToken} method.
 * @function updateUserPassword
 * @memberOf UserService
 * @param {number} id - The userId.
 * @param {string} password - The new password.
 * @param {string} currentUserName - The name of the user who made the changes.
 * @returns {Promise<{ token: string }>} - Returns a promise that resolves to an object with the authorization token.
 */
export const updateUserPassword = async (id: number, password: string, currentUserName: string) => {
  const currentUser = await changeUserPassword({ password, userId: id }, currentUserName);

  const token = await createAuthorizationToken(currentUser);

  return { token };
};

/**
 * Function to find a user based on a WHERE clause that partially includes UserModel fields.
 * The list of fields changed by defaultUserFields.
 * @function findUser
 * @memberOf UserService
 * @param {ModelWhere<User>} where - The WHERE clause according to the user model.
 * @param {Transaction} [transaction] - Optional knex transaction.
 * @returns {Promise<User>} - Returns a promise that resolves to the user model.
 */
export const findUser = async (where: ModelWhere<User>, transaction?: Transaction) => {
  const selects = defaultUserFields.map((s) => `${User.tableName}.${s}`);

  return User.query(transaction)
    .select([...selects])
    .where(where)
    .first();
};

/**
 * Function to update a user's profile.
 * If there is a photo in the data, it uploads the user's photo to S3 using the {@link uploadImage} and {@link uploadResizedImage} methods.
 * @function updateUserProfile
 * @memberOf UserService
 * @param {UpdateUserDto} data - The updated user data.
 * @param {User} currentUser - The current user.
 * @returns {Promise<User>} - Returns a promise that resolves to the updated User model.
 */
export const updateUserProfile = async (data: UpdateUserDto, currentUser: User) => {
  const currentUserName = getUserName(currentUser);

  if (data.photo) {
    [data.photo, data.resized_photo] = await Promise.all([
      uploadImage(data.photo),
      uploadResizedImage(data.photo, 499, 399),
    ]);
  }

  return updateUser(currentUser.id, data, currentUserName);
};
