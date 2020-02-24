import http from 'http';
import socketIo from 'socket.io';
import app from './app';

const server = http.createServer(app);

export default server;