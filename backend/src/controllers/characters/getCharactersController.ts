import asyncHandler from 'express-async-handler';
import { Request, Response } from 'express';
import { type dataApiCharactersListResponse } from '../../types/dataApiResponse';
import { PrismaClient } from '@prisma/client';
import redisClient from '../libs/redisClient';

const prisma = new PrismaClient();

export default asyncHandler(
  async (req: Request, res: Response): Promise<void> => {
    const { userId } = req.body;

    if (!userId) {
      res.status(401).json({ message: 'Unauthorized.' });
      return;
    }

    const page = req.query.page || 1;
    const status = req.query.status || 'all';
    const gender = req.query.gender || 'all';

    try {
      let data: dataApiCharactersListResponse;
      const cachedData = await redisClient.get(
        `characters:page:${page}:status:${status}:gender:${gender}`
      );

      if (cachedData) {
        data = JSON.parse(cachedData) as dataApiCharactersListResponse;
      } else {
        const response = await fetch(
          `${process.env.DATA_API_URL}/?page=${page}${
            status === 'all' ? '' : `&status=${status}`
          }${gender === 'all' ? '' : `&gender=${gender}`}`
        );

        if (!response.ok) {
          res
            .status(500)
            .json({ message: 'An error has occurred. Please try again.' });
          return;
        }

        data = (await response.json()) as dataApiCharactersListResponse;

        await redisClient.set(
          `characters:page:${page}:status:${status}:gender:${gender}`,
          JSON.stringify(data),
          'EX',
          process.env.REDIS_EXPIRATION || 60 * 60 * 24
        );
      }

      const charactersIds = data.results.map((character) => character.id);

      const favorites = await prisma.favorite.findMany({
        where: {
          userId,
          characterId: {
            in: charactersIds,
          },
        },
      });

      data.results = data.results.map((character) => {
        const isFavorite = favorites.some(
          (favorite) => favorite.characterId === character.id
        );

        return {
          ...character,
          isFavorite,
        };
      });

      res.status(200).json({ ...data });
    } catch (error) {
      res
        .status(500)
        .json({ message: 'An error has occurred. Please try again.' });
    }
  }
);
