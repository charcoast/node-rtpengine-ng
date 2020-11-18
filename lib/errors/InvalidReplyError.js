"use strict";

class InvalidReplyError extends Error {
	constructor(cookie, host, port) {
		super();
		this.name = "InvalidReplyError";
		this.message = `Invalid reply with cookie ${cookie} from host ${host} and port ${port}`;
	}
}

module.exports = InvalidReplyError;
