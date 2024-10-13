import { type Request, type Response } from "express";
import pingController from "./pingController";
import errorMessages from "../../utils/errorMessages";

describe("Given a ping controller", () => {
  describe("When it is called", () => {
    test(`Then it should call the response's status method with 200 and json method with ${errorMessages.ping}`, () => {
      const req = {};
      const res: Pick<Response, "status" | "json"> = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn(),
      };
      const expectedStatus = 200;
      const expectedMessage = errorMessages.ping;

      pingController(req as Request, res as Response);

      expect(res.status).toHaveBeenCalledWith(expectedStatus);
      expect(res.json).toHaveBeenCalledWith({ message: expectedMessage });
    });
  });
});
