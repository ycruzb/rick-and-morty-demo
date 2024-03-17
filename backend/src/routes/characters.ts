import express from 'express';
import getCharactersController from '../controllers/characters/getCharactersController';
import getCharacterController from '../controllers/characters/getCharacterController';
import { authMiddleware } from '../middlewares/auth';

const router = express.Router();

router.get('/', authMiddleware, getCharactersController);
router.get('/:characterId', authMiddleware, getCharacterController);

export default router;
