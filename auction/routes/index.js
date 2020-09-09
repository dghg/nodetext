const express = require('express');
const logger = require('../logger');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const fs = require('fs');

const { Good, Auction, User } = require('../models');
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
		await Good.create({
			ownerId: req.user.id,
			name,
			img: req.file ? req.file.filename : 'noimage.png',
			price,
		});
		
		res.redirect('/');
		
	} catch(err) {
		logger.error(err);
		next(err);
	}
});
module.exports = router;