import { describe } from "@payvo/sdk-test";

import { BadResponseException, RequestException } from "./http-exceptions.js";
import { Response } from "./http-response.js";

describe("HTTP Exceptions", ({ assert, it, nock, loader }) => {
	it("should throw an exception with the type RequestException", () => {
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

	it("should throw an exception with the type RequestException (with Error)", () => {
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

	it("should throw an exception with the type BadResponseException", () => {
		assert.is(new BadResponseException("ERR_FAILED").message, "Bad Response: ERR_FAILED");
	});
});
