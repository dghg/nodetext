const express = require('express');

const router = express.Router();
const { isLoggedIn, isNotLoggedIn } = require('./middlewares');
const Post = require('../models/post');
const User = require('../models/user');
const Follow = require('../models/follow');

router.get('/', (req,res,next)=>{
	Post.find({}).populate('writer_id')
	.then((posts)=>{
		res.render('main', {
			title : 'Nodebird',
			twits : posts,
			user : req.user,
			loginError : req.flash('loginError'),
		})		
	})
	.catch((err)=>{
		console.error(err);
		next(err);
	});
});


router.get('/profile', isLoggedIn, (req,res)=>{
	const follower = Follow.find({})
	res.render('profile', { title : '정보', user : req.user });
}); // isLoggedIn이 next 호출시 req.user가 존재함. deserialize 호출 

router.get('/join', isNotLoggedIn, (req,res)=>{
	res.render('join', {
		title : 'Sign up',
		user : req.user,
		joinError : req.flash('joinError')
	});
});



module.exports = router;