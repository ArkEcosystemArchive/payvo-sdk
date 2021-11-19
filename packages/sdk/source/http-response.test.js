import { assert, test } from "@payvo/sdk-test";
import { Response } from "./response";

let subject;

test.before.each(
	() =>
		(subject = new Response({
			body: "{}",
			headers: { Accept: "something" },
			statusCode: 200,
		})),
);

test("#constructor", () => {
	assert
		.throws(
			() =>
				new Response({
					body: "{}",
					headers: { Accept: "something" },
					statusCode: 500,
				}), "HTTP request returned status code 500.");
});

test("#body", () => {
	assert.is(subject.body(), "{}");

	assert
		.throws(() =>
			new Response({
				body: undefined,
				headers: { Accept: "something" },
				statusCode: 200,
			}).body(), "The response body is empty.");

	assert
		.throws(() =>
			new Response({
				body: "",
				headers: { Accept: "something" },
				statusCode: 200,
			}).body(), "The response body is empty.");
});

test("#json", () => {
	assert.is(subject.json(), {});
});

test("#header", () => {
	assert.is(subject.header("Accept"), "something");
});

test("#headers", () => {
	assert.is(subject.headers(),
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
