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

  rol: {
    type: String,
    required: true,
  },

  state: {
    type: String,
    required: true,
  },
});

const User = model("User", userSchema, "users");

export default User;
