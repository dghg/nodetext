const local = require('./localStrategy');
const kakao = require('./kakaoStrategy');
const User = require('../models/user');

module.exports = (passport) =>{
	passport.serializeUser((user, done)=> {
		console.log('serializeUser()');
		done(null, user.id);
	});
	
	passport.deserializeUser((id, done)=> {
		console.log('deserializeUser()');
		User.findOne({_id:id})
		.then(user => done(null,user))
		.catch((err)=>{
			done(err);
		});
	});
	
	local(passport);
	kakao(passport);
};

/*
	console.log 추가. 언제 실행되는지 ? 
*/