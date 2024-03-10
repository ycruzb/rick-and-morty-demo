import express from 'express';
import versionController from '../controllers/app/versionController';

const router = express.Router();

router.get('/', versionController);

export default router;