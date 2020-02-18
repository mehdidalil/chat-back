import express from 'express';
import bodyParser from 'body-parser';
import mongoose from 'mongoose';
import { Client } from 'pg';
import dotenv from 'dotenv';
import { messageRouter } from './routes';

dotenv.config()

const app = express()

app.use(bodyParser.json())
app.use('/message', messageRouter);
app.listen(8000, () => {
	console.log('connected')
});

const client = new Client({
	user: 'postgres',
	host: '0.0.0.0',
	database: 'postgres',
	password: '123456',
	port: 5432
});

client.connect()
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