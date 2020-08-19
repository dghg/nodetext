const KakaoStrategy = require('passport-kakao').Strategy;
const User = require('../models/user');

module.exports = (passport) => {
	passport.use(new KakaoStrategy({
		clientID : process.env.KAKAO_ID,
		callbackURL : '/auth/kakao/callback',
	}, async (accessToken, refreshToken, profile, done) => {
		try {
			const ex = await User.find({snsId : profile.id, provider : 'kakao'});
			if(ex) {
				done(null, ex);
			} else {
				console.log(profile);
				const newUser = await new User({
				email : profile._json && profile._json.kaccount_email,
				nick : profile.displayName,
				snsId : profile.id,
				provider : 'kakao',
				});
				
				newUser.save();
				
				done(null, newUser);
			}
		} catch(err) {
			console.error(err);
			done(err);
		}
	}));	
};