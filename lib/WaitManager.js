"use strict";

const Bencode = require("bencode");
const InvalidReplyError = require("./errors/InvalidReplyError");
const RequestTimeoutError = require("./errors/RequestTimeoutError");

class WaitManager {
	constructor(socket, options) {
		this.options = options;
		this.waits = new Map();
		socket.on("message", this.checkWaits.bind(this));
	}

	checkWaits(buffer, rinfo) {
		const message = buffer.toString();
		const [cookie, payload] = message.split(' ');

		if (!this.waits.has(cookie)) return;

		const wait = this.waits.get(cookie);

		if (cookie && payload) {
			try {
				wait.resolve(Bencode.decode(payload, 'utf8'));
			} catch (error) {
				wait.reject(new InvalidReplyError(cookie, rinfo.host, rinfo.port));
			}
		}
	}

	wait(cookie) {
		let timeoutId;
		return Promise.race([
			new Promise((resolve, reject) => {
				this.waits.set(cookie, {
					resolve,
					reject,
					cookie
				});
			}),
			new Promise((resolve, reject) => {
				timeoutId = setTimeout(() => {
					reject(new RequestTimeoutError(cookie, this.options.timeout))
				}, this.options.timeout);
			})])
			.finally(() => {
				this.waits.delete(cookie);
				clearTimeout(timeoutId);
			})
	}
}

module.exports = WaitManager;
