const express = require('express');
const multer = require('multer');
const path = require('path');
const fs = require('fs');

const Post = require('../models/post');
const Hashtag = require('../models/hashtag');
const PostHashtag = require('../models/posthashtag');
const User = require('../models/user');
const { isLoggedIn } = require('./middlewares');

const router = express.Router();

fs.readdir('uploads', (err)=> {
	if(err){
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

router.post('/', isLoggedIn, upload2.none(), async (req,res,next)=> {
	try {
		const post = await new Post({
			content : req.body.content,
			img : req.body.url,
			writer_id : req.user.id,
		}).save();
		const post_id = post._id;
		console.log(post_id);
		const hashtags = req.body.content.match(/#[^\s#]*/g);
		if(hashtags){
			try {
			const result = await Promise.race(hashtags.map(tag => {
				const filter = {title : tag.slice(1).toLowerCase(),};
				Hashtag.findOneAndUpdate(filter,filter,{new : true, upsert : true})
				.then((result) => {
					new PostHashtag({
						hashtag_id : result.id,
						post_id,
					}).save();
				}).catch((err)=>{
					console.error(err);
					next(err);
				});
			}));
			} catch(err) {
				console.error(err);
				next(err);
			}
		}
		res.redirect('/');
	} catch(err) {
		console.error(err);
		next(err);
	}
});

router.delete('/', isLoggedIn, async (req,res,next)=>{
	
});

router.post('/story', isLoggedIn, async(req,res,next)=> {
	
});

module.exports = router;