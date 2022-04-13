import jwt from "jsonwebtoken";
import { ObjectId } from "mongoose"

import { ListModel } from "../models/list.model";
import { UserModel } from "../models/user.model";
import { CollectionModel } from "../models/collection.model";
import { ClusterModel } from "../models/cluster.model";

import { List } from "../interfaces/list.interface";

import { tryToCatch } from "../utils";
import { logger } from "../logger";

export class ListService {

  private token: string;
  private id: string | null;
  private collectionId: string | null;
  private listInfo: List<ObjectId> | null;

  constructor(token: string, id: string | null, collectionId: string | null, listInfo: List<ObjectId> | null) {
    this.token = token;
    this.id = id;
    this.collectionId = collectionId;
    this.listInfo = listInfo;
  };

  async tokenTransformer() {
    return await jwt.verify(this.token, process.env.SECRET_KEY!);
  };

  async myListsInfo() {
    const { _id }: any = await this.tokenTransformer();
    let [err, data] = await tryToCatch(async (userId: string) => UserModel.findById(userId), _id);
    if (err) {
      logger.error(err);
      return { error: true, detail: err };
    };
    if (!data) return { error: true, detail: "Unkown user!" };
    
    [err, data] = await tryToCatch(async (id: string) => {
      const collectionDoc = await CollectionModel.findById(id);
      if (collectionDoc.clusterParent.toString() !== data.cluster.toString()) return "Forbidden";
      return ListModel.find({collectionParent: id});
    }, this.collectionId);
    
    if (err) {
      logger.error(err);
      return { error: true, detail: err };
    };return { error: false, detail: data.length ? data : "Empty!" };
  };

  async myListDetailInfo() {
    const { _id }: any = await this.tokenTransformer();
    let [err, data] = await tryToCatch(async (userId: string) => UserModel.findById(userId), _id);
    if (err) {
      logger.error(err);
      return { error: true, detail: err };
    };  
    if (!data) return { error: true, detail: "Unkown user!" };

    [err, data] = await tryToCatch(async (id: string) => {
      const collectionDoc = await CollectionModel.findById(this.collectionId);      
      if (collectionDoc.clusterParent.toString() !== data.cluster.toString()) return "Forbidden";
      return ListModel.findById(id);
    }, this.id);
    if (err) {
      logger.error(err);
      return { error: true, detail: "Not found!" };
    };return { error: false, detail: data };
  };

  async listDetailInfo() {
    const { _id }: any = await this.tokenTransformer();
    let [err, data] = await tryToCatch(async (userId: string) => UserModel.findById(userId), _id);
    if (err) {
      logger.error(err);
      return { error: true, detail: err };
    }; 
    if (!data) return { error: true, detail: "Unkown user!" };

    [err, data] = await tryToCatch(async (id: string) => {
      const listDoc = await ListModel.findById(id);
      return listDoc.shared ? listDoc : "This list is private!";
    }, this.id);
    if (err) {
      logger.error(err);
      return { error: true, detail: "Not found!" };
    };return { error: typeof data === "string", detail: data };
  };

  async shareListInfo() {
    const { _id }: any = await this.tokenTransformer();
    let [err, data] = await tryToCatch(async (userId: string) => UserModel.findById(userId), _id);
    if (err) {
      logger.error(err);
      return { error: true, detail: err };
    };  
    if (!data) return { error: true, detail: "Unkown user!" };

    [err, data] = await tryToCatch(async (id: string) => {
      const clusterDoc = await ClusterModel.findById(data.cluster);
      const collectionDoc = await CollectionModel.findById(this.collectionId);
      const allListDoc = await ListModel.find({collectionParent: this.collectionId});
      const listDoc = await ListModel.findById(id).lean();
      
      if (!clusterDoc.collections.includes(this.collectionId))
        return "Forbidden";
      if (listDoc.collectionParent.toString() === this.collectionId) 
        return "You already had this list!";
      if (!listDoc.shared) 
        return "This list is private!";

      const {_id, __v, ...listData} = listDoc;

      for (let list of allListDoc) {
        if (listData.name === list.name) 
          listData.name += `(shared ${Math.random().toString(16).substr(2, 4)})`;
      };

      listData.collectionParent = this.collectionId;
      const newList = new ListModel({...listData});
      newList.save()

      collectionDoc.lists.push(listDoc);
      collectionDoc.save();

      return listDoc;
    }, this.id);
    if (err) {
      logger.error(err);
      return { error: true, detail: err };
    };return { error: typeof data === "string", detail: data };    
  };

