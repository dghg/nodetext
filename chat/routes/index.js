var express = require('express');
var router = express.Router();
const Room = require('../models/room');
const Chat = require('../models/chat');
const multer = require('multer');
const path = require('path');
const fs = require('fs');


router.get('/', async (req,res,next)=>{
	try{
		const rooms = await Room.find({});
		res.render('main', {
			rooms,
			title : '채팅방',
			error : req.flash('roomError'),
		});
	} catch(err){
		console.error(err);
		next(err);
	}
});

router.get('/room', (req,res)=>{
	res.render('room', {title : '채팅방 생성'});
});

router.post('/room', async (req,res,next)=>{
	try{
		const room = await new Room({
			title : req.body.title,
			max : req.body.max,
			owner : req.session.color,
			password : req.body.password,
		}).save();
		
		const io = req.app.get('io');
		io.of('/room').emit('newRoom', room);
		res.redirect(`/room/${room._id}?password=${req.body.password}`);
	} catch(err){
		console.error(err);
		next(err);
	}
});

router.get('/room/:id', async(req,res,next)=>{
	try {
		const room = await Room.findOne({_id:req.params.id});
		const io = req.app.get('io');
		
		if(!room){
			return res.redirect('/');
		}
		
		if(room.password && room.password!==req.query.password){
			return res.redirect('/');
		}
		
		const {rooms} = io.of('/chat').adapter;
		if(rooms && rooms[req.params.id] && room.max<=rooms[req.params.id].length){
			return res.redirect('/');
		}
		
		const chats = await Chat.find({room : room._id}).sort('createdAt');
		
		return res.render('chat', {
			room,
			title : room.title,
			chats,
			user : req.session.color,
		});
	} catch(err){
		console.error(err);
		next(err);
	}
});
router.post('/room/:id/chat', async (req,res,next)=>{
	try {
		const chat = await new Chat({
			room : req.params.id,
			user : req.session.color,
			chat : req.body.chat,
		}).save();
		
		const io = req.app.get('io'); // get io instance
		const namesp = io.of('/chat'); // chat namespace
		namesp.to(req.params.id).emit('chat', chat); // req.params.id room에 chat event 전송
		
		res.send('ok');
		
	} catch(err) {
		console.error(err);
		next(err);
	}
});
fs.readdir('uploads', (err)=>{
	if(err){
		fs.mkdirSync('uploads');
	}
});

const upload = multer({
	storage : multer.diskStorage({
		destination(req,file,cb) {
			cb(null, 'uploads/');
		},
		filename(req,file,cb){
			const ext = path.extname(file.originalname);
			cb(null, path.basename(file.originalname, ext) + Date.now() + ext);
		},
	}),
	limits : { fileSize : 5 * 1024 * 1024},
});

router.post('/room/:id/gif', upload.single('gif'), async (req,res,next)=>{
	try {
		const chat = await new Chat({
			room : req.params.id,
			user : req.session.color,
			gif : req.file.filename,
		}).save();
		
		const io = req.app.get('io'); // get io instance
		const namesp = io.of('/chat'); // chat namespace
		namesp.to(req.params.id).emit('chat', chat); // req.params.id room에 chat event 전송
		
		res.send('ok');

	} catch(err) {
		console.error(err);
		next(err);
	}
});
router.delete('/room/:id', async (req,res,next)=>{
	try{
		await Room.deleteOne({_id : req.params.id});
		await Chat.deleteOne({room : req.params.id});
		setTimeout(()=>{
			req.app.get('io').of('/room').emit('removeRoom', req.params.id);
		}, 2000);
	} catch(err){
		console.error(err);
		next(err);
	}
});
module.exports = router;
