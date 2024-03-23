import asyncHandler from 'express-async-handler';
import { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';
import { type Character } from '../../types/character';
import redisClient from '../../libs/redisClient';

const prisma = new PrismaClient();

export default asyncHandler(
  async (req: Request, res: Response): Promise<void> => {
    const { userId } = req.body;
    const { characterId } = req.params;

    if (!userId || !characterId) {
      res.status(400).json({ message: 'Some required data is missing.' });
      return;
    }

    try {
      let data: Character;
      const cachedData = await redisClient.get(`character:${characterId}`);

      if (cachedData) {
        data = JSON.parse(cachedData) as Character;
      } else {
        const response = await fetch(
          `${process.env.DATA_API_URL}/${characterId}`
        );

        if (!response.ok) {
          res
            .status(500)
            .json({ message: 'An error has occurred. Please try again.' });
          return;
        }

        data = (await response.json()) as Character;

        await redisClient.set(
          `character:${characterId}`,
          JSON.stringify(data),
          'EX',
          process.env.REDIS_EXPIRATION || 60 * 60 * 24
        );
      }

      const isFavorite = await prisma.favorite.findFirst({
        where: {
          userId,
          characterId: Number(characterId),
        },
      });

      res.status(200).json({ ...data, isFavorite: !!isFavorite });
    } catch (error) {
      res
        .status(500)
        .json({ message: 'An error has occurred. Please try again.' });
    }
  }
);
