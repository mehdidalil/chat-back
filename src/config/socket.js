import http from 'http';
import socketIo from 'socket.io';
import app from './app';

const server = http.createServer(app);
const io = socketIo(server);

server.listen(8080, () => {
	console.log('socket listening on 8080');
});

io.on("connection", (socket) => {
	let token = socket.handshake.query.token;
	console.log("User connected");
	socket.on("disconnect", (data) => {
		socket.disconnect(true);
		console.log("User disconnected");
	});
});

export default io;