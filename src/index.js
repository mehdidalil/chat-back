import mongoose from 'mongoose';
import { pgClient, app } from './config';
import { Message } from './models';

app.listen(8000, () => {
	console.log('node listening on 8000')
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
		console.log('MongoDB: connnection OK !');
	})
	.catch((e) => {
		console.log(`Unable to connect MongoDB: ${e}`);
	});