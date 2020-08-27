const KakaoStrategy = require('passport-kakao').Strategy;

const User = require('../models/user');

module.exports = (passport) => {
	passport.use(new KakaoStrategy({
		clientID : process.env.KAKAO_ID,
		callbackURL : 'http://a3a3a.run.goorm.io/auth/kakao/callback',
	}, async (accessToken, refreshToken, profile, done) => {
		try {
			console.log(profile);
			const ex = await User.findOne({snsId : profile.id});
			if(ex){
				console.log("냥냥");
				done(null, ex);
			}
			else {
				const newUser = new User({
					email : profile._json && profile._json.kakao_account.email,
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