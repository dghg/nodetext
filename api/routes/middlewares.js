const jwt = require('jsonwebtoken');
const RateLimit = require('express-rate-limit');

exports.isLoggedIn = (req,res,next) => {
	if(req.isAuthenticated()){
		next();
	}	
	else{
		res.status(403).send('로그인 필요');
	}
};

exports.isNotLoggedIn = (req,res,next) => {
	if(!req.isAuthenticated()){
		next();
	}
	else{
		res.redirect('/');
	}
}

exports.verifyToken = (req,res,next) => {
	try {
		req.decoded = jwt.verify(req.headers.authorization, process.env.JWT_SECRET); // 인증성공시 다음미들웨어에서 사용할수있도록
		return next();
	} catch(err) {
		if(err.name === 'TokenExpiredError') {
			return res.status(419).json({
				code : 419,
				message : 'Expired TOKEN',
			});
		}
		
		return res.status(401).json({
			code : 401,
			message : 'Cant Verifying.',
		});
	}
};

exports.apiLimiter = new RateLimit({
	windowMs : 60 * 1000,
	max : 1,
	delayMs : 0,
	handler(req,res){
		res.status(this.statusCode).json({
			code : this.statusCode,
			message : '1분에 한번만 요청할 수 있습니다.',
		});
	},
});

exports.deprecated = (req,res) => {
	res.status(410).json({
		code : 410,
		message : 'deprecated version',
	});
};