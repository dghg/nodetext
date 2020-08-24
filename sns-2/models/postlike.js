/*
	Like와 Post의 관계 MODEL
	*/

const mongoose = require('mongoose');

const {Schema} = mongoose;
const {Types : {ObjectId}} = Schema;


const postlikeSchema = new Schema({
	user_id : {
		type : ObjectId,
		required : true,
		ref : 'User',
	},
	post_id : {
		type : ObjectId,
		required : true,
		ref : 'Post',
	},
},{
	timestamps : true
});

module.exports = mongoose.model('Postlike', postlikeSchema);