import express, { Express } from 'express';
import dotenv from 'dotenv';
import cors from 'cors';

import versionRoute from './routes/version';
import healthRoute from './routes/health';
import registerRoute from './routes/register';
import loginRoute from './routes/login';
import charactersRoute from './routes/characters';
import favoritesRoute from './routes/favorites';
import { authMiddleware } from './middlewares/auth';

dotenv.config();

const app: Express = express();
const port = process.env.PORT || 3000;

const corsOptions = {
  credentials: true,
  origin: [process.env.FRONTEND_BASE_URL ?? ''],
  optionsSuccessStatus: 200,
};
app.use(cors(corsOptions));

app.use(express.json());

app.use('/', versionRoute);
app.use('/health', healthRoute);
app.use('/register', registerRoute);
app.use('/login', loginRoute);
app.use('/characters', authMiddleware, charactersRoute);
app.use('/favorites', authMiddleware, favoritesRoute);

app.use((_req, res) => {
  res.status(404).json({ message: 'Not found' });
});

app.listen(port, () => {
  console.log(`[server]: Server is running at http://localhost:${port}`);
});
