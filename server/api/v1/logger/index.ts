import { devLogger } from "./dev.logger";
import { prodLogger } from "./prod.logger";

export const logger = process.env.NODE_ENV === "production" ? prodLogger() : devLogger();