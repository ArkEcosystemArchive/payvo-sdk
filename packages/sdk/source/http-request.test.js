/* eslint-disable */

import { sinon, test } from "@payvo/sdk-test";
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

test.before.each(async () => {
	spy = sinon.spy();
	subject = new Stub(spy);
});

test("#baseUrl", () => {
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

test("#asJson", () => {
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

test("#asForm", () => {
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

test("#asOctet", () => {
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

test("#bodyFormat", () => {
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

test("#contentType", () => {
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

test("#acceptJson", () => {
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

test("#accept", () => {
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

test("#withHeaders", () => {
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

test("#withCacheStore", () => {
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

test("#timeout", () => {
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

test("#retry", () => {
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

test("#withOptions", () => {
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

test("#get", () => {
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

test("#head", () => {
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

test("#post", () => {
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

test("#patch", () => {
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

test("#put", () => {
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

test("#delete", () => {
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

test.run();
