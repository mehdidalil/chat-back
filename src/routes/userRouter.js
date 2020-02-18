import express from 'express';
import { futaba } from 'little-validator';
import { userSchema } from '../schemes';
import { pgClient } from '../config';

const userRouter = express.Router();

userRouter.post('/create', (req, res) => {
	try {
		futaba(userSchema, req.body);
		const { username, password, mail } = req.body;

		pgClient
		.query(`INSERT INTO "user" ("username", "password", "mail") VALUES ('${username}', '${password}', '${mail}');`)
		.then(response => {
			res.status(200).send("User created !");
		})
		.catch(e => {
			res.status(400).send(`User not created: ${e.detail}`);
		});
	}
	catch (e) {
		res.status(400).send(`Error: ${e.message}`);
	}
});

export default userRouter;