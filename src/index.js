import express from 'express';
import bodyParser from 'body-parser';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import { messageRouter, userRouter } from './routes';
import { pgClient } from './config';

dotenv.config()

const app = express()

app.use(bodyParser.json())
app.use('/message', messageRouter);
app.use('/user', userRouter);
app.listen(8000, () => {
	console.log('connected')
});

pgClient.connect()
	.then(() => {
		console.log("PostgreSQL: connnection OK !");
	})
	.catch((e) => {
		console.log(`Unable to connect PostgreSQL: ${e}`);
	});

mongoose.connect(process.env.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
	.then(() => {
		console.log('MongoDB: connnection OK ! !');
	})
	.catch((e) => {
		console.log(`Unable to connect MongoDB: ${e}`);
	});