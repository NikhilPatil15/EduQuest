import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import { connectDatabase } from './database/dbConnection';
import { corsOrigin } from './config/settings';

const app = express();

dotenv.config({ path: './.env' });
const PORT = process.env.PORT || 5000;

connectDatabase().then(() => {
	console.log('Connected');
});

console.log(corsOrigin);

app.use(
	cors({
		origin: corsOrigin!,
		credentials: true,
	}),
);

app.use(express.json());

app.use(express.static('public'));

app.listen(PORT || 5000, () => {
	console.log(`App is stared and is running on http://localhost:${PORT}`);
});

app.get('/', (req, res) => {
	res.send('Hello');
});

import userRouter from './routes/user.routes';

app.use('/api/v1/users', userRouter);
