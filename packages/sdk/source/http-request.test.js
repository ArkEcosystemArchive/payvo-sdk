/* eslint-disable */

import { describe, sinon } from "@payvo/sdk-test";
import { AbstractRequest } from "./http-request";
import { Response } from "./http-response";

let subject;
let spy;

class Stub extends AbstractRequest {
	constructor(spy) {
		super();

		this.spy = spy;
	}

	async send(method, url, data) {
		this.spy({ method, url, data, options: this._options, bodyFormat: this._bodyFormat });

		return new Response({
			body: "{}",
			headers: { Accept: "something" },
			statusCode: 200,
		});
	}
}

describe("AbstractRequest", ({ beforeEach, it }) => {
	beforeEach(async () => {
		spy = sinon.spy();
		subject = new Stub(spy);
	});

	it("should set a base url", () => {
		subject.baseUrl("https://base.com");

		subject.get("/");

		spy.calledWith({
			bodyFormat: "json",
			data: {
				query: undefined,
			},
			method: "GET",
			options: {
				headers: {
					"Content-Type": "application/json",
				},
				prefixUrl: "https://base.com/",
			},
			url: "/",
		});
	});

	it("should send the request as json", () => {
		subject.asJson();

		subject.get("/");

		spy.calledWith({
			bodyFormat: "json",
			data: { query: undefined },
			method: "GET",
			options: { headers: { "Content-Type": "application/json" } },
			url: "/",
		});
	});

	it("should send the request as x-www-form-urlencoded", () => {
		subject.asForm();

		subject.get("/");

		spy.calledWith({
			bodyFormat: "form_params",
			data: { query: undefined },
			method: "GET",
			options: { headers: { "Content-Type": "application/x-www-form-urlencoded" } },
			url: "/",
		});
	});

	it("should send the request as octet-stream", () => {
		subject.asOctet();

		subject.get("/");

		spy.calledWith({
			bodyFormat: "octet",
			data: { query: undefined },
			method: "GET",
			options: { headers: { "Content-Type": "application/octet-stream" } },
			url: "/",
		});
	});

	it("should send the request as json with a custom body format", () => {
		subject.bodyFormat("bodyFormat");

		subject.get("/");

		spy.calledWith({
			bodyFormat: "bodyFormat",
			data: { query: undefined },
			method: "GET",
			options: { headers: { "Content-Type": "application/json" } },
			url: "/",
		});
	});

	it("should set the content-type header", () => {
		subject.contentType("contentType");

		subject.get("/");

		spy.calledWith({
			bodyFormat: "json",
			data: { query: undefined },
			method: "GET",
			options: { headers: { "Content-Type": "contentType" } },
			url: "/",
		});
	});

	it("should send the accept header with json as value", () => {
		subject.acceptJson();

		subject.get("/");

		spy.calledWith({
			bodyFormat: "json",
			data: { query: undefined },
			method: "GET",
			options: { headers: { Accept: "application/json", "Content-Type": "application/json" } },
			url: "/",
		});
	});

	it("should send the accept header with a custom value", () => {
		subject.accept("contentType");

		subject.get("/");

		spy.calledWith({
			bodyFormat: "json",
			data: { query: undefined },
			method: "GET",
			options: { headers: { Accept: "contentType", "Content-Type": "application/json" } },
			url: "/",
		});
	});

	it("should send custom headers", () => {
		subject.withHeaders({ key: "value" });

		subject.get("/");

		spy.calledWith({
			bodyFormat: "json",
			data: { query: undefined },
			method: "GET",
			options: { headers: { "Content-Type": "application/json", key: "value" } },
			url: "/",
		});
	});

	it("should send and cache the request", () => {
		subject.withCacheStore({ cache: "store" });

		subject.get("/");

		spy.calledWith({
			bodyFormat: "json",
			data: { query: undefined },
			method: "GET",
			options: { cache: { cache: "store" }, headers: { "Content-Type": "application/json" } },
			url: "/",
		});
	});

	it("should timeout after 5 seconds", () => {
		subject.timeout(5);

		subject.get("/");

		spy.calledWith({
			bodyFormat: "json",
			data: { query: undefined },
			method: "GET",
			options: { headers: { "Content-Type": "application/json" }, timeout: 5 },
			url: "/",
		});
	});

	it("should retry failing requests for 3 times with 100ms pauses", () => {
		subject.retry(3, 100);

		subject.get("/");

		spy.calledWith({
			bodyFormat: "json",
			data: {
				query: undefined,
			},
			method: "GET",
			options: {
				headers: {
					"Content-Type": "application/json",
				},
				retry: {
					limit: 3,
					maxRetryAfter: 100,
				},
			},
			url: "/",
		});
	});

	it("should configure additional options", () => {
		subject.withOptions({ option: "thing" });

		subject.get("/");

		spy.calledWith({
			bodyFormat: "json",
			data: {
				query: undefined,
			},
			method: "GET",
			options: {
				headers: {
					"Content-Type": "application/json",
				},
				option: "thing",
			},
			url: "/",
		});
	});

	it("should send a GET request", () => {
		subject.get("/");

		spy.calledWith({
			bodyFormat: "json",
			data: {
				data: undefined,
				query: undefined,
			},
			method: "GET",
			options: {
				headers: {
					"Content-Type": "application/json",
				},
			},
			url: "/",
		});
	});

	it("should send a HEAD request", () => {
		subject.head("/");

		spy.calledWith({
			bodyFormat: "json",
			data: {
				data: undefined,
				query: undefined,
			},
			method: "HEAD",
			options: {
				headers: {
					"Content-Type": "application/json",
				},
			},
			url: "/",
		});
	});

	it("should send a POST request", () => {
		subject.post("/");

		spy.calledWith({
			bodyFormat: "json",
			data: {
				data: undefined,
				query: undefined,
			},
			method: "POST",
			options: {
				headers: {
					"Content-Type": "application/json",
				},
			},
			url: "/",
		});
	});

	it("should send a PATCH request", () => {
		subject.patch("/");

		spy.calledWith({
			bodyFormat: "json",
			data: {
				data: undefined,
				query: undefined,
			},
			method: "PATCH",
			options: {
				headers: {
					"Content-Type": "application/json",
				},
			},
			url: "/",
		});
	});

	it("should send a PUT request", () => {
		subject.put("/");

		spy.calledWith({
			bodyFormat: "json",
			data: {
				data: undefined,
				query: undefined,
			},
			method: "PUT",
			options: {
				headers: {
					"Content-Type": "application/json",
				},
			},
			url: "/",
		});
	});

	it("should send a DELETE request", () => {
		subject.delete("/");

		spy.calledWith({
			bodyFormat: "json",
			data: {
				data: undefined,
				query: undefined,
			},
			method: "DELETE",
			options: {
				headers: {
					"Content-Type": "application/json",
				},
			},
			url: "/",
		});
	});
});
