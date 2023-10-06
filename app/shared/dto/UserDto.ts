/**
 * @typedef {Object} UserDto
 * @property {number} [id] - The unique user ID.
 * @property {string} first_name - The user's first name.
 * @property {string} last_name - The user's last name.
 * @property {string} [phone] - The user's phone number.
 * @property {string} email - The user's email.
 * @property {string} [photo] - The user's photo URL.
 * @property {string} [password] - The user's password.
 * @property {string} [created_by] - The entity that created the user entry.
 * @property {string} [confirmation_hash] - The confirmation hash for the user.
 * @property {boolean} [is_active] - Indicates if the user is active.
 * @property {boolean} [is_email_verified] - Indicates if the user's email is verified.
 */

export interface UserDto {
  id?: number;
  first_name: string;
  last_name: string;
  phone?: string;
  email: string;
  photo?: string;
  password?: string;

  created_by?: string;
  confirmation_hash?: string;
  is_active?: boolean;
  is_email_verified?: boolean;
}

/**
 * @typedef {Object} UpdateUserDto
 * @property {string} first_name - The user's first name.
 * @property {string} last_name - The user's last name.
 * @property {string} [phone] - The user's phone number.
 * @property {string} [photo] - The user's photo URL.
 * @property {string} [resized_photo] - The user's resized photo URL.
 */
export interface UpdateUserDto {
  first_name: string;
  last_name: string;
  phone?: string;
  photo?: string;
  resized_photo?: string;
}
