import cluster, { Cluster, Worker } from "cluster";
import { cpus } from "os";
import path from "path";
import dotenv from "dotenv";
import ip from "ip";

import { app } from "./app";
import { connectDB } from "./config/DB";
import { logger } from "./logger";

import { spawnWorker } from "./utils";

dotenv.config({ path: path.resolve(__dirname, "./config/.env") });

const PORT: number = Number(process.env.PORT) || 5000;
const processesNum: number = cpus().length;

process.env.NODE_ENV === "production"

  ? connectDB(process.env.MONGO_PRO_URL!)
  : connectDB(process.env.MONGO_DEV_URL!);  

if (process.env.NODE_ENV === "production") {
  if (cluster.isPrimary) {
    let workers: Array<Worker> = [];
    
    for (let i=0; i<processesNum; i++) spawnWorker<Worker, Cluster>(workers, cluster, i);
  } else {
    app.listen(PORT, () => logger.info("Worker run on port: " +PORT));
  };

} else if (process.env.NODE_ENV === "development") {
  app.listen(PORT, () => logger.info("Server run on development mode on port: "+PORT));
} else {
  app.listen(PORT, ip.address(), 
    () => logger.info("Server run on development mode on: "+ip.address()+":"+PORT));
};