import * as Router from "koa-joi-router";

import {
  activateAccountValidator,
  errorValidators,
  forgotPasswordValidator,
  loginValidator,
  registerValidator,
  resetPasswordValidator,
  socialLoginValidator,
  statusResponseValidator,
  userTokenValidator,
} from "../shared/validators";
import {
  checkUserHandler,
  forgotPasswordHandler,
  loginHandler,
  registrationHandler,
  resendEmailHandler,
  resetPasswordHandler,
  socialLoginHandler,
  verifyAccountHandler,
} from "../controllers";

const auth = Router();
auth.prefix("/auth");

auth.route({
  method: "post",
  path: "/check_user",
  validate: {
    type: "json",
    body: Router.Joi.object({
      email: Router.Joi.string().email().required(),
    }),
    output: {
      200: {
        body: Router.Joi.object({
          isUserExist: Router.Joi.boolean().required(),
        }),
      },
      500: {
        body: errorValidators,
      },
      401: {
        body: errorValidators,
      },
    },
  },
  handler: checkUserHandler,
  meta: {
    swagger: {
      summary: "Check if User Exists",
      description: "Returns whether a user exists based on the provided email",
      tags: ["AUTH"],
    },
  },
});

auth.route({
  method: "post",
  path: "/login",
  validate: {
    type: "json",
    body: loginValidator,
    output: {
      200: {
        body: userTokenValidator,
      },
      500: {
        body: errorValidators,
      },
      401: {
        body: errorValidators,
      },
    },
  },
  handler: loginHandler,
  meta: {
    swagger: {
      summary: "Login User",
      description: "Authenticates a user and returns an auth token",
      tags: ["AUTH"],
    },
  },
});

auth.route({
  method: "post",
  path: "/registration",
  validate: {
    type: "json",
    body: registerValidator,
    output: {
      201: {
        body: userTokenValidator,
      },
      500: {
        body: errorValidators,
      },
      400: {
        body: errorValidators,
      },
    },
  },
  handler: registrationHandler,
  meta: {
    swagger: {
      summary: "User Registration",
      description: "Self-registration of a new user. Requires username, email, and password.",
      tags: ["AUTH"],
    },
  },
});

auth.route({
  method: "post",
  path: "/verify_email",
  validate: {
    type: "json",
    body: activateAccountValidator,
    output: {
      201: {
        body: statusResponseValidator,
      },
      500: {
        body: errorValidators,
      },
      400: {
        body: errorValidators,
      },
    },
  },
  handler: verifyAccountHandler,
  meta: {
    swagger: {
      summary: "Finish User Registration",
      description:
        "Completes the user registration process by validating the confirmation code sent to the user's email",
      tags: ["AUTH"],
    },
  },
});

auth.route({
  method: "post",
  path: "/forgot_password",
  validate: {
    type: "json",
    body: forgotPasswordValidator,
    output: {
      200: {
        body: Router.Joi.object({
          status: Router.Joi.string().required(),
        }),
      },
      500: {
        body: errorValidators,
      },
      400: {
        body: errorValidators,
      },
    },
  },
  handler: forgotPasswordHandler,
  meta: {
    swagger: {
      summary: "Forgot Password",
      description: "Initiates the password recovery process by sending a password reset hash to the user's email",
      tags: ["AUTH"],
    },
  },
});

auth.route({
  method: "post",
  path: "/reset_password",
  validate: {
    type: "json",
    body: resetPasswordValidator,
    output: {
      201: {
        body: statusResponseValidator,
      },
      500: {
        body: errorValidators,
      },
      400: {
        body: errorValidators,
      },
    },
  },
  handler: resetPasswordHandler,
  meta: {
    swagger: {
      summary: "Reset Password",
      description: "Allows user to set a new password using the reset hash/code received via email",
      tags: ["AUTH"],
    },
  },
});

auth.route({
  method: "post",
  path: "/social_login",
  validate: {
    type: "json",
    body: socialLoginValidator,
    output: {
      201: {
        body: userTokenValidator,
      },
      500: {
        body: errorValidators,
      },
      400: {
        body: errorValidators,
      },
    },
  },
  handler: socialLoginHandler,
  meta: {
    swagger: {
      summary: "Social Login",
      description:
        "Authenticates a user via a social network. Requires the OAuth access token or code from the social network.",
      tags: ["AUTH"],
    },
  },
});

auth.route({
  method: "post",
  path: "/resend_email",
  validate: {
    type: "json",
    body: Router.Joi.object({
      email: Router.Joi.string().email().required(),
    }),
    output: {
      200: {
        body: statusResponseValidator,
      },
      500: {
        body: errorValidators,
      },
      401: {
        body: errorValidators,
      },
    },
  },
  handler: resendEmailHandler,
  meta: {
    swagger: {
      summary: "Resend Confirmation Email",
      description: "Resends the confirmation hash to the user's email",
      tags: ["AUTH"],
    },
  },
});

export default auth;
