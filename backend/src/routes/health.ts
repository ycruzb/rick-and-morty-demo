import express from 'express';
import healthController from '../controllers/app/healthController';

const router = express.Router();

router.get('/', healthController);

export default router;
