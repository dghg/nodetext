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
	
},{
	timestamps : true
});

module.exports = mongoose.model('User', userSchema);