import { assert, mockery, test } from "@payvo/sdk-test";
import { Response } from "./http-response";

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
	assert.object(subject.headers());
});

test("#status", () => {
	assert.is(subject.status(), 200);
});

test("#successful", () => {
	assert.is(subject.successful(), true);

	mockery(subject, "status").mockReturnValue(400);

	assert.is(subject.successful(), false);
});

test("#ok", () => {
	assert.is(subject.ok(), true);

	mockery(subject, "status").mockReturnValue(400);

	assert.is(subject.ok(), false);
});

test("#redirect", () => {
	assert.is(subject.redirect(), false);

	mockery(subject, "status").mockReturnValue(300);

	assert.is(subject.redirect(), true);
});

test("#failed", () => {
	assert.is(subject.failed(), false);

	mockery(subject, "status").mockReturnValue(400);

	assert.is(subject.failed(), true);

	mockery(subject, "status").mockReturnValue(500);

	assert.is(subject.failed(), true);
});

test("#clientError", () => {
	assert.is(subject.clientError(), false);

	mockery(subject, "status").mockReturnValue(400);

	assert.is(subject.clientError(), true);
});

test("#serverError", () => {
	assert.is(subject.serverError(), false);

	mockery(subject, "status").mockReturnValue(500);

	assert.is(subject.serverError(), true);
});

test.run();
