/*
 Post와 Hasgtag 간 N:M 관계 following 담는 model 
*/


const mongoose = require('mongoose');

const {Schema} = mongoose;
const {Types : {ObjectId}} = Schema;
const posthastagSchema = new Schema({
	postid : {
		type : ObjectId,
		required : true,
		ref : 'Post',
	},
	hashtagid : {
		type : ObjectId,
		required : true,
		ref : 'Hashtag',
	}
},{
	timestamps : true
});

module.exports = mongoose.model('PostHashtag', posthastagSchema);
