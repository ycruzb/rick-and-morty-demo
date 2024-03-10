import express from 'express';
import loginController from '../controllers/user/loginController';

const router = express.Router();

router.post('/', loginController);

export default router;