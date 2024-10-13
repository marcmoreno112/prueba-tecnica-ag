import { type NextFunction, type Response } from "express";
import { Types } from "mongoose";
import {
  type UserDataStructure,
  type CreateUserRequest,
  type CreateUser,
  type DbUser,
} from "../../../types.js";
import errorMessages from "../../utils/errorMessages";
import { createUser } from "./createUserController";
import User from "../../../database/models/User";
import CustomError from "../../CustomError/CustomError";

beforeEach(() => {
  jest.clearAllMocks();
});

describe("Given a createUser controller", () => {
  const res: Pick<Response, "status" | "json"> = {
    status: jest.fn().mockReturnThis(),
    json: jest.fn(),
  };

  const next = jest.fn();

  describe("When it receives a request with a new user created by an admin role", () => {
    test("Then it should respond with a 200 status and the username", async () => {
      const newUser: CreateUser = {
        username: "newUser",
        password: "admin",
        role: "admin",
        loggedUsername: "admin",
      };

      User.findOne = jest.fn().mockResolvedValue(null);

      const req: Pick<CreateUserRequest, "body"> = { body: newUser };
      const expectedUser: UserDataStructure = {
        ...newUser,
        _id: new Types.ObjectId().toString(),
        password:
          "$2y$10$oIlXdXUt5rwSsxm95Sxg/uHPP77viYVgQjWbVc6nH0YbewkmkBepS",
        state: "active",
      };

      User.create = jest.fn().mockResolvedValue(expectedUser);

      await createUser(
        req as CreateUserRequest,
        res as Response,
        next as NextFunction
      );

      const expectedStatus = 200;

      expect(res.status).toHaveBeenCalledWith(expectedStatus);
      expect(res.json).toHaveBeenCalledWith({
        returnedUser: { username: expectedUser.username },
      });
    });
  });
  describe("When it receives a request with an existing user", () => {
    test(`Then it should call the next function with an error with status code 409 and message ${errorMessages.general}`, async () => {
      const inValidUser: CreateUser = {
        username: "admin",
        password: "cracker",
        role: "admin",
        loggedUsername: "admin",
      };

      User.findOne = jest.fn().mockResolvedValue(inValidUser);

      const req: Pick<CreateUserRequest, "body"> = { body: inValidUser };

      await createUser(
        req as CreateUserRequest,
        res as Response,
        next as NextFunction
      );

      const expectedStatus = 409;

      const expectedError = new CustomError(
        errorMessages.general,
        expectedStatus
      );

      expect(next).toHaveBeenCalledWith(expectedError);
    });
  });
  describe("When it receives a request with a new user created by an user role", () => {
    test(`Then it should call the next function with an error with status code 401 and message ${errorMessages.unauthorized}`, async () => {
      const unauthorizedUser: CreateUser = {
        username: "cracker",
        password: "cracker",
        role: "user",
        loggedUsername: "user",
      };

      const unauthorizedExistingUser: DbUser = {
        username: "user",
        password: "user",
        role: "user",
        state: "active",
      };

      User.findOne = jest.fn().mockResolvedValue(unauthorizedExistingUser);

      const req: Pick<CreateUserRequest, "body"> = { body: unauthorizedUser };

      await createUser(
        req as CreateUserRequest,
        res as Response,
        next as NextFunction
      );

      const expectedStatus = 401;

      const expectedError = new CustomError(
        errorMessages.unauthorized,
        expectedStatus
      );

      expect(next).toHaveBeenCalledWith(expectedError);
    });
  });
});
