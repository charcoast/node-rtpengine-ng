"use strict";

const Bencode = require("bencode");
const Joi     = require("joi");
const _       = require("lodash");

const InvalidCommandError = require("./errors/InvalidCommandError");

function Command (schema, options) {
	const validated = Joi.validate(options, schema);

	if (validated.error) {
		throw new InvalidCommandError(validated.error.message);
	}

	_.assign(this, validated.value);
	Object.freeze(this);
}

Command.prototype.bencode = function () {
	return Bencode.encode(this);
};

module.exports = Command;
