import bcrypt from "bcryptjs";
import { type NextFunction, type Response } from "express";
import { type DbUser, type CreateUserRequest } from "../../../types.js";
import User from "../../../database/models/User.js";
import errorMessages from "../../utils/errorMessages.js";
import CustomError from "../../CustomError/CustomError.js";

export const createUser = async (
  req: CreateUserRequest,
  res: Response,
  next: NextFunction
) => {
  const { username, password, role, loggedUsername } = req.body;

  try {
    const existingLoggedUser = await User.findOne({ username: loggedUsername });

    if (!existingLoggedUser) {
      const error = new CustomError(errorMessages.general, 500);
      next(error);
    } else if (existingLoggedUser.role !== "admin") {
      const error = new CustomError(errorMessages.unauthorized, 401);
      next(error);
    }

    const existingUser = await User.findOne({ username });
    if (existingUser) {
      const error = new CustomError(errorMessages.general, 409);
      next(error);
      return;
    }

    const newUser: DbUser = {
      username,
      password: await bcrypt.hash(password, 10),
      role,
      state: "active",
    };
    const userCreatedAtDb = await User.create(newUser);

    const returnedUser = { username: userCreatedAtDb.username };

    const status = 200;

    res.status(status).json({ returnedUser });
  } catch (error) {
    next(error);
  }
};
