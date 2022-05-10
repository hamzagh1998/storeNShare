import { ObjectId } from "mongoose";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import Ajv from "ajv";

import { User } from "../interfaces/user.interface";
import { UserModel } from "../models/user.model";
import { ClusterModel } from "../models/cluster.model";

import { registerSchema, loginSchema } from "../schema-validator";
import { logger } from "../logger";

export class AuthService {
  private userInfo;
  private loginInfo;
  private reg = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w\w+)+$/;

  private ajv;

  constructor(
    registerObj: User<ObjectId> | null, 
    loginObject: {usernameOrEmail: string, password: string} | null
    ) { 
    this.userInfo = registerObj;
    this.loginInfo = loginObject;

    this.ajv = new Ajv();
  };

  async register() {

    const { valid, detail } = this.validator(this.userInfo!, registerSchema);
    if (valid) {
      const { username, email } = this.userInfo!;

      if (username.length < 3) return { error: true, detail: "Username must contain at least 3 character" };
      if (this.userInfo!.password.length < 6) return { error: true, detail: "password must contain at least 6 character" };
      if (!this.reg.test(email)) return { error: true, detail: "Invalid email address!" };
      // check if username already exists 
      let user = await UserModel.findOne({username: username});
      if (user) return { error: true, detail: "This username already exists!" };
      // check if email already exists
      user = await UserModel.findOne({email: email});
      if (user) return { error: true, detail: "This email already exists!" };

      // hash password
      const hash = await bcrypt.hash(this.userInfo!.password, 10);
      this.userInfo!.password = hash;

      // create cluster for the new user
      const clusterDoc = new ClusterModel({
        name: username + " " + "cluster",
        shared: true
      });
      await clusterDoc.save();
      // save doc
      const userDoc = new UserModel({
        ...this.userInfo, cluster: clusterDoc._id
      });
      await userDoc.save();
      // exclude password
      return { error: false, detail: "Account created successfully!" };
    }; 
    logger.error(detail);
    return { error: true, detail };
  };

  async login() {

    const { valid, detail } = this.validator(this.loginInfo!, loginSchema);
    if (valid) {
      // check if username exists
      const { usernameOrEmail, password } = this.loginInfo!;
      // check if email or username
      const isEmail = this.reg.test(usernameOrEmail);
      const user = isEmail 
                        ? await UserModel.findOne({email: usernameOrEmail})
                        : await UserModel.findOne({username: usernameOrEmail});
                        
      if (user) {
        const { _id, username, email, avatar, cluster } = user;
        // check passwords matches
        const match = await bcrypt.compare(password, user.password);
        if (match) {
          const token = jwt.sign({ _id, username, email, avatar, cluster }, process.env.SECRET_KEY!);
          return { error: false, detail: token };
        } return { error: true, detail: "Invalid password" }
      } return { error: true, detail: `This ${isEmail ? "email" : "username"} doesn't exists!` };
    };
    logger.error(detail);
    return { error: true, detail };
  };

  validator(data: object, schema: object) {
    const validate = this.ajv.compile(schema);
    return validate(data) ? {valid: true} : {valid: false, detail: validate.errors};
  };
};