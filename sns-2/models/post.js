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
	},
	like : [{type : ObjectId, ref : 'User'}],
},{
	timestamps : true
});

postSchema.methods.clickLike = async function (id) {
	try {
	const removed = this.like.indexOf(id);
	if(removed!==-1){ //좋아요 취소
	   console.log("REMOVED");
	   this.like.splice(removed, 1);
	   return await this.save();
	}
	else{
		console.log("PUSH");
		this.like.push(id);
		return await this.save();
	}
	} catch(err) {
		console.error(err);
	}
} 

module.exports = mongoose.model('Post', postSchema);