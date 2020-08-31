/*
	Post와 Hashtag 관계 Model
	*/

const mongoose = require('mongoose');

const {Schema} = mongoose;
const {Types : {ObjectId}} = Schema;


const posthashtagSchema = new Schema({
	hashtag_id : {
		type : ObjectId,
		required : true,
		ref : 'Hashtag',
	},
	post_id : {
		type : ObjectId,
		required : true,
		ref : 'Post',
	},
},{
	timestamps : true
});

module.exports = mongoose.model('Posthashtag', posthashtagSchema);