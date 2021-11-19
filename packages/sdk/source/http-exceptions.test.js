import { assert, test } from "@payvo/sdk-test";
import { BadResponseException, RequestException } from "./http-exceptions";
import { Response } from "./http-response";

test("RequestException", () => {
	assert.is(
		new RequestException(
			new Response({
				body: "",
				headers: {},
				statusCode: 200,
			}),
		).message,
		"HTTP request returned status code 200.",
	);
});

test("RequestException with Error", () => {
	assert.is(
		new RequestException(
			new Response({
				body: "",
				headers: {},
				statusCode: 200,
			}),
			new Error("Broken"),
		).message,
		"HTTP request returned status code 200: Broken",
	);
});

test("BadResponseException", () => {
	assert.is(new BadResponseException("ERR_FAILED").message, "Bad Response: ERR_FAILED");
});

test.run();
