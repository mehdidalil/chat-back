import express from 'express';
import dotenv from 'dotenv';
import bodyParser from 'body-parser';
import cors from 'cors';
import messageRouter from '../routes/messageRouter';
import userRouter from '../routes/userRouter';

dotenv.config()

const domain = ["http://localhost:3000"];
const corsOptions = {
	origin: function (origin, callback) {
		if (domain.indexOf(origin) == -1)
			callback(new Error("Unauthorized domain"));
		else
			callback(null, true)
	}
}

const app = express()

app.use(cors(corsOptions));
app.use(bodyParser.json())
app.use('/message', messageRouter);
app.use('/user', userRouter);

export default app;