const mongoose = require('mongoose');

const {Schema} = mongoose;
const {Types : {ObjectId}} = Schema;

const domainSchema = new Schema({
	user : {
		type : ObjectId,
		required : true,
		ref : 'User',
	},
	host : {
		type : String,
		required : true,
	},
	domain_type : {
		type : String,
		required : true,
	},
	clientSecret : {
		type : String,
		required : true,
	},
}, {timestamps : true});

module.exports = mongoose.model('Domain', domainSchema);