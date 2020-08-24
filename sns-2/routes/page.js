const express = require('express');
const { isLoggedIn, isNotLoggedIn } = require('./middlewares');

const router = express.Router();

router.get('/', (req,res,next)=> {
	
});

router.get('/profile',isLoggedIn, (req,res) => {
	
});

router.get('/join', isNotLoggedIn, (req,res) => {
	
});

module.exports = router;