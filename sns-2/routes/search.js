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

router.get('/', async (req,res,next) => {
	try {
		const query = req.query.search;
		let t = [];
		if(!query){
			return res.redirect('/');
		} // if not exist query

		const tag = await Hashtag.find({title : query}).exec(); // PostHashtag에서 검색
		const users = await User.find({nick : query}).exec(); // Post의 writer_id가 users
		if(tag.length){
			console.log("EXISTS TAG");
			const posthashtags = await PostHashtag.find({hashtag_id : tag[0]._id});
			const results = await Promise.all(posthashtags.map(async (pt) => {
				const result = await Post.find({_id : pt.post_id}).populate('writer_id');
				t.push(result);
			}));
		}
		
		if(users.length){
			console.log("EXISTS USERS");
			const results = await Promise.all(users.map(async (user) => {
				console.log(user.nick);
				const result = await Post.find({writer_id : user._id}).populate('writer_id');
				t.push(result);
			}));
		}
		var twits = [];
		// t 는 array elements가 array > 풀어줘야함
		t.map((result)=>{
			for(var i=0; i<result.length; i++){
				twits.push(result[i]);
			}
		});
		
		res.render('search', {
			title : `${query} | Search`,
			user : req.user,
			twits : twits,
		});

	} catch(err) {
		console.error(err);
		next(err);
	}
});


module.exports = router;