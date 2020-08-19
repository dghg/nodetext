const express = require('express');
const multer = require('multer');
const path = require('path');
const fs = require('fs');

const Post = require('../models/post');
const Hashtag = require('../models/hashtag');
const PostHashtag = require('../models/posthashtag');

const User = require('../models/user');

const { isLoggedIn} = require('./middlewares');
const router = express.Router();

fs.readdir('uploads', (err)=>{
	if(err){
		console.error('uploads 폴더를 생성합니다.');
		fs.mkdirSync('uploads');
	}
});

const upload = multer({
	storage : multer.diskStorage({
		destination(req,file,cb){
			cb(null, 'uploads/');
		},
		filename(req,file,cb){
			const ext = path.extname(file.originalname);
			cb(null, path.basename(file.originalname, ext) + Date.now() + ext);
		},
	}),
	limits : { fileSize : 5 * 1024 * 1024},
});

router.post('/img', isLoggedIn, upload.single('img'), (req,res)=>{
	console.log(req.file);
	res.json({url : `/img/${req.file.filename}` });
});

const upload2 = multer();

router.post('/', isLoggedIn, upload2.none(), async (req,res,next)=>{
	try {
		const post = await new Post({
			writer_id : req.user.id,
			content : req.body.content,
			img : req.body.url,
		});
		post.save();
		const hashtags = req.body.content.match(/#[^/s#]*/g);
		if(hashtags){
			console.log(hashtags);
			const results = await hashtags.map((tag)=>{
				const tmp = Hashtag.find({title : tag.slice(1).toLowerCase()});
				var newtag;
				if(!tmp){
					newtag = new Hashtag({
						title : tag.slice(1).toLowerCase(),
					});
					newtag.save();
				}
				new PostHashtag({
					postid : post.id,
					hashtagid : newtag.id,
				}).save();
			});
		}
		
		res.redirect('/');
	} catch(err) {
		console.error(err);
		next(err);
	}
});

router.get('/hashtag', async (req,res,next)=>{
	const query = req.query.hashtag;
	if(!query){
		return res.redirect('/');
	}
	
	try {
		
	} catch(err){
		console.error(err);
		return next(err);
	}
});

module.exports = router;
