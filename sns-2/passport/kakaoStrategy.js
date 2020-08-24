const KakaoStrategy = require('passport-kakao').Strategy;

const User = require('../models/user');

module.exports = (passport) => {
	passport.use(new KakaoStrategy({
		clientID : process.env.KAKAO_ID,
		callbackURL : '/auth/kakao/callback',
	}, async (accessToken, refreshToken, profile, done) => {
		try {
			const ex = User.findOne({snsId : profile.id});
			if(ex){
				done(null, ex);
			}
			else {
				const newUser = new User({
					email : profile._json && profile._json.kaccount_email,
					nick : profile.displayName,
					snsId : profile.id,
					provider : 'kakao',
				}).save();
				done(null, newUser);
			}
		} catch(err) {
			console.error(err);
			done(err);
		}
	}));	
};