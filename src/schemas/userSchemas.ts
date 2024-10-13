import { Joi } from "express-validation";
import { type CreateUser, type UserCredentials } from "../types";

export const loginUserSchema = {
  body: Joi.object<UserCredentials>({
    username: Joi.string().required(),
    password: Joi.string().required(),
  }),
};

export const createUserSchema = {
  body: Joi.object<CreateUser>({
    username: Joi.string().required(),
    password: Joi.string().required(),
    role: Joi.string().valid("user", "admin").required(),
    loggedUsername: Joi.string().required(),
  }),
};
