import { Request, Response, NextFunction } from "express";

import { logger } from "../logger";

export function errorCatcher
(err: {message: string}, req: Request, res: Response, next: NextFunction)
{
  logger.error(err.message);
  return res.status(500).json({error: true, detail: err.message});
};