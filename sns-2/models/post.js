const mongoose = require('mongoose');

const {Schema} = mongoose;
const {Types : {ObjectId}} = Schema;


const postSchema = new Schema({
	writer : {
		type : ObjectId,
		required : true,
		ref : 'User',
	},
	content : {
		type : String,
		required : true,
	},
	img : {
		type : String,
	},
	like_count : {
		type : Number,
		default : 0,
	},
},{
	timestamps : true
});

module.exports = mongoose.model('Post', postSchema);