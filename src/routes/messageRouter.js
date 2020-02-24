import express from 'express';
import { Message } from '../models';
import { io } from '../config';
import { checkToken, isAuth } from '../middleware';

const messageRouter = express.Router();

messageRouter.get('/', (req, res) => {
	Message
	.find({})
	.then(response => res.status(200).send(response))
	.catch(e => console.log(e));
});

messageRouter.post('/', isAuth, (req, res) => {
	const { content } = req.body;
	const token = req.headers.authorization.split(" ")[1];

	checkToken(token)
	.then(tok => {
		const message = new Message({
			content,
			userId: tok.id,
		});
		message
		.save()
		.then(response => {
			res.status(200).json(response);
			io.sockets.emit("newMessage", response);
		})
		.catch(e => {
			console.log(e);
			res.status(400).send(`Cannot add message: ${e.message}`)
		});
	})
	.catch(e => console.log(e));
});

export default messageRouter;