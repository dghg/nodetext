const mongoose = require('mongoose');

const {Schema} = mongoose;
const {Types : {ObjectId}} = Schema;

const userSchema = new Schema({
	email : {
		type : String,
		required : false,
	},
	nick : {
		type : String,
		required : true,
	},
	password :{
		type : String,
		required : false,
	},
	provider : {
		type : String,
		required : true,
		default : 'local',
	},
	snsId : {
		type : String,
		required : false,
	},
	Follower_count : {
		type : Number,
		default : 0,
	},
	Following_count : {
		type : Number,
		default : 0,
	},
},{
	timestamps : true
});

module.exports = mongoose.model('User', userSchema);