const SocketIO = require('socket.io');

module.exports = (server) => {
	const io = SocketIO(server, { path : '/socket.io'});
	
	io.on('connection', (socket) => {
		const req = socket.request;
		const ip = req.connection.remoteAddress;
		console.log('새로운 CLIENT', ip, socket.id, req.ip);
		
		socket.on('disconnect', ()=>{
			console.log('접속 해제');
			clearInterval(socket.interval);
		});
		
		socket.on('error', (err)=>{
			console.error(err);
		});
		
		socket.on('reply', (data)=>{
			console.log(data);
		});
		
		socket.interval = setInterval(()=>{
			socket.emit('news', 'Hello SocketIO');
		},3000);
	});
	
};