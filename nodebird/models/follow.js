const mongoose = require('mongoose');

const {Schema} = mongoose;
const {Types : {ObjectId}} = Schema;
const followSchema = new Schema({
	follower_id : {
		type : ObjectId,
		required : true,
		ref : 'User',
	},
	
	following_id : {
		type : ObjectId,
		required : true,
		ref : 'User',
	},
},{
	timestamps : true
});

module.exports = mongoose.model('Follow', followSchema);

/*
 User 간 N:M 관계 following 담는 model 
*/