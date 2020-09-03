const mongoose = require('mongoose');

const { Schema} = mongoose;
const {Types : {ObjectId}} = Schema;
const chatSchema = new Schema({
	room : {
		type : ObjectId,
		required:true,
		ref : 'Room',
	},
	user : {
		type : String,
		required : true,
	},
	chat : String,
	gif : String,
}, {timestamps : true});

module.exports = mongoose.model('Chat', chatSchema);