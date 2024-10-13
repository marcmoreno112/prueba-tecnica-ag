import { Schema, model } from "mongoose";

const userSchema = new Schema({
  username: {
    type: String,
    required: true,
    unique: true,
  },

  password: {
    type: String,
    required: true,
  },

  role: {
    type: String,
    required: true,
    enum: ["admin", "user"],
  },

  state: {
    type: String,
    required: true,
    enum: ["active", "being deleted"],
  },
});

const User = model("User", userSchema, "users");

export default User;
