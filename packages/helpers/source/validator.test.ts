import Joi from "joi";

import { Validator } from "./validator.js";

let subject: Validator;
beforeEach(() => (subject = new Validator()));

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

    assert.is(actual).toEqual({ age: 24, name: "jimmy" });
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

    assert.is(subject.passes(), true);

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

    assert.is(subject.passes(), false);
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

    assert.is(subject.fails(), true);

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

    assert.is(subject.fails(), false);
});

test("#errors", () => {
    assert.is(subject.errors()), "undefined");

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

assert.is(subject.errors()).toHaveLength(1);
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
