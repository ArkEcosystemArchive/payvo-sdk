import { describe } from "@payvo/sdk-test";
import { Response } from "./http-response";

let subject;
let spy;

describe("Response", ({ assert, afterEach, beforeEach, it, stub }) => {
	beforeEach(() => {
		subject = new Response({
			body: "{}",
			headers: { Accept: "something" },
			statusCode: 200,
		});
	});

	afterEach(() => {
		if (spy) {
			spy.restore();
			spy = undefined;
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

	it("should get the response unparsed body", () => {
		assert.is(subject.body(), "{}");

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

	it("should get the parsed response body", () => {
		assert.object(subject.json());
	});

	it("should get a specific header", () => {
		assert.is(subject.header("Accept"), "something");
	});

	it("should get all headers", () => {
		assert.object(subject.headers());
	});

	it("should get the response status", () => {
		assert.is(subject.status(), 200);
	});

	it("should determine if the request was successful", () => {
		assert.true(subject.successful());

		spy = stub(subject, "status").returnValue(400);

		assert.false(subject.successful());
	});

	it("should determine if the request was ok", () => {
		assert.true(subject.ok());

		spy = stub(subject, "status").returnValue(400);

		assert.false(subject.ok());
	});

	it("should determine if the request was a redirect", () => {
		assert.false(subject.redirect());

		spy = stub(subject, "status").returnValue(300);

		assert.true(subject.redirect());
	});

	it("should determine if the request has failed", () => {
		assert.false(subject.failed());

		spy = stub(subject, "status").returnValue(400);

		assert.true(subject.failed());

		spy.returnValue(500);

		assert.true(subject.failed());
	});

	it("should determine if the request was encountered a client error", () => {
		assert.false(subject.clientError());

		spy = stub(subject, "status").returnValue(400);

		assert.true(subject.clientError());
	});

	it("should determine if the request was encountered a server error", () => {
		assert.false(subject.serverError());

		spy = stub(subject, "status").returnValue(500);

		assert.true(subject.serverError());
	});
});
