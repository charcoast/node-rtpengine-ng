"use strict";

class RequestTimeoutError extends Error {
	constructor (cookie, timeout) {
		super();
		this.cookie = cookie;
		this.timeout = timeout;
		this.name = "RequestTimeoutError";
		this.message = `Request ${cookie} timeout after ${timeout} seconds.`;
	}
}

module.exports = RequestTimeoutError;
