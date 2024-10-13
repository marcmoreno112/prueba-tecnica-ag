import { type Request } from "express";
import { type Types } from "mongoose";
import type * as core from "express-serve-static-core";

export type UserCredentials = {
  username: string;
  password: string;
};

export type DbUser = {
  rol: "admin" | "user";
  state: "active" | "being deleted";
} & UserCredentials;

export type UserCredentialsRequest = Request<
  Record<string, unknown>,
  Record<string, unknown>,
  UserCredentials
>;

export type UserDataStructure = {
  _id: string;
} & UserCredentials;

export type UserData = {
  _id: Types.ObjectId;
} & DbUser;

export type CustomRequest = {
  userId: string;
} & Request;

export type AppRequest<
  P = core.ParamsDictionary,
  ResBody = any,
  ReqBody = any,
  ReqQuery = core.Query,
  Locals extends Record<string, any> = Record<string, any>
> = {
  userId: string;
} & core.Request<P, ResBody, ReqBody, ReqQuery, Locals>;
