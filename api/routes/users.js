var express = require('express');
var router = express.Router();
const User = require('../models/user');
const {isLoggedIn} = require('./middlewares');
/* GET users listing. */
router.post('/:id/follow', isLoggedIn, async(req,res,next)=> {
	try {
		const follower = await User.findOne({_id : req.user.id});
		const following = await User.findOne({_id : req.params.id});
		if(follower.followings.indexOf(req.params.id)!==-1){ // 이미 following 관계 존재
		  return res.send('fail'); 
		 }
		await follower.addFollowing(req.params.id);
		await following.addFollower(req.user.id);
		res.send('success');
	} catch(err) {
		console.error(err);
		next(err);
	}	
});
router.delete('/:id/defollow',isLoggedIn, async(req,res,next)=>{
	
});

module.exports = router;
