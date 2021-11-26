import { describe } from "@payvo/sdk-test";

import Joi from "joi";

import { Validator } from "./validator";

describe("Validator", async ({ assert, beforeEach, it }) => {
	beforeEach((context) => (context.subject = new Validator()));

	it("should validate and normalise the data", (context) => {
		const actual = context.subject.validate(
			{
				name: "jimmy",
				age: "24",
			},
			Joi.object({
				name: Joi.string().required(),
				age: Joi.number().required().positive().integer(),
			}),
		);

		assert.equal(actual, { age: 24, name: "jimmy" });
	});

	it("should pass validation", (context) => {
		context.subject.validate(
			{
				name: "jimmy",
				age: 24,
			},
			Joi.object({
				name: Joi.string().required(),
				age: Joi.number().required().positive().integer(),
			}),
		);

		assert.true(context.subject.passes());

		context.subject.validate(
			{
				name: "jimmy",
				age: "invalid number",
			},
			Joi.object({
				name: Joi.string().required(),
				age: Joi.number().required().positive().integer(),
			}),
		);

		assert.false(context.subject.passes());
	});

	it("should fail validation", (context) => {
		context.subject.validate(
			{
				name: "jimmy",
				age: "invalid number",
			},
			Joi.object({
				name: Joi.string().required(),
				age: Joi.number().required().positive().integer(),
			}),
		);

		assert.true(context.subject.fails());

		context.subject.validate(
			{
				name: "jimmy",
				age: 24,
			},
			Joi.object({
				name: Joi.string().required(),
				age: Joi.number().required().positive().integer(),
			}),
		);

		assert.false(context.subject.fails());
	});

	it("should have errors", (context) => {
		assert.undefined(context.subject.errors());

		context.subject.validate(
			{
				name: "jimmy",
				age: "invalid number",
			},
			Joi.object({
				name: Joi.string().required(),
				age: Joi.number().positive().integer().required(),
			}),
		);

		assert.length(context.subject.errors(), 1);
	});

	it("should have an error", (context) => {
		context.subject.validate(
			{
				name: "jimmy",
				age: "invalid number",
			},
			Joi.object({
				name: Joi.string().required(),
				age: Joi.number().required().positive().integer(),
			}),
		);

		assert.instance(context.subject.error(), Joi.ValidationError);
	});
});
