const mongoose = require('mongoose');

const {Schema} = mongoose;
const {Types : {ObjectId}} = Schema;
module.exports = new Schema({
	follow : {
		type : ObjectId,
		required : true,
		ref : 'User',
	}
});