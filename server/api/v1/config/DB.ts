import mongoose from "mongoose";
import { logger } from "../logger";

export async function connectDB(url: string): Promise<void> {
  try {
    const conn = await mongoose.connect(url);
    logger.info(`MongoDB connected: ${conn.connection.host}`);
  } catch (err) {
    logger.error(err);
    process.exit(1);
  };
};