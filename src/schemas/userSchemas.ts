import { Joi } from "express-validation";
import { type DbUser, type UserCredentials } from "../types";

export const loginUserSchema = {
  body: Joi.object<UserCredentials>({
    username: Joi.string().required(),
    password: Joi.string().required(),
  }),
};

export const createUserSchema = {
  body: Joi.object<Omit<DbUser, "state">>({
    username: Joi.string().required(),
    password: Joi.string().required(),
    rol: Joi.string().valid("user", "admin").required(),
  }),
};
