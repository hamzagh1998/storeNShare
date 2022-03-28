import { Schema, model } from "mongoose";

import { User } from "../interfaces/user.interface";

const UserSchema: Schema = new Schema<User>({
  username: { type: String, required: true },
  email: { type: String, required: true },
  password: { type: String, required: true },
  avatar: { type: String, required: true }
});

export const UserModel = model('User', UserSchema);