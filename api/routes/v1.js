const express = require('express');
const jwt = require('jsonwebtoken');

const { verifyToken, deprecated } = require('./middlewares');
const Domain = require('../models/domain');
const Post = require('../models/post');
const router = express.Router();
const Hashtag = require('../models/hashtag');

router.use(deprecated);
router.post('/token', async (req,res)=> {
	const { clientSecret } = req.body;
	try {
		const domain = await Domain.findOne({clientSecret}).populate('user');
		console.log(domain);
		
		if(!domain){
			return res.status(401).json({
				code : 401,
				message : '등록되지 않은 도메인입니다.',
			});	
		}
		
		const token = jwt.sign({
			id : domain.user._id,
			nick : domain.user.nick,
		}, process.env.JWT_SECRET, {
			expiresIn : '1m',
			issuer : 'ad',
		});
		
		return res.json({
			code : 200,
			message : '토큰이 발급되었습니다.',
			token,
		});
	} catch(err) {
		console.error(err);
		return res.status(500).json({
			code : 500,
			message : 'ERror',
		});
	}
});

router.get('/test', verifyToken, (req,res)=> { // verifytoken에서 decoded 넘겨줌.
	res.json(req.decoded);
});
router.get('/posts/my', verifyToken, async (req,res) => {
		Post.find({writer_id : req.decoded.id})
		.then((posts)=> {
			res.json({
				code:200,
				payload:posts,
			})
		}).catch((err)=>{
			console.error(err);
		return res.status(500).json({
			code : 500,
			message : 'Server error',
		});
		});
});

module.exports = router;