  async createlistInfo() {    
    const { _id }: any = await this.tokenTransformer();
    let [err, data] = await tryToCatch(async (userId: string) => UserModel.findById(userId), _id);
    if (err) {
      logger.error(err);
      return { error: true, detail: err };
    }; 
    if (!data) return { error: true, detail: "Unkown user!" };

    [err, data] = await tryToCatch(async (list: List<ObjectId>) => {
      const { clusterParent, shared } = await CollectionModel.findById(list.collectionParent);
            
      // check if collection belong to the right user collection      
      if (data.cluster.toString() !== clusterParent.toString()) return "Forbidden!";
      // checifcluster name does exists!      
      const listNameDoesExists = await ListModel.find(
        {
          collectionParent: list.collectionParent, name: list.name
        }
      );
      if (listNameDoesExists.length) return "List name already exists!";
      // create new collection
      list.shared = shared ? list.shared : shared;
      const listDoc = new ListModel({ ...list});
      await listDoc.save();      
      
      const _ = await CollectionModel.updateOne({_id: list.collectionParent}, {$push: {lists: listDoc}});      
      
      return listDoc;
    }, this.listInfo);
    if (err) {
      logger.error(err);
      return { error: true, detail: err };
    };return { error: typeof data === "string", detail: data };
  };

  async updateListInfo() {
    const { _id }: any = await this.tokenTransformer();
    let [err, data] = await tryToCatch((userId: string) => UserModel.findById(userId), _id);
    if (err) {
      logger.error(err);
      return { error: true, detail: err };
    };
    if (!data) return { error: true, detail: "Unkown user!" };

    [err, data] = await tryToCatch(async (update: List<ObjectId>) => {
      const { clusterParent, shared } = await CollectionModel.findById(update.collectionParent);
      // check if collection belong to the right user collection      
      if (data.cluster.toString() !== clusterParent.toString()) return "Forbidden!";

      const ListDoc = await ListModel.findOne({_id: this.id, collectionParent: update.collectionParent});
      // check if lisr name does exists!      
      const listNameDoesExists = await ListModel.find(
        {
          collectionParent: update.collectionParent, name: update.name
        }
      );
      ListDoc.shared = shared ? update.shared : shared;
      await ListDoc.save();
      if (listNameDoesExists.length) return ListDoc;

      ListDoc.name = update.name;
      ListDoc.shared = shared ? update.shared : shared;
      await ListDoc.save();

      return ListDoc;
    }, this.listInfo);    
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
      const {collectionParent} = await ListModel.findById(id);

      const { clusterParent } = await CollectionModel.findById(collectionParent);
      // check if collection belong to the right user collection      
      if (data.cluster.toString() !== clusterParent.toString()) return "Forbidden!";

      const res = await ListModel.deleteOne({_id: id, collectionparent: collectionParent});
      const collectionDoc = await CollectionModel.findById(collectionParent);
      collectionDoc.lists = collectionDoc.lists.filter((list: {_id: any}) => list._id.toString() !== id);
      collectionDoc.save();
      return "List has been deleted!";
    }, this.id);
    if (err) {
      logger.error(err);
      return { error: true, detail: "Couldn't delete list!" };
    };return { error: false, detail: data};
  };

};