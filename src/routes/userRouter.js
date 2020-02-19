import express from 'express';
import { isAuth } from '../middleware';
import { UserEntity } from '../entities';

const userRouter = express.Router();

userRouter.get('/secret', isAuth, (req, res) => {
	res.status(200).send("OOOOOKKKKK");
});

userRouter.post('/login', (req, res) => {
	UserEntity
	.login(req.body)
	.then(response => res.status(200).send(response))
	.catch(error => res.status(400).send(error));
});

userRouter.get('/:id', (req, res) => {
	UserEntity
	.getById(req.params.id)
	.then(response => res.status(200).send(response))
	.catch(error => res.status(400).send(error));
});

userRouter.post('/create', (req, res) => {
	UserEntity
	.add(req.body)
	.then(response => res.status(200).send(response))
	.catch(e => res.status(400).send(`User not created: ${e}`));
});

export default userRouter;