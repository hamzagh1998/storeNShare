import { Schema, model } from "mongoose";

import { Item } from "../interfaces/item.interface";

const ItemSchema: Schema = new Schema<Item>({
  key: { type: String, required: true}
});

export const ItemModle = model("Item", ItemSchema);