import jwt from "jsonwebtoken";
import { ObjectId } from "mongoose"

import { UserModel } from "../models/user.model";
import { ClusterModel } from "../models/cluster.model";
import { CollectionModel } from "../models/collection.model";

import { Collection } from "../interfaces/collection.interface";

import { tryToCatch } from "../utils";
import { logger } from "../logger";

export class CollectionService {

  private token: string;
  private id: string | null;
  private collectionInfo: Collection<ObjectId> | null;

  constructor (token: string, id: string | null, collectionInfo: Collection<ObjectId> | null) {
    this.token = token;
    this.id = id;
    this.collectionInfo = collectionInfo;
  };

  async tokenTransformer() {
    return await jwt.verify(this.token, process.env.SECRET_KEY!);
  };

  async myCollectionsInfo() {
    const { _id }: any = await this.tokenTransformer();
    let [err, data] = await tryToCatch(async (userId: string) => UserModel.findById(userId), _id);
    if (err) {
      logger.error(err);
      return { error: true, detail: err };
    };
    if (!data) return { error: true, detail: "Unkown user!" };
    
    [err, data] = await tryToCatch(async (id: string) => CollectionModel.find({clusterParent: id}), data.cluster);
    if (err) {
      logger.error(err);
      return { error: true, detail: err };
    };return { error: false, detail: data.length ? data : "Empty!" };
  };

  async myCollectionDetailInfo() {
    const { _id }: any = await this.tokenTransformer();
    let [err, data] = await tryToCatch(async (userId: string) => UserModel.findById(userId), _id);
    if (err) {
      logger.error(err);
      return { error: true, detail: err };
    };  

    [err, data] = await tryToCatch(async (id: string) => CollectionModel.findById(id), this.id);
    if (err) {
      logger.error(err);
      return { error: true, detail: "Not found!" };
    };return { error: false, detail: data };

  };

  async collectionDetailInfo() {
    const { _id }: any = await this.tokenTransformer();
    let [err, data] = await tryToCatch(async (userId: string) => UserModel.findById(userId), _id);
    if (err) {
      logger.error(err);
      return { error: true, detail: err };
    }; 
    if (!data) return { error: true, detail: "Unkown user!" };

    [err, data] = await tryToCatch(async (id: string) => {
      const collectionDoc = await CollectionModel.findById(id);
      return collectionDoc.shared ? collectionDoc : "This collection is private!";
    }, this.id);
    if (err) {
      logger.error(err);
      return { error: true, detail: "Not found!" };
    };return { error: typeof data === "string", detail: data };
  };

  async shareCollectionInfo() {
    const { _id }: any = await this.tokenTransformer();
    let [err, data] = await tryToCatch(async (userId: string) => UserModel.findById(userId), _id);
    if (err) {
      logger.error(err);
      return { error: true, detail: err };
    };
    if (!data) return { error: true, detail: "Unkown user!" };

    [err, data] = await tryToCatch(async (id: string) => {
      const clusterDoc = await ClusterModel.findById(data.cluster);
      const allCollections = await CollectionModel.find({clusterParent: data.cluster});
      const collectionDoc = await CollectionModel.findById(id).lean();

      if (data.cluster.toString() === collectionDoc.clusterParent.toString()) 
        return "You already had this collection!";
      if (!collectionDoc.shared) 
        return "This collection is private!";

      const {_id, __v, ...collection} = collectionDoc;

      for (let coll of allCollections) {
        if (collection.name === coll.name) 
          collection.name += `(shared ${Math.random().toString(16).substr(2, 4)})`;
      };

      collection.clusterParent = data.cluster;

      const newCollectionDoc = new CollectionModel({...collection});
      newCollectionDoc.save()

      clusterDoc.collections.push(newCollectionDoc);
      clusterDoc.save();

      return newCollectionDoc;
    }, this.id);
    if (err) {
      logger.error(err);
      return { error: true, detail: err };
    };return { error: typeof data === "string", detail: data };    
  };

  async createCollectionInfo() {    
    const { _id }: any = await this.tokenTransformer();
    let [err, data] = await tryToCatch(async (userId: string) => UserModel.findById(userId), _id);
    if (err) {
      logger.error(err);
      return { error: true, detail: err };
    }; 
    if (!data) return { error: true, detail: "Unkown user!" };

    [err, data] = await tryToCatch(async (collection: Collection<ObjectId>) => {
      // check if collection belong to the right user collection      
      if (data.cluster.toString() !== collection.clusterParent.toString()) return "Forbidden!"
      // checifcluster name does exists!      
      const collectionNameDoesExists = await CollectionModel.find(
        {
          clusterParent: collection.clusterParent, name: collection.name
        }
      );
      if (collectionNameDoesExists.length) return "Collection name already exists!";
      // create new collection
      const collectionDoc = new CollectionModel({...collection});
      await collectionDoc.save();      
      
      const _ = await ClusterModel.updateOne({_id: data.cluster}, {$push: {collections: collectionDoc}});      
      
      return collectionDoc;
    }, this.collectionInfo);
    if (err) {
      logger.error(err);
      return { error: true, detail: err };
    };return { error: typeof data === "string", detail: data };
  };

  async updateCollectionInfo() {
    const { _id }: any = await this.tokenTransformer();
    let [err, data] = await tryToCatch((userId: string) => UserModel.findById(userId), _id);
    if (err) {
      logger.error(err);
      return { error: true, detail: err };
    };
    if (!data) return { error: true, detail: "Unkown user!" };

    [err, data] = await tryToCatch(async (update: Collection<ObjectId>) => {
      
      const collectionDoc = await CollectionModel.findOne({_id: this.id, clusterParent: data.cluster});
      // check if cluster name does exists!      
      const collectionNameDoesExists = await CollectionModel.find(
        {
          clusterParent: data.cluster, name: update.name
        }
      );
      collectionDoc.shared = update.shared
      await collectionDoc.save();
      if (collectionNameDoesExists.length) return collectionDoc;

      collectionDoc.name = update.name;
      collectionDoc.shared = update.shared
      await collectionDoc.save();

      return collectionDoc;
    }, this.collectionInfo);    
    if (err) {
      
      logger.error(err);
      return { error: true, detail: "Forbidden" };
    };return { error: typeof data === "string", detail: data };
  };

  async deleteCollectionInfo() {
    const { _id }: any = await this.tokenTransformer();
    let [err, data] = await tryToCatch((userId: string) => UserModel.findById(userId), _id);
    if (err) {
      logger.error(err);
      return { error: true, detail: err };
    };
    if (!data) return { error: true, detail: "Unkown user!" };

    [err, data] = await tryToCatch(async (id: string) => {
      const res = await CollectionModel.deleteOne({_id: id, clusterParent: data.cluster});
      const clusterDoc = await ClusterModel.findById(data.cluster);
      clusterDoc.collections = clusterDoc.collections.filter((coll: {_id: any}) => coll._id.toString() !== id);
      clusterDoc.save();
    }, this.id);
    if (err) {
      logger.error(err);
      return { error: true, detail: "Couldn't delete collection!" };
    };return { error: false, detail: "Collection has been deleted!" };
  };

};

