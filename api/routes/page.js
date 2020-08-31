const express = require('express');
const { isLoggedIn, isNotLoggedIn } = require('./middlewares');

const router = express.Router();
const Post = require('../models/post');
const User = require('../models/user');
const Domain = require('../models/domain');
const { v4: uuidv4 } = require('uuid');
const URL = 'http://a3a3a.run.goorm.io/v1';

router.get('/', async (req,res,next)=> {
	if(req.isAuthenticated()){
		try {
			const user = await User.findOne({_id : req.user.id});
			const domains = await Domain.find({user : req.user.id});
			res.render('login', {
				user,
				loginError : req.flash('loginError'),
				domains,
			});
		} catch(err) {
			console.error(err);
			next(err);
		}
	}
	else{
	res.render('layout', {
		title : 'Hello !',
		twits : [],
		user : req.user,
		loginError : req.flash('loginError'),
	});		
	}
});

router.get('/profile',isLoggedIn, async (req,res,next) => {
	try {
		const followers = await Promise.all(req.user.followers.map(async (id) =>{
			return User.findOne({_id : id});
		}));
		const followings = await Promise.all(req.user.followings.map(async (id) =>{
			return User.findOne({_id : id});
		}));
		res.render('profile', {
			followers,
			followings,
		})
	} catch(err) {
		console.error(err);
		next(err);
	}
});

router.get('/join',  (req,res) => {
	res.render('join', {
		title : 'Sign up',
		user : req.user,
		joinError : req.flash('joinError'),
	});
});

router.post('/domain', async (req,res,next) => {
	try {
		const domain = await new Domain({
			user : req.user.id,
			host : req.body.host,
			domain_type : req.body.type,
			clientSecret : uuidv4(),
		}).save();
		res.redirect('/');
		
	} catch(err){
		next(err);
	}
});

module.exports = router;