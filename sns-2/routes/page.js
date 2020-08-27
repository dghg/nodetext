const express = require('express');
const { isLoggedIn, isNotLoggedIn } = require('./middlewares');

const router = express.Router();
const Post = require('../models/post');

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

router.get('/profile',isLoggedIn, (req,res) => {
	res.render('profile', );
});

router.get('/join',  (req,res) => {
	res.render('join', {
		title : 'Sign up',
		user : req.user,
		joinError : req.flash('joinError'),
	});
});

module.exports = router;