import { Router } from "express";
import { validate } from "express-validation";
import { loginUser } from "../../controllers/user/loginUserController.js";
import paths from "../../utils/paths.js";
import {
  createUserSchema,
  loginUserSchema,
} from "../../../schemas/userSchemas.js";
import { createUser } from "../../controllers/user/createUserController.js";

const userRouter = Router();

userRouter.post(
  paths.login,
  validate(loginUserSchema, {}, { abortEarly: false }),
  loginUser
);

userRouter.post(
  paths.createUser,
  validate(createUserSchema, {}, {}),
  createUser
);

export default userRouter;
