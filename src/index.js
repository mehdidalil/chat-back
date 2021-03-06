import mongoose from 'mongoose';
import { pgClient, app, server } from './config';

server.listen(8080, () => {
	console.log('socket listening on 8080');
});

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