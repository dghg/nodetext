const mongoose = require('mongoose');

const {Schema} = mongoose;
const {Types : {ObjectId}} = Schema;
const followSchema = new Schema({
	follower : {
		type : ObjectId,
		required : true,
		ref : 'User',
	},
	following : {
		type : ObjectId,
		required : true,
		ref : 'User',
	},
},{timestamps: true}
 );

module.exports = mongoose.model('Follow', followSchema);