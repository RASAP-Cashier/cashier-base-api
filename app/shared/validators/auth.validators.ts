import { Joi } from "koa-joi-router";

import { allowEmptyNullableString, stringRequired } from "./shared.validators";
import { ELoginProvider } from "../../models";

export const userTokenValidator = Joi.object({
  token: Joi.string().required(),
});

export const loginValidator = Joi.object({
  password: Joi.string().required(),
  email: Joi.string().required(),
});

export const headerValidator = Joi.object({
  authorization: Joi.string().min(9).required(),
}).options({
  allowUnknown: true,
});

export const registerValidator = Joi.object({
  first_name: stringRequired,
  last_name: stringRequired,
  email: stringRequired.email(),
  phone: allowEmptyNullableString,
  password: allowEmptyNullableString,
  password_confirm: stringRequired.valid(Joi.ref("password")),
  photo: allowEmptyNullableString,
});

export const activateAccountValidator = Joi.object({
  email: stringRequired.email(),
  confirmation_hash: stringRequired,
});

export const forgotPasswordValidator = Joi.object({
  email: stringRequired.email(),
});

export const resetPasswordValidator = Joi.object({
  hash: Joi.string().required(),
  password: Joi.string().required(),
  password_confirm: stringRequired.valid(Joi.ref("password")),
});

export const socialLoginValidator = Joi.object({
  first_name: stringRequired,
  last_name: stringRequired,
  email: stringRequired.email(),
  phone: Joi.string().optional().allow(null, ""),
  photo: Joi.string().optional().allow(null, ""),
  provider: Joi.string().required().allow(Object.values(ELoginProvider).toString()),
  social_id: stringRequired,
});
