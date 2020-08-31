/*
	회원가입 로그인(로그아웃) ROUTER
*/

const express = require('express');
const { isLoggedIn, isNotLoggedIn } = require('./middlewares');
const passport = require('passport');
const bcrypt = require('bcrypt');
const User = require('../models/user');

const router = express.Router();

router.post('/join', isNotLoggedIn, async (req,res,next) => {
	const { email, nick, password } = req.body;
	try {
		const ex = await User.findOne({email});
		if(ex) {
			req.flash('joinError', '이미 가입된 이메일입니다.');
			return res.redirect('/join');
		}
		const p = await bcrypt.hash(password, 12);
		await new User({
			email,
			nick,
			password : p,
		}).save();
		
		return res.redirect('/');
	} catch(err) {
		console.error(err);
		next(err);
	}
});

router.post('/login', isNotLoggedIn, (req,res,next) => {
	passport.authenticate('local', (authError,user,info)=>{
		if(authError){
			console.error(authError);
			return next(authError);
		}
		
		if(!user){
			req.flash('loginError', info.message);
			return res.redirect('/');
		}
		
		return req.login(user, (loginError)=>{
			if(loginError){
				console.error(loginError);
				return next(loginError);
			}
			return res.redirect('/');
		});
	})(req,res,next);
});

router.get('/logout', isLoggedIn, (req,res,next)=> {
	req.logout();
	req.session.destroy();
	res.redirect('/');
});
router.get('/kakao', passport.authenticate('kakao')); // kakaostrategy가 로그인수행
router.get('/kakao/callback' , passport.authenticate('kakao', {
	failureRedirect : '/',
}), (req,res) => {
	res.redirect('/');
});

module.exports = router;