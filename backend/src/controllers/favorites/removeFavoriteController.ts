import asyncHandler from 'express-async-handler';
import { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export default asyncHandler(async (req: Request, res: Response) => {
  const { characterId, userId } = req.body;

  if (!characterId || !userId) {
    res.status(400).json({ message: 'Some required data is missing.' });
    return;
  }

  try {
    // if the favorite does not exist then return else remove the connection with the user
    const favorite = await prisma.favorite.findFirst({
      where: {
        characterId,
        userId,
      },
    });

    if (!favorite) {
      res
        .status(200)
        .json({ message: 'The character was not added as favorite.' });
      return;
    }

    await prisma.favorite.delete({
      where: {
        id: favorite.id,
      },
    });

    res.status(200).json({ message: 'Character removed from favorites.' });
  } catch (error) {
    res
      .status(500)
      .json({ message: 'An error has occurred. Please try again.' });
  }
});
