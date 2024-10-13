import "../../../loadEnvironment.js";
import { MongoMemoryServer } from "mongodb-memory-server";
import request from "supertest";
import jwt from "jsonwebtoken";
import {
  type DbUser,
  type UserCredentials,
  type UserData,
} from "../../../types.js";
import connectToDatabase from "../../../database/connectToDatabase.js";
import mongoose from "mongoose";
import app from "../../index.js";
import user from "../../../database/models/User.js";
import paths from "../../utils/paths.js";

let server: MongoMemoryServer;

beforeAll(async () => {
  server = await MongoMemoryServer.create();
  await connectToDatabase(server.getUri());
});

afterEach(async () => {
  await user.deleteMany();
});

afterAll(async () => {
  await server.stop();
  await mongoose.connection.close();
});

describe("Given a POST 'user/login' endpoint", () => {
  describe("When it receives a request with a valid user with username admin and password admin", () => {
    test("Then it should responde with status 200 and a token", async () => {
      const createdUser: DbUser = {
        username: "admin",
        password:
          "$2y$10$oIlXdXUt5rwSsxm95Sxg/uHPP77viYVgQjWbVc6nH0YbewkmkBepS",
        rol: "user",
        state: "active",
      };

      const validUser: UserCredentials = {
        username: "admin",
        password: "admin",
      };

      const newUser: UserData = await user.create(createdUser);

      const expectedStatus = 200;

      const path = `${paths.user}${paths.login}`;

      const response: { body: { token: string } } = await request(app)
        .post(path)
        .send(validUser)
        .expect(expectedStatus);

      const { token } = response.body;

      const payload = jwt.verify(token, process.env.JWT_SECRET!);

      const userId = payload.sub!;

      expect(userId).toBe(newUser._id.toString());
    });
  });
});
