import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";

import { UserModel } from "../models/user.model";

import { logger } from "../logger";

import { tryToCatch } from "../utils";
import { ClusterModel } from "../models/cluster.model";

export class UserService {

  private token: string;
  private userInfo: object | null;
  private password: string | null

  constructor(token: string, userInfo: object | null, password: string | null) {
    this.token = token;
    this.userInfo = userInfo;
    this.password = password;
  };

  async tokenTransformer() {
    return await jwt.verify(this.token, process.env.SECRET_KEY!);
  };

  async editProfileService() {
    const { _id }: any = await this.tokenTransformer();
    
    let [err, data] = await tryToCatch(async (userId: string) => UserModel.findById(userId), _id);
    if (err) {
      logger.error(err);
      return { error: true, detail: err };
    };
    if (!data) return { error: true, detail: "Unkown user!" };

    [err, data] = await tryToCatch(async (filter: object, update: object) => {
      await UserModel.updateOne(filter, update);
      return await UserModel.findById(_id);
    } , {_id}, this.userInfo);
    if (err) {
      logger.error(err);
      return { error: true, detail: err };
    } return { error: false, detail: data }
  };

  async changePasswordService() {
    const { _id }: any = await this.tokenTransformer();
    let [err, data] = await tryToCatch(async (userId: string) => UserModel.findById(userId), _id);
    if (err) {
      logger.error(err);
      return { error: true, detail: err };
    };
    if (!data) return { error: true, detail: "Unkown user!" };

    [err, data] = await tryToCatch(async (filter: object, password: string) => {
      const hashedPassword: string = await bcrypt.hash(password, 10);
      await UserModel.updateOne(filter, {password: hashedPassword});
    }, {_id}, this.password);
    if (err) {
      logger.error(err);
      return { error: true, detail: err };
    } return { error: false, detail: "Password updated!"};
  };

  async deleteUserAccountService() {
    const { _id }: any = await this.tokenTransformer();
    let [err, data] = await tryToCatch(async (userId: string) => UserModel.findById(userId), _id);
    if (err) {
      logger.error(err);
      return { error: true, detail: err };
    };
    if (!data) return { error: true, detail: "Unkown user!" };

    [err, data] = await tryToCatch(async (filter: object) => {
      await UserModel.deleteOne(filter);
      await ClusterModel.deleteOne({_id: data.cluster});
      
    }, {_id});
    if (err) {
      logger.error(err);
      return { error: true, detail: err };
    } return { error: false, detail: "Account deleted!" };
  };
};