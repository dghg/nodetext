const express = require('express');
const { isLoggedIn, isNotLoggedIn } = require('./middlewares');

const router = express.Router();

router.get('/', (req,res,next)=> {
	if(req.isAuthenticated()){
		console.log("ㅇㅅㅇ");
		res.render('main', {
			title : 'sns-2',
			twits : [],
			user : req.user,
			loginError : req.flash('loginError'),
		});
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
	
});

router.get('/join',  (req,res) => {
	res.render('join', {
		title : 'Sign up',
		user : req.user,
		joinError : req.flash('joinError'),
	});
});

module.exports = router;