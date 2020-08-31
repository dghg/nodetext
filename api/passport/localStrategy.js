const LocalStrategy = require('passport-local').Strategy;
const bcrypt = require('bcrypt');

const User = require('../models/user');
const message = { message : '이메일 또는 비밀번호 틀림.',};
module.exports = (passport) => {
	passport.use(new LocalStrategy({
		usernameField : 'email',
		passwordField : 'password',
	}, async (email, password, done) => {
		try {
			const ex = await User.findOne({email});
			if(ex) {
				const result = await bcrypt.compare(password, ex.password);
				if(result){
					done(null, ex); // success
				}
				else{
					done(null, false, message);
				}
			}
			else {
				done(null, false, message);
			}
		} catch(err) {
			console.error(err);
			done(err);
		}
	}));
};
	