import { Request, Response, NextFunction } from "express";

export function errorHandler(fn: Function) {
    
  return (req: Request, res: Response, next: NextFunction) => Promise.resolve(fn(req, res, next))
                                                                     .catch(next);
};