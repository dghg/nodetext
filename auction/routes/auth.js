const express = require('express');
const passport = require('passport');
const bcrypt = require('bcrypt');
const { User } = require('../models');
const { isLoggedIn, isNotLoggedIn } = require('./middlewares');
const router = express.Router();

router.post('/join', isNotLoggedIn, async (req,res,next) => {
	const { email, nick, money, password } = req.body;
	try {
		const exUser = await User.findOne({where : {email}});
		if(exUser){
			req.flash('joinError', '이미 가입된 이메일입니다.');
			return res.redirect('/join');
		}
		const hash = await bcrypt.hash(password, 12);
		await User.create({
			email,
			nick,
			password: hash,
			money,
		});
		return res.redirect('/');
	} catch(err) {
		console.log(err);
		next(err);
	}
}); // 가입 후 로그인까지

router.post('/login', isNotLoggedIn, (req,res,next) => {
	passport.authenticate('local', (authError, user, info) => {
		if(authError){
			console.error(authError);
			return next(authError);
		}
		
		if(!user){
			req.flash('loginError', info.message);
			return res.redirect('/');
		}
		
		return req.login(user, (err) => {
			if(err){
				console.error(err);
				next(err);
			}
			
			return res.redirect('/');
		});
	})(req,res,next);
});

router.get('/logout', isLoggedIn, (req,res) => {
	res.logout();
	req.session.destroy();
	res.redirect('/');
});

module.exports = router;