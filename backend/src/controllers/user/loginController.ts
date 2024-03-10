import asyncHandler from 'express-async-handler';
import { Request, Response } from 'express';
import bcrypt from 'bcrypt';
import { PrismaClient } from '@prisma/client';
import jwt from 'jsonwebtoken';

const prisma = new PrismaClient();

export default asyncHandler(async (req: Request, res: Response): Promise<void> => {
  const { email, password } = req.body;

  if (!email || !password) {
    res.status(400).json({message: 'Email and password are required.'});
    return;
  }

  try {
    const user = await prisma.user.findFirst({
      where: {
        email,
      },
    });

    if (!user) {
      res.status(400).json({message: 'Wrong credentials.'});
      return;
    }

    const passwordMatch = await bcrypt.compare(password, user.password);

    if (!passwordMatch) {
      res.status(400).json({message: 'Wrong credentials.'});
      return;
    }

    const token = jwt.sign({userId: user.id, userEmail: user.email}, process.env.RANDOM_SEED as string, {expiresIn: '24h'});
    
    res.status(200).json({message: 'User logged in successfully.', token});
  } catch (error) {
    res.status(500).json({message: 'An error has occurred. Please try again.'});
  }
});