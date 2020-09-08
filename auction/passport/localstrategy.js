const LocalStrategy = require('passport-local').Strategy;
const bcrypt = require('bcrypt');
const { User } = require('../models');
const logger = require('../logger');

module.exports = (passport) => {
	passport.use(new LocalStrategy({
	  usernameField: 'email',
	  passwordField: 'password',
	}, async (email, password, done) => {
		try {
			const exUser = await User.findOne({where: {email}});
			// find exists user
			if(exUser){
				const result = await bcrypt.compare(password, exUser.password);
				if(result){
					done(null, exUser);
				} // correct email&password
				else{
					done(null, false, {message : '비밀번호가 일치하지 않습니다'});
				}
			}
			else{
				done(null, false, {message : '가입되지 않은 회원입니다.'});
			} // if db cant find user
		} catch(err) {
			logger.info(err);
			done(err);
		}
	}))
};
