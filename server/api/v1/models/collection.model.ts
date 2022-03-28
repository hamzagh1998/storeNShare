import { Schema, model } from "mongoose";

import { Collection } from "../interfaces/collection.interface";

const CollectionSchema: Schema = new Schema<Collection<Schema.Types.ObjectId>>({
  name: { type: String, required: true },
  shared: { type: Boolean, required: true },
  lists: [{ type: Schema.Types.ObjectId, ref: "List" }]
});

export const CollectionModel = model("Collection", CollectionSchema);