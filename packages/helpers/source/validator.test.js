import { describe } from "@payvo/sdk-test";

import Joi from "joi";

import { Validator } from "./validator";

let subject;

describe("Validator", async ({ assert, beforeEach, it }) => {
	beforeEach(() => (subject = new Validator()));

	it("should validate and normalise the data", () => {
		const actual = subject.validate(
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

	it("should pass validation", () => {
		subject.validate(
			{
				name: "jimmy",
				age: 24,
			},
			Joi.object({
				name: Joi.string().required(),
				age: Joi.number().required().positive().integer(),
			}),
		);

		assert.true(subject.passes());

		subject.validate(
			{
				name: "jimmy",
				age: "invalid number",
			},
			Joi.object({
				name: Joi.string().required(),
				age: Joi.number().required().positive().integer(),
			}),
		);

		assert.false(subject.passes());
	});

	it("should fail validation", () => {
		subject.validate(
			{
				name: "jimmy",
				age: "invalid number",
			},
			Joi.object({
				name: Joi.string().required(),
				age: Joi.number().required().positive().integer(),
			}),
		);

		assert.true(subject.fails());

		subject.validate(
			{
				name: "jimmy",
				age: 24,
			},
			Joi.object({
				name: Joi.string().required(),
				age: Joi.number().required().positive().integer(),
			}),
		);

		assert.false(subject.fails());
	});

	it("should have errors", () => {
		assert.undefined(subject.errors());

		subject.validate(
			{
				name: "jimmy",
				age: "invalid number",
			},
			Joi.object({
				name: Joi.string().required(),
				age: Joi.number().positive().integer().required(),
			}),
		);

		assert.length(subject.errors(), 1);
	});

	it("should have an error", () => {
		subject.validate(
			{
				name: "jimmy",
				age: "invalid number",
			},
			Joi.object({
				name: Joi.string().required(),
				age: Joi.number().required().positive().integer(),
			}),
		);

		assert.instance(subject.error(), Joi.ValidationError);
	});
});
