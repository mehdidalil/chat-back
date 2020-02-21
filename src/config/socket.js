import http from 'http';
import socketIo from 'socket.io';
import app from './app';
import { Message } from '../models';
import jwt from 'jsonwebtoken';
import { checkToken } from '../middleware';

const server = http.createServer(app);
const io = socketIo(server);

server.listen(8080, () => {
	console.log('socket listening on 8080');
});

io.on("connection", (socket) => {
	let token = socket.handshake.query.token;
	console.log("User connected");
	socket.on("addMessage", (data) => {
		checkToken(token)
		.then(tok => {
			const message = new Message(data.message);
			message
			.save()
			.then(response => io.sockets.emit("newMessage", response))
			.catch(e => socket.emit("newMessageError", `Cannot add message: ${e.message}`));
		})
		.catch(e => {
			console.log("bad token !!");
			socket.emit("invalidToken");
		})
		
	});
	socket.on("disconnection", (data) => {
		socket.disconnect(true);
		console.log("User disconnected");
	})
});

export default io;