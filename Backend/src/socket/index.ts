// socket/index.ts
import { Server } from 'socket.io';
import { setupBattleSocket } from './battle.socket';

export const setupSocketIO = (io: Server) => {
	console.log('🔄 Setting up Socket.io namespaces...');

	setupBattleSocket(io);

	// Setup all socket namespaces here
	io.on('connection', (socket) => {
		console.log('🔗 User connected to global namespace:', socket.id);

		socket.on('message', (msg) => {
			console.log('📩 Received:', msg);
			socket.emit('message', `Echo: ${msg}`);
		});

		socket.on('disconnect', (reason) => {
			console.log('🔌 User disconnected from global namespace:', socket.id, 'Reason:', reason);
		});

		socket.on('error', (error) => {
			console.error('❌ Socket error:', error);
		});
	});

	// Global connection handler
};
