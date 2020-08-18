exports.isLoggedIn = (req,res,next) =>{
	if(req.isAuthenticated()){
		next();
	} // passport가 request에 isauthenticated ==true 로그인할 때 >> 로그인여부 검사 !
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
};