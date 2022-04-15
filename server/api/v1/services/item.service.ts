import jwt from "jsonwebtoken";
import { ObjectId } from "mongoose"

import { ListModel } from "../models/list.model";
import { UserModel } from "../models/user.model";
import { CollectionModel } from "../models/collection.model";
import { ClusterModel } from "../models/cluster.model";

import { Item } from "../interfaces/item.interface";

import { tryToCatch } from "../utils";
import { logger } from "../logger";
import { ItemModle } from "../models/item.model";
import { isError } from "util";

export class ItemService {
  private token: string;
  private id: string | null;
  private itemInfo: Item<ObjectId> | null;

  constructor(token: string, id: string | null, itemInfo: Item<ObjectId> | null) {
    this.token = token;
    this.id = id;
    this.itemInfo = itemInfo;
  };

  async tokenTransformer() {
    return await jwt.verify(this.token, process.env.SECRET_KEY!);
  };

  async createItemInfo() {
    const { _id }: any = await this.tokenTransformer();
    let [err, data] = await tryToCatch(async (userId: string) => UserModel.findById(userId), _id);
    if (err) {
      logger.error(err);
      return { error: true, detail: err };
    }; 
    if (!data) return { error: true, detail: "Unkown user!" };

    [err, data] = await tryToCatch(async (item: Item<ObjectId>) => {
      // check if the item belong to the right user item
      const listDoc = await ListModel.findById(item.listParent);
      const collectionDoc = await CollectionModel.findById(listDoc.collectionParent);
      if (collectionDoc.clusterParent.toString() !== data.cluster.toString()) return "Forbidden!";
      // check if key already exists
      const keyDoesExists = await ItemModle.findOne({key: item.key, listParent: item.listParent});
      if (keyDoesExists) return "This key already exists!";

      const itemDoc = new ItemModle({...item});
      itemDoc.save();

      const _ = await ListModel.updateOne({_id: item.listParent}, {$push: {items: itemDoc}});

      return itemDoc
    }, this.itemInfo);
    if (err) {
      logger.error(err);
      return { error: true, detail: err };
    };return { error: typeof data === "string", detail: data };

  };

  async updateItemInfo() {
    const { _id }: any = await this.tokenTransformer();
    let [err, data] = await tryToCatch(async (userId: string) => UserModel.findById(userId), _id);
    if (err) {
      logger.error(err);
      return { error: true, detail: err };
    }; 
    if (!data) return { error: true, detail: "Unkown user!" };

    [err, data] = await tryToCatch(async (update: Item<ObjectId>) => {
      // check if the item belong to the right user item
      const itemDoc = await ItemModle.findById(this.id);
      const listDoc = await ListModel.findById(itemDoc.listParent);
      const collectionDoc = await CollectionModel.findById(listDoc.collectionParent);
      if (collectionDoc.clusterParent.toString() !== data.cluster.toString()) return "Forbidden!";
      // check if key already exists
      const keyDoesExists = await ItemModle.findOne({key: update.key, listParent: listDoc._id});
      
      if (keyDoesExists) return "This key already exists!";
      // update
      itemDoc.key = update.key;
      itemDoc.value = update.value;
      itemDoc.save()

      return itemDoc
    }, this.itemInfo);
    if (err) {
      logger.error(err);
      return { error: true, detail: err };
    };return { error: typeof data === "string", detail: data };

  };

  async deleteItemInfo() {
    const { _id }: any = await this.tokenTransformer();
    let [err, data] = await tryToCatch(async (userId: string) => UserModel.findById(userId), _id);
    if (err) {
      logger.error(err);
      return { error: true, detail: err };
    }; 
    if (!data) return { error: true, detail: "Unkown user!" };

    [err, data] = await tryToCatch(async (id: Item<ObjectId>) => {
      // check if the item belong to the right user item
      const itemDoc = await ItemModle.findById(id);
      const listDoc = await ListModel.findById(itemDoc.listParent);
      const collectionDoc = await CollectionModel.findById(listDoc.collectionParent);
      if (collectionDoc.clusterParent.toString() !== data.cluster.toString()) return new Error("Forbidden!");
      
      const _ = await ItemModle.deleteOne({_id: id, listParent: listDoc._id});
      const ListDoc = await ListModel.findById(itemDoc.listParent);
      ListDoc.items = ListDoc.items.filter((item: {_id: any}) => item._id.toString() !== id);
      ListDoc.save();

      return "Item has been deleted";
    }, this.id);
    if (err) {
      logger.error(err);
      return { error: true, detail: err };
    };return { error: false, detail: data };
  };

};