import { devLogger } from "./dev.logger";
import { prodLogger } from "./prod.logger";

<<<<<<< HEAD
export const logger = process.env.NODE_ENV === "production" ? prodLogger() : devLogger();
=======
export const logger = process.env.NODE_ENV === "production" ? prodLogger() : devLogger()
>>>>>>> 1cccf3401af7fd89a424509b0c0dcf65580ccf16
