const mongoose = require('mongoose');

const {Schema} = mongoose;
const {Types : {ObjectId}} = Schema;
const postSchema = new Schema({
	writer_id : {
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
		required : false,
	},
	
},{
	timestamps : true
});

module.exports = mongoose.model('Post', postSchema);