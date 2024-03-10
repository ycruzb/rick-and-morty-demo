import express from 'express';
import addFavoriteController from '../controllers/favorites/addFavoriteController';
import removeFavoriteController from '../controllers/favorites/removeFavoriteController';
import getFavoritesController from '../controllers/favorites/getFavoritesController';
import { authMiddleware } from '../middlewares/auth';

const router = express.Router();

router.get('/', authMiddleware, getFavoritesController);
router.post('/', authMiddleware, addFavoriteController);
router.delete('/', authMiddleware, removeFavoriteController);

export default router;