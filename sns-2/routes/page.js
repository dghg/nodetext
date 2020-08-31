const express = require('express');
const { isLoggedIn, isNotLoggedIn } = require('./middlewares');

const router = express.Router();
const Post = require('../models/post');
const User = require('../models/user');
router.get('/', (req,res,next)=> {
	console.log(req.isAuthenticated());
	if(req.isAuthenticated()){
		Post.find({}).populate('writer_id')
		.then((result)=>{
			res.render('main', {
				title : 'MAIN',
				twits : result,
				user : req.user,
				loginError : req.flash('loginError'),
			});
		}).catch((err)=>{
			console.error(err);
			next(err);
		})
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


module.exports = router;