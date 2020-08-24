const express = require('express');

const router = express.Router();
const { isLoggedIn, isNotLoggedIn } = require('./middlewares');
const Post = require('../models/post');
const User = require('../models/user');
const Follow = require('../models/follow');


router.get('/', (req,res,next)=>{
	if(req.isAuthenticated()){
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

	}
	else{
		res.render('layout', {
			title : 'Login Page',
			user : req.user,
			loginError : req.flash('loginError'),
		})
	}
});


router.get('/profile', isLoggedIn, (req,res)=>{
	Follow.find({follower_id :req.user.id}).populate('following_id')
		.then((results)=>{
		console.log(results);
		res.render('profile', { 
			title : 'Profile',
			followings : results,
		});
	}).catch((err)=>{
		console.error(err);
		next(err);
	})
}); // isLoggedIn이 next 호출시 req.user가 존재함. deserialize 호출 

router.get('/join', isNotLoggedIn, (req,res)=>{
	res.render('join', {
		title : 'Sign up',
		user : req.user,
		joinError : req.flash('joinError')
	});
});



module.exports = router;