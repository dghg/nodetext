const mongoose = require('mongoose');

const {Schema} = mongoose;

const tagSchema = new Schema({
	title : {
		type : String,
		required : true,
		unique : true,
	},
},{
	timestamps : true
});

module.exports = mongoose.model('Hashtag', tagSchema);