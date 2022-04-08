import { Schema, model } from "mongoose";

import { List } from "../interfaces/list.interface";

const ListSchema: Schema = new Schema<List<Schema.Types.ObjectId>>({
  collectionParent: { type: Schema.Types.ObjectId, ref: "Collection" },
  name: { type: String, required: true },
  shared: { type: Boolean, required: true },
  items: [{ type: Schema.Types.ObjectId, ref: "Item" }]
});

export const ListModel = model("List", ListSchema);