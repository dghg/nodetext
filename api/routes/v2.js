const express = require('express');
const jwt = require('jsonwebtoken');

const { verifyToken, apiLimiter } = require('./middlewares');
const Domain = require('../models/domain');
const Post = require('../models/post');
const router = express.Router();
const Hashtag = require('../models/hashtag');
const cors = require('cors');
router.use(async (req,res,next)=> {
	try {
		const domain = await Domain.findOne({host : url.parse(req.get('origin')).host});
		
		if(domain){
			cors({origin : req.get('origin')})(req,res,next);
		}
		else{
			next();
		}
	} catch(err) {
		
	}
});

router.post('/token', apiLimiter, async (req,res) => { // token 발급
	const { clientSecret } = req.body;
	try {
		const domain = await Domain.findOne({clientSecret}).populate('user');
		if(!domain){
			return res.status(401).json({
				code : 401,
				message : '등록되지 않은 도메인',
			})
		}
		
		const token = jwt.sign({
			id : domain.user._id,
			nick : domain.user.nick,
		}, process.env.JWT_SECRET, {
			expiresIn : '30m',
			issuer : 'dd',
		});
		
		return res.json({
			code : 200,
			message : '토큰이 발급',
			token,
		})
	} catch(err){
		return res.status(500).json({
			code : 500,
			message: 'Server Error',
		})
	}
});

router.get('/test', verifyToken, apiLimiter, (req,res)=>{
	res.json(req.decoded);
});

router.get('/posts/my', apiLimiter, verifyToken, (req,res)=>{
	Post.find({writer_id : req.decoded.id})
	.then((posts)=>{
		res.json({
			code:200,
			payload:posts,
		});
	})
	.catch((err)=>{
		return res.status(500).json({
			code : 500,
			message : 'server error',
		})
	})
});

module.exports = router;