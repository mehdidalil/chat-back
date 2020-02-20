import express from 'express';
import { Message } from '../models';
import { getDateNow } from '../helper';
import { io } from '../config';

const messageRouter = express.Router();

messageRouter.get('/', (req, res) => {
	Message
	.find({})
	.then(response => res.status(200).send(response))
	.catch(e => console.log(e));
});

messageRouter.post('/create', (req, res) => {
	const message = new Message(req.body);
	message
	.save()
	.then(() => {
		res.status(200).send("Message created");
	})
	.catch(e => res.status(400).send(`Cannot add message: ${e.message}`));
});

export default messageRouter;