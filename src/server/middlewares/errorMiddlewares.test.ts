import { type NextFunction, type Request, type Response } from "express";
import { ValidationError } from "express-validation";
import { generalError, notFoundError } from "./errorMiddlewares.js";
import CustomError from "../CustomError/CustomError.js";
import errorMessages from "../utils/errorMessages.js";

describe("Given a notFoundError middleware", () => {
  describe("When it receives an error", () => {
    test(`Then it should call the response's method status with a custom error with status 404 and message ${errorMessages.notFound}`, () => {
      const expectedStatus = 404;
      const expectedMessage = errorMessages.notFound;
      const req = {};
      const res: Pick<Response, "status" | "json"> = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn(),
      };
      const next = jest.fn();
      const expectedError = new CustomError(expectedMessage, expectedStatus);

      notFoundError(req as Request, res as Response, next as NextFunction);

      expect(next).toHaveBeenCalledWith(expectedError);
    });
  });
});

describe("Given a generalError middleware", () => {
  const req = {};
  const next = jest.fn();
  const res: Pick<Response, "status" | "json"> = {
    status: jest.fn().mockReturnThis(),
    json: jest.fn(),
  };
  describe("When it receives an error with statusCode 402 and message 'Mock error'", () => {
    test("Then it should call the response's status method with 402 and json method with 'Mock error' message", () => {
      const expectedStatus = 402;
      const expectedMessage = "Mock error";
      const error = new CustomError(expectedMessage, expectedStatus);

      generalError(
        error,
        req as Request,
        res as Response,
        next as NextFunction
      );

      expect(res.status).toHaveBeenCalledWith(expectedStatus);
      expect(res.json).toHaveBeenCalledWith({ message: expectedMessage });
    });
  });
  describe("When it receives an error without statusCode", () => {
    test(`Then it should return an error with status 500 and message ${errorMessages.general}`, () => {
      const expectedStatus = 500;
      const expectedMessage = errorMessages.general;
      const error = new Error();

      generalError(
        error as CustomError,
        req as Request,
        res as Response,
        next as NextFunction
      );

      expect(res.status).toHaveBeenCalledWith(expectedStatus);
      expect(res.json).toHaveBeenCalledWith({ message: expectedMessage });
    });
  });
  describe("When it receives a ValidationError with the message 'Invalid password'", () => {
    test("Then it should retunr an error with status 400 and the message", () => {
      const expectedStatus = 400;
      const expectedMessage = "Password not valid";
      const error = new ValidationError(
        {
          body: [
            {
              path: ["/user/login"],
              type: "error",
              message: "Password not valid",
            },
          ],
        },
        { statusCode: 400 }
      );

      generalError(
        error as CustomError,
        req as Request,
        res as Response,
        next as NextFunction
      );

      expect(res.status).toHaveBeenCalledWith(expectedStatus);
      expect(res.json).toHaveBeenCalledWith({ message: expectedMessage });
    });
  });
});
