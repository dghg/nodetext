const mongoose = require('mongoose');

module.exports = () => {
	const connect = () => {
		if(process.env.NODE_ENV !== 'production'){
			mongoose.set('debug', true);
		}
		
		mongoose.connect('mongodb://root:root@localhost:27017/admin', {
			dbName : 'chat',
		}, (err)=>{
			if(err){
				console.log('db connection err', err);
			}
			else{
				console.log('db connection success.');
			}
		});
	};
	
	connect();
	mongoose.connection.on('error', (error)=>{
		console.error('connection err.', error);
	});
	
	mongoose.connection.on('disconnected', ()=>{
		console.log('retry connect. ');
		connect();
	});
	
	require('./room');
	require('./chat');
};