import { Schema, model } from "mongoose";

import { User } from "../interfaces/user.interface";

const UserSchema: Schema = new Schema<User<Schema.Types.ObjectId>>({
  username: { type: String, required: true },
  email: { type: String, required: true },
  password: { type: String, required: true },
  avatar: { type: String, required: true },
  cluster: { type: Schema.Types.ObjectId, ref: "Cluster" },
  favorites: { type: String, required: false }
});

export const UserModel = model('User', UserSchema);