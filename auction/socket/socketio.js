const socketIO = require('socket.io');

module.exports = (server,app) => {
	const io = socketIO(server, { path: '/socket.io'});
	
	app.set('io', io);
	
	io.on('connection', (socket) => {
		const req = socket.request;
		const { headers : {referer}} = req;
		const roomId = referer.split('/')[referer.split('/').length -1];
		socket.join(roomId);
		socket.on('disconnect', () => {
			socket.leave(roomId);
		});
	});
};

// socketio로 client와 연결 후 socket.join으로 room 입장