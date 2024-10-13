import jwt from "jsonwebtoken";
import { type Response, type NextFunction } from "express";
import { type AppRequest } from "../../../types";
import CustomError from "../../CustomError/CustomError.js";

export const auth = (req: AppRequest, res: Response, next: NextFunction) => {
  try {
    const authorizationHeader = req.header("Authorization");

    if (!authorizationHeader?.includes("Bearer")) {
      const error = new CustomError("Missing token", 401);

      throw error;
    }

    const token = authorizationHeader.replace("Bearer ", "");

    const { sub: userId } = jwt.verify(token, process.env.JWT_SECRET!);

    req.userId = userId as string;

    next();
  } catch (error: unknown) {
    const customError =
      (error as Error).name === "JsonWebTokenError"
        ? new CustomError("Invalid token", 401)
        : error;

    next(customError);
  }
};
