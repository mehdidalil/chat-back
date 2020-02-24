import socketIo from 'socket.io';
import server from './server';

const io = socketIo(server);

io.on("connection", (socket) => {
	let token = socket.handshake.query.token;
	console.log("User connected");
	socket.on("disconnect", (data) => {
		socket.disconnect(true);
		console.log("User disconnected");
	});
});

export default io;