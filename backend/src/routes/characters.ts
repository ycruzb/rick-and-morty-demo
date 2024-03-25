import express from 'express';
import getCharactersController from '../controllers/characters/getCharactersController';
import getCharacterController from '../controllers/characters/getCharacterController';

const router = express.Router();

router.get('/', getCharactersController);
router.get('/:characterId', getCharacterController);

export default router;
