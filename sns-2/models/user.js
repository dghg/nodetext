const mongoose = require('mongoose');

const {Schema} = mongoose;
const {Types : {ObjectId}} = Schema;
const follow = {type : ObjectId, required : true, ref : 'User'};

const userSchema = new Schema({
	email : {
		type : String,
		required : false,
	},
	nick : {
		type : String,
		required : true,
	},
	password :{
		type : String,
		required : false,
	},
	provider : {
		type : String,
		required : true,
		default : 'local',
	},
	snsId : {
		type : String,
		required : false,
	},
	followings : [follow],
	followers : [follow],
},{
	timestamps : true
});

userSchema.methods.addFollowing = async function (following) {
	try {
		console.log(this);
		await this.followings.push(following);
		return this.save();
	} catch(err) {
		console.error(err);
	}
}

userSchema.methods.addFollower = async function (follower) {
	await this.followers.push(follower);
	return this.save();
}
module.exports = mongoose.model('User', userSchema);