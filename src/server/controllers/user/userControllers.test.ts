import { type NextFunction, type Response } from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { Types } from "mongoose";
import {
  type UserDataStructure,
  type UserCredentials,
  type UserCredentialsRequest,
} from "../../../types";
import { loginUser } from "./userControllers";
import CustomError from "../../CustomError/CustomError";
import user from "../../../database/models/User";
import errorMessages from "../../utils/errorMessages";

beforeEach(() => {
  jest.clearAllMocks();
});

describe("Given a loginUser controller", () => {
  const res: Pick<Response, "status" | "json"> = {
    status: jest.fn().mockReturnThis(),
    json: jest.fn(),
  };

  const next = jest.fn();

  describe("When it receives a request with valid user with username admin and password admin", () => {
    test("Then it should respond with a 200 status and a token", async () => {
      const validUser: UserCredentials = {
        username: "admin",
        password: "admin",
      };

      const req: Pick<UserCredentialsRequest, "body"> = { body: validUser };

      const expectedUser: UserDataStructure = {
        _id: new Types.ObjectId().toString(),
        username: validUser.username,
        password:
          "$2y$10$oIlXdXUt5rwSsxm95Sxg/uHPP77viYVgQjWbVc6nH0YbewkmkBepS",
      };

      user.findOne = jest.fn().mockReturnValue({
        exec: jest.fn().mockResolvedValue(expectedUser),
      });

      bcrypt.compare = jest.fn().mockReturnValue(true);

      jwt.sign = jest.fn().mockReturnValue("token");

      await loginUser(
        req as UserCredentialsRequest,
        res as Response,
        next as NextFunction
      );

      const expectedStatus = 200;

      expect(res.status).toHaveBeenCalledWith(expectedStatus);
      expect(res.json).toHaveBeenCalledWith({ token: "token" });
    });
  });
  describe("When it receives a request with invalid credentials", () => {
    test(`Then it should call the next function with an error with status code 401 and message ${errorMessages.wrongCredentials}`, async () => {
      const inValidUser: UserCredentials = {
        username: "cracker",
        password: "cracker",
      };

      user.findOne = jest.fn().mockReturnValue({
        exec: jest.fn().mockResolvedValue(null),
      });

      const req: Pick<UserCredentialsRequest, "body"> = { body: inValidUser };

      await loginUser(
        req as UserCredentialsRequest,
        res as Response,
        next as NextFunction
      );

      const expectedStatus = 401;

      const error = new CustomError(
        errorMessages.wrongCredentials,
        expectedStatus
      );

      expect(next).toHaveBeenCalledWith(error);
    });
  });
});
