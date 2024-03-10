import jwt from 'jsonwebtoken';
import { Request, Response, NextFunction } from 'express';

export const authMiddleware = (req: Request, res: Response, next: NextFunction): void => {
  const tokenHeader = req.headers.authorization;

  if (!tokenHeader) {
    res.status(401).json({message: 'Unauthorized.'});
    return;
  }

  try {
    const token = tokenHeader.split(' ')[1];
    const decoded = jwt.verify(token, process.env.RANDOM_SEED as string);
    req.body.userId = (decoded as {userId: string}).userId;
    next();
  } catch (error) {
    res.status(401).json({message: 'Unauthorized.'});
  }
};