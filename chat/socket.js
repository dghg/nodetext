const SocketIO = require('socket.io');
const axios = require('axios');
const Chat = require('./models/chat');
module.exports = (server,app, session)=> {
	const io = SocketIO(server, {path : '/socket.io'});
	app.set('io', io);
	const room = io.of('room');
	const chat = io.of('chat');
	io.use((socket,next)=>{
		session(socket.request, socket.request.res, next);
	});
	room.on('connection', (socket)=>{
		console.log('room 네임스페이스 접속');
		socket.on('disconnect', ()=>{
			console.log('room 접속 해제');
		});
	});
	
	chat.on('connection', async (socket)=>{
		console.log('chat 네임스페이스 접속');
		const req = socket.request;
		const { headers : {referer}} = req;
		const roomId = referer.split('/')[referer.split('/').length-1].replace(/\?.+/,'');
		const chat = await new Chat({
			room : roomId,
			user : 'system',
			chat : `${req.session.color}님이 입장하셨습니다. ${new Date(Date.now()).toUTCString()}`,
		}).save();
		socket.join(roomId);
		socket.to(roomId).emit('join', chat);
		
		socket.on('disconnect', async ()=>{
			console.log('chat 네임스페이스 접속 해제');
			socket.leave(roomId);
			const currentRoom = socket.adapter.rooms[roomId];
			const userCount = currentRoom ? currentRoom.length : 0;
			if(userCount===0){
				axios.delete(`http://a3a3a.run.goorm.io/room/${roomId}`)
				.then(()=>{
					console.log('방 제거 요청 성공');
				}).catch((err)=>{
					console.error(err);
				});
			}
			else{
				const chat = await new Chat({
				room : roomId,
				user : 'system',
				chat : `${req.session.color}님이 퇴장하셨습니다. ${new Date(Date.now()).toUTCString()}`,
				}).save();
				socket.to(roomId).emit('exit', chat);
			}
			}
		);
	});
};