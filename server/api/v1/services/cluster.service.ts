import jwt from "jsonwebtoken";
import { ObjectId } from "mongoose"

import { UserModel } from "../models/user.model";
import { ClusterModel } from "../models/cluster.model";
import { CollectionModel } from "../models/collection.model";

import { tryToCatch } from "../utils";
import { logger } from "../logger";
import { Cluster } from "../interfaces/cluster.interface";


export class ClusterService {
  private token: string;
  private id: string | null;
  private clusterInfo: Cluster<ObjectId> | null;

  constructor(token: string, id: string | null, clusterInfo: Cluster<ObjectId> | null) {
    this.token = token;
    this.id = id;
    this.clusterInfo = clusterInfo;
  };

  async tokenTransformer() {
    return await jwt.verify(this.token, process.env.SECRET_KEY!);
  };

  async myClusterInfo() {
    const { _id }: any = await this.tokenTransformer();
    let [err, data] = await tryToCatch((userId: string) => UserModel.findById(userId), _id);
    if (err) {
      logger.error(err);
      return { error: true, detail: err };
    };
    if (!data) return { error: true, detail: "Unkown user!" };

    [err, data] = await tryToCatch(async (id: string) => {
      const collections: Array<object> = [];

      const clusterDoc = await ClusterModel.findById(id).lean();
      
      if (clusterDoc) {
        for (const coll of clusterDoc.collections) {
          const collectionDoc = await CollectionModel.findById(coll).lean();
          collections.push(collectionDoc);
        };return {...clusterDoc, collections: collections};
      };return clusterDoc;
    }, data.cluster);
    if (err) {
      logger.error(err);
      return { error: true, detail: err };
    };return { error: false, detail: data};
  };

  async allClustersInfo() {
    const [err, data] = await tryToCatch((obj: object) => ClusterModel.find(obj), {});
    if (err) {
      logger.error(err);
      return { error: true, detail: err };
    };
    if (!data) return { error: true, detail: "Unkown user!" };

    const sharedClusters = data.filter((cluster: {shared: boolean}) => cluster.shared);
    
    return { error: false, detail: sharedClusters };
  };

  async clusterDetailInfo() {
    const [err, data] = await tryToCatch(async (id: string) => {
      const collections: Array<object> = [];

      const clusterDoc = await ClusterModel.findById(id).lean();
      if (clusterDoc) {
        for (const coll of clusterDoc.collections) {
          const collectionDoc = await CollectionModel.findById(coll).lean();
          collectionDoc.shared && collections.push(collectionDoc);
        };return {...clusterDoc, collections: collections};
      };return clusterDoc;
    }, this.id);
    if (err) {
      logger.error(err);
      return { error: true, detail: "Cluster doesn't exists!" };
    };return { error: false, detail: data.shared ? data : "This cluster is private!" };
  };

  async createClusterInfo() {
    const { _id }: any = await this.tokenTransformer();
    let [err, data] = await tryToCatch((userId: string) => UserModel.findById(userId), _id);
    if (err) {
      logger.error(err);
      return { error: true, detail: err };
    }; 
    if (!data) return { error: true, detail: "Unkown user!" };
    if (data.cluster) return { error: true, detail: "You already has a cluster!" };
    
    [err, data] = await tryToCatch(async (cluster: Cluster<ObjectId>) => {
      // checifcluster name does exists!
      const clusterNameDoesExists = await ClusterModel.find({name: cluster.name});
      if (clusterNameDoesExists.length) return "Cluster name already exists!";
      // create cluster for the new user
      const clusterDoc = new ClusterModel({...cluster});
      await clusterDoc.save();
      // save doc      
      data.cluster = clusterDoc._id;
      await data.save();
      return clusterDoc;
    }, this.clusterInfo);
    if (err) {
      logger.error(err);
      return { error: true, detail: err };
    };return { error: typeof data === "string", detail: data };
  };

  async updateClusterInfo() {
    const { _id }: any = await this.tokenTransformer();
    let [err, data] = await tryToCatch((userId: string) => UserModel.findById(userId), _id);
    if (err) {
      logger.error(err);
      return { error: true, detail: err };
    };
    if (!data) return { error: true, detail: "Unkown user!" };
    
    [err, data] = await tryToCatch((update: Cluster<ObjectId>) => (
      ClusterModel.findOneAndUpdate({_id: data.cluster._id}, {...update}, {new: true})
    ), this.clusterInfo);
    if (err) {
      logger.error(err);
      return { error: true, detail: err };
    };return { error: false, detail: data };
  };

  async deleteClusterInfo() {
    const { _id }: any = await this.tokenTransformer();
    let [err, data] = await tryToCatch((userId: string) => UserModel.findById(userId), _id);
    if (err) {
      logger.error(err);
      return { error: true, detail: err };
    };
    if (!data) return { error: true, detail: "Unkown user!" };
    
    [err, data] = await tryToCatch(async (id: string) => {
      await ClusterModel.deleteOne({_id: id});
      data.cluster = null;
      data.save();
    }, data.cluster._id);
    if (err) {
      logger.error(err);
      return { error: true, detail: err };
    };return { error: true, detail: "Cluster has been deleted!" };
  };
};