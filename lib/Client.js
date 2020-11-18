"use strict";

const dgram = require('dgram');
const {promisify} = require('util')
const {EventEmitter} = require('events');

const Command = require('./Command');
const WaitManager = require('./WaitManager');
const DtmfListener = require('./DtmfListener')

const DEFAULT_HOST = "127.0.0.1";
const DEFAULT_PORT = 2223;
const DEFAULT_REQUEST_TIMEOUT = 500;

const DEFAULT_OPTIONS = {
	host: DEFAULT_HOST,
	port: DEFAULT_PORT,
	timeout: DEFAULT_REQUEST_TIMEOUT
}

class Client extends EventEmitter {
	constructor(options) {
		super();

		this.options = Object.assign(DEFAULT_OPTIONS, options);
		this.socket = dgram.createSocket("udp4");

		promisify(this.socket.send);

		this.manager = new WaitManager(this.socket, this.options);

		for (const command of ["ping", "offer", "answer", "delete", "list", "query", "startRecording"]) {
			try {
				this[command] = async options => {
					return await this.sendCommand(command, options);
				}
			} catch (e) {
				console.error(e);
			}
		}

		if (this.options.dtmfHost) {
			this.dtmfListener  = new DtmfListener(this.options);
			this.dtmfListener.on('dtmf', (event, rinfo) =>
				this.emit('dtmf', event, rinfo));
			this.dtmfListener.on('listening', address =>
				this.emit('dtmfListening', address));
		}
	}

	async sendCommand(commandName, options) {
		try {
			const command = new Command(commandName, options);
			await this.socket.send(command.getBencodedMessage(), this.options.port, this.options.host);
			return this.manager.wait(command.cookie)
		} catch (error) {
			throw new Error(`Failed to send message: ${error}`);
		}
	}

	destroy() {
		this.socket.close();
		if (this.dtmfListener) this.dtmfListener.destroy();
	}
}

module.exports = Client;
