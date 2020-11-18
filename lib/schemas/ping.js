"use strict";

const Joi = require("joi");

module.exports = Joi.object().keys({
	command : Joi.string().valid("ping").required(),
});
