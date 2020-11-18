"use strict";

class InvalidCommandError extends Error {

	constructor(message) {
		super();
		this.name = "InvalidCommandError";
		this.message = message;
	}
}

module.exports = InvalidCommandError;
