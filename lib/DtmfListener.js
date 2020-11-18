const dgram = require('dgram');
const {EventEmitter} = require('events');

module.exports = class DtmfListener extends EventEmitter {
	constructor(options) {
		super();
		this.port = parseInt(options.dtmfPort);
		this.host = options.dtmfHost || '127.0.0.1';

		this.socket = dgram.createSocket('udp4');
		this.socket.on('error', (err) => {
			this.socket.close();
			throw new Error(`Failed to bind on ${this.host}:${this.port} with error ${err}`);
		});

		this.socket.on('message', (msg, rinfo) => {
			this.emit('dtmf', JSON.parse(msg.toString()), rinfo);
		});

		this.socket.on('listening', () => {
			this.emit('listening', this.socket.address());
		});

		this.socket.bind(this.port, this.host);
	}

	destroy() {
		this.socket.close();
	}
}
