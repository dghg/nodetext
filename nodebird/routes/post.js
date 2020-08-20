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
		var hashtag_id;
		var post = new Post({
			writer_id : req.user.id,
			content : req.body.content,
			img : req.body.url,
			}).save();
	try {
		const hashtags = req.body.content.match(/#[^/s#]*/g);
		if(hashtags){
			console.log(hashtags);
			const results = await hashtags.map((tag)=>{
				const filter = {title : tag.slice(1).toLowerCase(),};
				const tmp = Hashtag.findOneAndUpdate(filter,filter,{new : true, upsert : true});
				tmp.then((result)=>{
					post.then((result_post)=>{
						new PostHashtag({
							postid : result_post._id,
							hashtagid : result._id,
						}).save();
					}).catch((err)=>{next(err);});
				}).catch((err)=>{next(err);});
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
		const hashtag = Hashtag.findOne({title : query});
		let posts = [];
		if(hashtag){
			hashtag.then((hashtags)=>{
				return PostHashtag.find({hashtagid : hashtags._id});
			}).then((posthashtags)=>{
				console.log(posthashtags);
				let pid = [];
				for(ph in posthashtags){
					pid.push(posthashtags[ph].postid);
				}
				return Post.find({_id : { $in : pid}}); 
			}).then((posts)=>{
				return res.render('main', {
					title : `${query} | Nodebird`,
					user : req.user,
					twits : posts,
				})
			})
			.catch((err)=>{
				console.error(err);
				next(err);
			});
		}
		
	} catch(err){
		console.error(err);
		return next(err);
	}
});

module.exports = router;
