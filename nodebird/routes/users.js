var express = require('express');
var router = express.Router();
var { isLoggedIn} = require('./middlewares');
const User = require('../models/user');
const Follow = require('../models/follow');
/* GET users listing. */


router.post('/:id/follow', isLoggedIn, async (req,res,next) =>{
	try {
		User.findOne({_id : req.user.id}).
		then((user)=>{
			new Follow({
				follower_id : req.user.id,
				following_id : req.params.id,
			}).save();
		}).catch((err)=>{
			console.error(err);
			next(err);
		})
	} catch(err) {
		console.error(err);
		next(err);
	}
});
module.exports = router;
