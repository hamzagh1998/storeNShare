import { Schema, model } from "mongoose";

import { Cluster } from "../interfaces/cluster.interface";

const ClusterSchema: Schema = new Schema<Cluster<Schema.Types.ObjectId>>({
  name: { type: String, required: true },
  shared: { type: Boolean, required: true },
  collections: [{ type: Schema.Types.ObjectId, ref: "Collection" }]
});

export const ClusterModel = model("Cluster", ClusterSchema);