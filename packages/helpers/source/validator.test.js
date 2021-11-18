import Joi from "joi";

import { Validator } from "./validator";

let subject;
test.before.each(() => (subject = new Validator()));

test("#validate", () => {
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

    assert.is(actual, { age: 24, name: "jimmy" });
});

test("#passes", () => {
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

    assert.true(subject.passes());
});

test("#fails", () => {
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

    assert.true(subject.fails());
});

test("#errors", () => {
    assert.is(subject.errors(), "undefined");

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

test("#error", () => {
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

    assert.is(subject.error() instanceof Joi.ValidationError);
});
