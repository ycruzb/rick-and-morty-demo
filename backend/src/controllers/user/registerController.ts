import asyncHandler from 'express-async-handler';
import bcrypt from 'bcrypt';
import { Request, Response } from 'express';
import { PrismaClient, User } from '@prisma/client';

const prisma = new PrismaClient();

export default asyncHandler(
  async (req: Request, res: Response): Promise<void> => {
    const { email, password } = req.body;

    if (!email || !password) {
      res.status(400).json({ message: 'Email and password are required.' });
      return;
    }

    try {
      const userExists = await prisma.user.findFirst({
        where: {
          email,
        },
      });

      if (userExists) {
        res.status(400).json({ message: 'User already exists.' });
        return;
      }

      const hashedPassword = await bcrypt.hash(password, 10);

      const user = await prisma.user.create({
        data: {
          email,
          password: hashedPassword,
        },
      });

      const userToReturn: Omit<User, 'password'> = {
        id: user.id,
        email: user.email,
        createdAt: user.createdAt,
        updatedAt: user.updatedAt,
      };

      res
        .status(200)
        .json({ message: 'User registered successfully.', user: userToReturn });
    } catch (error) {
      res
        .status(500)
        .json({ message: 'An error has occurred. Please try again.' });
    }
  }
);
