const express = require('express');
const logger = require('../logger');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const schedule = require('node-schedule');

const { Good, Auction, User, sequelize } = require('../models');
const {isLoggedIn, isNotLoggedIn } = require('./middlewares');

router.get('/', async (req,res,next)=>{
	if(req.isAuthenticated()){
		res.locals.user = req.user; // local에 user 저장
		const goods = await Good.findAll({where: {soldId: null}});
		res.render('main', {
			title : 'AUCTION',
			goods,
		});
	}
	else{ // not authenticated
		res.render('login', {
			title : 'AUCTION',
			loginError: req.flash('loginError'),
		});
	}
});
router.get('/list', isLoggedIn, async (req,res,next) => {
	try {
		const goods = await Good.findAll({
			where: { soldId: req.user.id },
			include: { model: Auction },
			order: [[{model: Auction}, 'bid', 'DESC']],
		});
		
		res.render('list', {
			title: '낙찰 목록',
			goods,
			user: req.user,
		});
	} catch(err) {
		logger.error(err);
	}
});
router.get('/join', isNotLoggedIn, (req,res)=>{
	res.render('join', {
		title : 'SIGN UP',
	});
});

router.get('/good', isLoggedIn, (req,res) => {
	res.render('good', {
		title : '상품 등록'
	});
});
const upload = multer({
	storage: multer.diskStorage({
		destination(req,file,cb){
			cb(null, 'uploads/');
		},
		filename(req,file,cb){
			const ext = path.extname(file.originalname);
			cb(null, path.basename(file.originalname,ext) + Date.now() + ext);
		},
	}),
	limits: {fileSize: 5*1024*1024},
});

router.post('/good', isLoggedIn, upload.single('img'), async (req,res,next) => {
	try {
		const { name, price } = req.body;
		const good = await Good.create({
			ownerId: req.user.id,
			name,
			img: req.file ? req.file.filename : 'noimage.png', // img 업로드 안할시 기본 img
			price,
		});
		
		const end = new Date(); //end에 하루 뒤 시간 저장
		end.setDate(end.getDate() + 1);
		schedule.scheduleJob(end, async () => {
			const success = await Auction.findOne({ where : {goodId: good.id}, order: [['bid', 'DESC']],});
			await Good.update({soldId: success.userId}, { where: { id: good.id}});
			await User.update({money: sequelize.literal(`money - ${success.bid}`),}, {where: {id: success.userId},});
		}); // end에 함수 예약, 서버 종료시 예약도 종료

		res.redirect('/');
		
	} catch(err) {
		logger.error(err);
		next(err);
	}
});

router.get('/good/:id', isLoggedIn, async (req,res,next) => {
	try {
		 const [good, auction] = await Promise.all(
		 [Good.findOne({where : { id: req.params.id}, include : {model : User, as : 'owner'}}),
		Auction.findAll({where : {goodId: req.params.id}, include: {model: User}, order: [['bid', 'ASC']],}),	
		 ]
		 );
		
		res.render('auction', {
			title : `${good.name} AUCTION`,
			good,
			auction,
			auctionError : req.flash('auctionError'),
		});
	} catch(err) {
		logger.error(err);
		next(err);
	}
});

router.post('/good/:id/bid', isLoggedIn, async (req,res,next) => {
	try {
		const {bid,msg} = req.body;
		const good = await Good.findOne({where : {id:req.params.id}, include: {model: Auction}, order : [[{model:Auction},'bid','DESC']],});
		
		if(good.price>bid){
			return res.status(403).send('시작가격보다 높게 입찰해야 합니다.');
		}
		//시간chk
		if(new Date(good.createdAt).valueOf() + (24*60*60*1000) < new Date()) {
			return res.status(403).send('경매가 종료되었습니다.');
		}
		//이전 경매가인 good.auctions[0] chk
		if(good.auctions[0] && good.auctions[0].bid >= bid) {
			return res.status(403).send('이전 경매가보다 높아야 합니다.');
		}
		
		const result = await Auction.create({
			bid,
			msg,
			userId : req.user.id,
			goodId : req.params.id,
		});
		
		req.app.get('io').to(req.params.id).emit('bid', {
			bid,
			msg,
			nick: req.user.nick,
		});
		return res.send('ok');
	} catch(err) {
		logger.error(err);
		next(err);
	}
});
module.exports = router;