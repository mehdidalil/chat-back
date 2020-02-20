import express from 'express';
import { isAuth } from '../middleware';
import { UserEntity } from '../entities';
import { parseError } from '../helper';

const userRouter = express.Router();

userRouter.get('/secret', isAuth, (req, res) => {
	res.status(200).send("OOOOOKKKKK");
});

userRouter.post('/login', (req, res) => {
	UserEntity
	.login(req.body)
	.then(response => res.status(200).send(response))
	.catch(e => {
		let error = parseError(e.message || e);
		res.statusMessage = `Can't login: ${e}`;
		res.status(400).send(error);
	});
});

userRouter.get('/:id', (req, res) => {
	UserEntity
	.getById(req.params.id)
	.then(response => res.status(200).send(response))
	.catch(e => res.status(400).send(error));
});

userRouter.post('/create', (req, res) => {
	UserEntity
	.add(req.body)
	.then(response => res.status(200).send(response))
	.catch(e => {
		let error = parseError(e.message || e);
		res.statusMessage = `User not created: ${e}`;
		res.status(400).send(error);
	});
});

userRouter.post('/modifyAvatar', isAuth, (req, res) => {
	UserEntity
	.modifyAvatar(req.body.userId, req.body.avatarId)
	.then(response => res.status(200).send(response))
	.catch(e => {
		let error = parseError(e.message || e);
		res.statusMessage = `Avatar not updated: ${e}`;
		res.status(400).send(error);
	})
})

export default userRouter;