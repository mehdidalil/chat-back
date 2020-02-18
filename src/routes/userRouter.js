import express from 'express';
import validator from 'little-validator';

const userRouter = express.Router();

userRouter.post('/create', (req, res) => {
	validator(user)
	res.send(req.body);
})