import bcrypt from "bcryptjs";
import { type NextFunction, type Response } from "express";
import jwt, { type JwtPayload } from "jsonwebtoken";
import { type UserCredentialsRequest } from "../../../types";
import CustomError from "../../CustomError/CustomError.js";
import User from "../../../database/models/User.js";
import errorMessages from "../../utils/errorMessages.js";

export const loginUser = async (
  req: UserCredentialsRequest,
  res: Response,
  next: NextFunction
) => {
  const { username, password } = req.body;

  try {
    const user = await User.findOne({ username }).exec();

    if (
      !user ||
      !(await bcrypt.compare(password, user.password)) ||
      user.state === "being deleted"
    ) {
      const customMessage = errorMessages.wrongCredentials;

      const customStatus = 401;

      const customError = new CustomError(customMessage, customStatus);

      throw customError;
    }

    const tokenPayload: JwtPayload = {
      sub: user._id.toString(),
    };

    const token = jwt.sign(tokenPayload, process.env.JWT_SECRET!, {
      expiresIn: "7d",
    });

    const status = 200;

    res.status(status).json({ token });
  } catch (error) {
    next(error);
  }
};
