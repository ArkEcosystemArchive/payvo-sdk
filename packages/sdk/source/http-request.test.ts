/* eslint-disable */

import { describe, sinon } from "@payvo/sdk-test";
import { AbstractRequest } from "./http-request";
import { Response } from "./http-response";

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

describe("AbstractRequest", ({ beforeEach, it, spy }) => {
	beforeEach(async (context) => {
		context.spy = spy();
		context.subject = new Stub(context.spy);
	});

	it("should set a base url", (context) => {
		context.subject.baseUrl("https://base.com");

		context.subject.get("/");

		context.spy.calledWith({
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

	it("should send the request as json", (context) => {
		context.subject.asJson();

		context.subject.get("/");

		context.spy.calledWith({
			bodyFormat: "json",
			data: { query: undefined },
			method: "GET",
			options: { headers: { "Content-Type": "application/json" } },
			url: "/",
		});
	});

	it("should send the request as x-www-form-urlencoded", (context) => {
		context.subject.asForm();

		context.subject.get("/");

		context.spy.calledWith({
			bodyFormat: "form_params",
			data: { query: undefined },
			method: "GET",
			options: { headers: { "Content-Type": "application/x-www-form-urlencoded" } },
			url: "/",
		});
	});

	it("should send the request as octet-stream", (context) => {
		context.subject.asOctet();

		context.subject.get("/");

		context.spy.calledWith({
			bodyFormat: "octet",
			data: { query: undefined },
			method: "GET",
			options: { headers: { "Content-Type": "application/octet-stream" } },
			url: "/",
		});
	});

	it("should send the request as json with a custom body format", (context) => {
		context.subject.bodyFormat("bodyFormat");

		context.subject.get("/");

		context.spy.calledWith({
			bodyFormat: "bodyFormat",
			data: { query: undefined },
			method: "GET",
			options: { headers: { "Content-Type": "application/json" } },
			url: "/",
		});
	});

	it("should set the content-type header", (context) => {
		context.subject.contentType("contentType");

		context.subject.get("/");

		context.spy.calledWith({
			bodyFormat: "json",
			data: { query: undefined },
			method: "GET",
			options: { headers: { "Content-Type": "contentType" } },
			url: "/",
		});
	});

	it("should send the accept header with json as value", (context) => {
		context.subject.acceptJson();

		context.subject.get("/");

		context.spy.calledWith({
			bodyFormat: "json",
			data: { query: undefined },
			method: "GET",
			options: { headers: { Accept: "application/json", "Content-Type": "application/json" } },
			url: "/",
		});
	});

	it("should send the accept header with a custom value", (context) => {
		context.subject.accept("contentType");

		context.subject.get("/");

		context.spy.calledWith({
			bodyFormat: "json",
			data: { query: undefined },
			method: "GET",
			options: { headers: { Accept: "contentType", "Content-Type": "application/json" } },
			url: "/",
		});
	});

	it("should send custom headers", (context) => {
		context.subject.withHeaders({ key: "value" });

		context.subject.get("/");

		context.spy.calledWith({
			bodyFormat: "json",
			data: { query: undefined },
			method: "GET",
			options: { headers: { "Content-Type": "application/json", key: "value" } },
			url: "/",
		});
	});

	it("should send and cache the request", (context) => {
		context.subject.withCacheStore({ cache: "store" });

		context.subject.get("/");

		context.spy.calledWith({
			bodyFormat: "json",
			data: { query: undefined },
			method: "GET",
			options: { cache: { cache: "store" }, headers: { "Content-Type": "application/json" } },
			url: "/",
		});
	});

	it("should timeout after 5 seconds", (context) => {
		context.subject.timeout(5);

		context.subject.get("/");

		context.spy.calledWith({
			bodyFormat: "json",
			data: { query: undefined },
			method: "GET",
			options: { headers: { "Content-Type": "application/json" }, timeout: 5 },
			url: "/",
		});
	});

	it("should retry failing requests for 3 times with 100ms pauses", (context) => {
		context.subject.retry(3, 100);

		context.subject.get("/");

		context.spy.calledWith({
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

	it("should configure additional options", (context) => {
		context.subject.withOptions({ option: "thing" });

		context.subject.get("/");

		context.spy.calledWith({
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

	it("should send a GET request", (context) => {
		context.subject.get("/");

		context.spy.calledWith({
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

	it("should send a HEAD request", (context) => {
		context.subject.head("/");

		context.spy.calledWith({
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

	it("should send a POST request", (context) => {
		context.subject.post("/");

		context.spy.calledWith({
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

	it("should send a PATCH request", (context) => {
		context.subject.patch("/");

		context.spy.calledWith({
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

	it("should send a PUT request", (context) => {
		context.subject.put("/");

		context.spy.calledWith({
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

	it("should send a DELETE request", (context) => {
		context.subject.delete("/");

		context.spy.calledWith({
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
