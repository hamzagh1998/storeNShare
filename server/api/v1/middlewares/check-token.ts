import { Request, Response, NextFunction } from 'express';
import jwt from "jsonwebtoken";
import { tryToCatch } from '../utils';

export async function checkToken(req: Request, res: Response, next: NextFunction) {
  const token: string = req.headers.authorization?.split(' ')[1]!;
  const [error, _] = await tryToCatch(jwt.verify, token, process.env.SECRET_KEY!);
  if (!token || error) 
    return res.status(403).json({error: true, detail: 'unauthorized!'});

  req.body.token = token;
  next();
};