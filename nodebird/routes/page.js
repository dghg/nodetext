const express = require('express');

const router = express.Router();
const { isLoggedIn, isNotLoggedIn } = require('./middlewares');

router.get('/',(req,res)=>{
	res.render('main', {
		title : 'Nodebird',
		twits : [],
		user : null,
		loginError : req.flash('loginError')
	});
});


router.get('/profile', isLoggedIn, (req,res)=>{
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