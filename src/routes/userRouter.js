import express from 'express';
import { isAuth } from '../middleware';
import { UserEntity } from '../entities';
import { parseError } from '../helper';
import { checkToken } from '../middleware';

const userRouter = express.Router();

userRouter.post('/token', isAuth, (req, res) => {
	res.status(200).send("OK");
});

userRouter.post('/login', (req, res) => {
	UserEntity
	.login(req.body)
	.then(response => res.status(200).send(response))
	.catch(e => {
		let error = parseError(e.message || e);
		res.statusMessage = `Can't login: ${e}`;
		res.status(400).send(e);
	});
});

userRouter.get('/', (req, res) => {
	UserEntity
	.getAllUsers()
	.then(response => res.status(200).send(response))
	.catch(e => {
		let error = parseError(e.message || e);
		res.statusMessage = `Can't get all users: ${e}`;
		res.status(400).send(e);
	})
});

userRouter.get('/:id', (req, res) => {
	UserEntity
	.getById(req.params.id)
	.then(response => res.status(200).send(response))
	.catch(e => {
		let error = parseError(e.message || e);
		res.statusMessage = `Can't get user by id: ${e}`;
		res.status(400).send(e);
	});
});

userRouter.post('/modifyAvatar', isAuth, (req, res) => {
	const token = req.headers.authorization.split(" ")[1];
	checkToken(token)
	.then(tok => {
		UserEntity
		.modifyAvatar(tok.id, parseInt(req.body.avatarId))
		.then(response => res.status(200).send({ avatarId: response }))
		.catch(e => {
			let error = parseError(e.message || e);
			res.statusMessage = `Avatar not updated: ${e}`;
			res.status(400).send(error);
		});
	})
	.catch(err => {
		res.status(400).send(err);
	});
});

userRouter.post('/', (req, res) => {
	UserEntity
	.add(req.body)
	.then(response => res.status(200).send(response))
	.catch(e => {
		let error = parseError(e.message || e);
		res.statusMessage = `User not created: ${e}`;
		res.status(400).send(error);
	});
});

userRouter.delete('/:id', (req, res) => {
	UserEntity
	.deleteUser(parseInt(req.params.id))
	.then(response => res.status(200).send(response))
	.catch(e => {
		let error = parseError(e.message || e);
		res.statusMessage = `User not created: ${e}`;
		res.status(400).send(error);
	});
});

export default userRouter;