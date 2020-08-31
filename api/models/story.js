const mongoose = require('mongoose');

const {Schema} = mongoose;
const {Types : {ObjectId}} = Schema;
const storySchema = new Schema({
	user_id : {
		type : ObjectId,
		required : true,
		ref : 'User',
	},
	img : {
		type : String,
	},
},{timestamps: true}
 );

module.exports = mongoose.model('Story', storySchema);