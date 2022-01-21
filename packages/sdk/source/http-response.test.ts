import { describe } from "@payvo/sdk-test";

import { Response } from "./http-response.js";

describe("Response", ({ assert, afterEach, beforeEach, it, stub }) => {
	beforeEach((context) => {
		context.subject = new Response({
			body: "{}",
			headers: { Accept: "something" },
			statusCode: 200,
		});
	});

	afterEach((context) => {
		if (context.spy) {
			context.spy = undefined;
		}
	});

	it("should fail to create an instance of the request failed", () => {
		assert.throws(
			() =>
				new Response({
					body: "{}",
					headers: { Accept: "something" },
					statusCode: 500,
				}),
			"HTTP request returned status code 500.",
		);
	});

	it("should get the response unparsed body", (context) => {
		assert.is(context.subject.body(), "{}");

		assert.throws(
			() =>
				new Response({
					body: undefined,
					headers: { Accept: "something" },
					statusCode: 200,
				}).body(),
			"The response body is empty.",
		);

		assert.throws(
			() =>
				new Response({
					body: "",
					headers: { Accept: "something" },
					statusCode: 200,
				}).body(),
			"The response body is empty.",
		);
	});

	it("should get the parsed response body", (context) => {
		assert.object(context.subject.json());
	});

	it("should get a specific header", (context) => {
		assert.is(context.subject.header("Accept"), "something");
	});

	it("should get all headers", (context) => {
		assert.object(context.subject.headers());
	});

	it("should get the response status", (context) => {
		assert.is(context.subject.status(), 200);
	});

	it("should determine if the request was successful", (context) => {
		assert.true(context.subject.successful());

		context.spy = stub(context.subject, "status").returnValue(400);

		assert.false(context.subject.successful());
	});

	it("should determine if the request was ok", (context) => {
		assert.true(context.subject.ok());

		context.spy = stub(context.subject, "status").returnValue(400);

		assert.false(context.subject.ok());
	});

	it("should determine if the request was a redirect", (context) => {
		assert.false(context.subject.redirect());

		context.spy = stub(context.subject, "status").returnValue(300);

		assert.true(context.subject.redirect());
	});

	it("should determine if the request has failed", (context) => {
		assert.false(context.subject.failed());

		context.spy = stub(context.subject, "status").returnValue(400);

		assert.true(context.subject.failed());

		context.spy.returnValue(500);

		assert.true(context.subject.failed());
	});

	it("should determine if the request was encountered a client error", (context) => {
		assert.false(context.subject.clientError());

		context.spy = stub(context.subject, "status").returnValue(400);

		assert.true(context.subject.clientError());
	});

	it("should determine if the request was encountered a server error", (context) => {
		assert.false(context.subject.serverError());

		context.spy = stub(context.subject, "status").returnValue(500);

		assert.true(context.subject.serverError());
	});
});
