import http from 'http';
import socketIo from 'socket.io';
import app from './app';

const server = http.createServer(app);
const io = socketIo(server);

server.listen(8080, () => {
	console.log('socket listening on 8080');
});

export default io;