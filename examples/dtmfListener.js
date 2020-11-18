const Client = require("../lib/Client");

(async function () {
	const rtpengine = new Client({host: '127.0.0.1', port: 2223, dtmfHost: '0.0.0.0', dtmfPort: 7901});


rtpengine.on('dtmf', (event, rinfo) => {
	console.log(event);
	console.log(rinfo);
});

rtpengine.on('dtmfListening', (address) => {
	console.log(`Listening for DTMF events on ${address.address}:${address.port}`);
});

const res = await rtpengine.ping();
console.log(res);
})()
