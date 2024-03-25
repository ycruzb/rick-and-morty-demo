import express from 'express';
import addFavoriteController from '../controllers/favorites/addFavoriteController';
import removeFavoriteController from '../controllers/favorites/removeFavoriteController';
import getFavoritesController from '../controllers/favorites/getFavoritesController';

const router = express.Router();

router.get('/', getFavoritesController);
router.post('/', addFavoriteController);
router.delete('/', removeFavoriteController);

export default router;
