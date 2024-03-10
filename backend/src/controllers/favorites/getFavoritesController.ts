import asyncHandler from 'express-async-handler';
import { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';
import { type Character } from '../../types/character';

const prisma = new PrismaClient();

export default asyncHandler(async (req: Request, res: Response) => {
  const { userId } = req.body;

  if (!userId) {
    res.status(400).json({message: 'Some required data is missing.'});
    return;
  }

  try {
    const user = await prisma.user.findUnique({
      where: {
        id: userId,
      },
      include: {
        favorites: true
      },
    });

    const favoritesIds = user?.favorites.map((favorite) => favorite.characterId) ?? [];

    if (favoritesIds.length === 0) {
      res.status(200).json([]);
      return;
    }

    const idsParam = favoritesIds.length === 1 ? `${favoritesIds[0]}` : `${favoritesIds.join(',')}`;

    const response = await fetch(`${process.env.DATA_API_URL}/${idsParam}`);

    if (!response.ok) {
      res.status(500).json({ message: 'An error has occurred. Please try again.' });
      return;
    }

    if (idsParam.length > 1) {
      const data = (await response.json()) as Character[];
      let result: Character[] = [];

      if (data) {
        result = data.map((character) => {
          return {...character, isFavorite: true};
        });
      }
      res.status(200).json(result);
    } else {
      const data = (await response.json()) as Character; 
      res.status(200).json([{...data, isFavorite: true}]);
    }
  } catch (error) {
    res.status(500).json({ message: 'An error has occurred. Please try again.' });
  }
});