import bcrypt from "bcryptjs";
import { type NextFunction, type Response } from "express";
import { type DbUser, type CreateUserRequest } from "../../../types.js";
import User from "../../../database/models/User.js";

export const createUser = async (
  req: CreateUserRequest,
  res: Response,
  next: NextFunction
) => {
  const { username, password, rol } = req.body;

  try {
    const newUser: DbUser = {
      username,
      password: await bcrypt.hash(password, 10),
      rol,
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
