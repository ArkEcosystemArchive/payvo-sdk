import { jest } from "@jest/globals";

import { Response } from "./response.js";

let subject: Response;

beforeEach(
	() =>
		(subject = new Response({
			body: "{}",
			headers: { Accept: "something" },
			statusCode: 200,
		})),
);

test("#constructor", () => {
	assert
		.is(
			() =>
				new Response({
					body: "{}",
					headers: { Accept: "something" },
					statusCode: 500,
				}),
		)
		.toThrow("HTTP request returned status code 500.");
});

test("#body", () => {
	assert.is(subject.body(), "{}");

	assert
		.is(() =>
			new Response({
				body: undefined,
				headers: { Accept: "something" },
				statusCode: 200,
			}).body(),
		)
		.toThrow("The response body is empty.");

	assert
		.is(() =>
			new Response({
				body: "",
				headers: { Accept: "something" },
				statusCode: 200,
			}).body(),
		)
		.toThrow("The response body is empty.");
});

test("#json", () => {
	assert.is(subject.json()).toEqual({});
});

test("#header", () => {
	assert.is(subject.header("Accept"), "something");
});

test("#headers", () => {
	assert.is(subject.headers()).toMatchInlineSnapshot(`
		Object {
		  "Accept": "something",
		}
	`);
});

test("#status", () => {
	assert.is(subject.status(), 200);
});

test("#successful", () => {
	assert.is(subject.successful(), true);

	jest.spyOn(subject, "status").mockReturnValue(400);

	assert.is(subject.successful(), false);
});

test("#ok", () => {
	assert.is(subject.ok(), true);

	jest.spyOn(subject, "status").mockReturnValue(400);

	assert.is(subject.ok(), false);
});

test("#redirect", () => {
	assert.is(subject.redirect(), false);

	jest.spyOn(subject, "status").mockReturnValue(300);

	assert.is(subject.redirect(), true);
});

test("#failed", () => {
	assert.is(subject.failed(), false);

	jest.spyOn(subject, "status").mockReturnValue(400);

	assert.is(subject.failed(), true);

	jest.spyOn(subject, "status").mockReturnValue(500);

	assert.is(subject.failed(), true);
});

test("#clientError", () => {
	assert.is(subject.clientError(), false);

	jest.spyOn(subject, "status").mockReturnValue(400);

	assert.is(subject.clientError(), true);
});

test("#serverError", () => {
	assert.is(subject.serverError(), false);

	jest.spyOn(subject, "status").mockReturnValue(500);

	assert.is(subject.serverError(), true);
});
