import http from 'http';
import socketIo from 'socket.io';
import app from './app';
import { Message } from '../models';

const server = http.createServer(app);
const io = socketIo(server);

server.listen(8080, () => {
	console.log('socket listening on 8080');
});

io.on("connection", (socket) => {
	console.log("User connected");
	socket.on("addMessage", (data) => {
		const message = new Message(data);
		message
		.save()
		.then(response => io.sockets.emit("newMessage", response))
		.catch(e => socket.emit("newMessageError", `Cannot add message: ${e.message}`));
		});
	socket.on("disconnection", (data) => {
		socket.disconnect(true);
		console.log("User disconnected");
	})
});

export default io;