import { Schema, model } from "mongoose";

import { Item } from "../interfaces/item.interface";

const ItemSchema: Schema = new Schema<Item<Schema.Types.ObjectId>>({
  listParent: { type: Schema.Types.ObjectId, required: true, ref: "lits"},
  key: { type: String, required: true},
  value: { type: String, required: true}
});

export const ItemModle = model("Item", ItemSchema);