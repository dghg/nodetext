const SSE = require('sse');

module.exports = (server) => {
	const sse = new SSE(server);
	sse.on('connection', (client) => {
		console.log("SSE CONNECTION");
		setInterval(() => {
			client.send(Date.now().toString());
		}, 1000);
	});
};

// sse 객체 생성 후 1초마다 client에게 date.now() 전송