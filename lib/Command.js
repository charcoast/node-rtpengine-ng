"use strict";

const Bencode = require("bencode");
const Joi     = require("joi");
const schemas = require("./schemas");
const { v4: uuidv4 } = require('uuid');

const InvalidCommandError = require("./errors/InvalidCommandError");

module.exports = class Command {
	constructor (command, options = {}) {
		options.command = command;

		this.cookie = uuidv4();
		this.schema = schemas[command];

		const validated = Joi.validate(options, this.schema);

		if (validated.error) {
			throw new InvalidCommandError(validated.error.message);
		}

		this.command = validated.value;
	}

	getBencodedMessage() {
		return Buffer.from(
			[ this.cookie, Bencode.encode(this.command) ].join(' ')
		);
	}
}

