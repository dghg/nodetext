const LocalStrategy = require('passport-local').Strategy;
const bcrypt = require('bcrypt');
const User = require('../models/user');

module.exports = (passport) => {
	passport.use(new LocalStrategy({
		usernameField : 'email',
		passwordField : 'password',
	}, async (email, password, done) =>{
		try {
			const ex = await User.findOne({email});
			if(ex){
				const result = await bcrypt.compare(password, ex.password);
				if(result){
					done(null, ex);
				}
				else{
					done(null, false, { message : '비밀번호가 일치하지 않습니다.'});	
				}
			}
			else{
				done(null, false, { message : '가입되지 않은 이메일입니다.'});
			}
		} catch (error) {
			console.error(error);
			done(error);
		}
	}));
};