const express = require('express');
const logger = require('../logger');
const router = express.Router();
const {isLoggedIn, isNotLoggedIn } = require('./middlewares');
router.get('/', (req,res)=>{
	if(req.isAuthenticated()){
		
	}
	else{ // not authenticated
		res.render('login', {
			title : 'AUCTION',
		})
	}
});

router.get('/join', isNotLoggedIn, (req,res)=>{
	res.render('join', {
		title : 'SIGN UP',
	});
});

module.exports = router;