import { describe } from "@payvo/sdk-test";

import { Request } from "./request.js";

describe("Request", ({ assert, beforeAll, it, nock }) => {
	beforeAll((context) => {
		context.subject = new Request();
	});

	it("should get with params", async (context) => {
		const responseBody = {
			args: { key: "value" },
			origin: "87.95.132.111,10.100.91.201",
			url: "http://httpbin.org/get",
		};

		nock.fake("http://httpbin.org/").get("/get").query(true).reply(200, responseBody);

		const response = await context.subject.get("http://httpbin.org/get", { key: "value" });

		assert.equal(response.json(), responseBody);
	});

	it("should get without params", async (context) => {
		const responseBody = {
			args: {},
			origin: "87.95.132.111,10.100.91.201",
			url: "http://httpbin.org/get",
		};

		nock.fake("http://httpbin.org/").get("/get").reply(200, responseBody);

		const response = await context.subject.get("http://httpbin.org/get");

		assert.equal(response.json(), responseBody);
	});

	it("should post with body", async (context) => {
		const responseBody = {
			args: {},
			data: '{"key":"value"}',
			files: {},
			form: {},
			json: {
				key: "value",
			},
			origin: "87.95.132.111,10.100.91.201",
			url: "http://httpbin.org/post",
		};

		nock.fake("http://httpbin.org/").post("/post").reply(200, responseBody);

		const response = await context.subject.post("http://httpbin.org/post", { key: "value" });

		assert.equal(response.json(), responseBody);
	});

	it("should post with headers", async (context) => {
		const responseBody = {
			args: {},
			data: '{"key":"value"}',
			files: {},
			form: {},
			headers: { Authorization: "Bearer TOKEN" },
			json: {
				key: "value",
			},
			origin: "87.95.132.111,10.100.91.201",
			url: "http://httpbin.org/post",
		};

		nock.fake("http://httpbin.org/").post("/post").reply(200, responseBody);

		const response = await context.subject
			.asJson()
			.withHeaders({ Authorization: "Bearer TOKEN" })
			.post("http://httpbin.org/post", { key: "value" });

		assert.equal(response.json(), responseBody);
	});

	it("should post with form_params", async (context) => {
		const responseBody = {
			args: {},
			data: '{"key":"value"}',
			files: {},
			form: {
				key: "value",
			},
			json: {},
			origin: "87.95.132.111,10.100.91.201",
			url: "http://httpbin.org/post",
		};

		nock.fake("http://httpbin.org/").post("/post").reply(200, responseBody);

		const response = await context.subject.asForm().post("http://httpbin.org/post", { key: "value" });

		assert.equal(response.json(), responseBody);
	});

	it("should post with octet", async (context) => {
		const responseBody = {
			args: {},
			data: '{"key":"value"}',
			files: {},
			form: {
				key: "value",
			},
			json: {},
			origin: "87.95.132.111,10.100.91.201",
			url: "http://httpbin.org/post",
		};

		nock.fake("http://httpbin.org/").post("/post").reply(200, responseBody);

		const response = await context.subject
			.bodyFormat("octet")
			.post("http://httpbin.org/post", Buffer.from(JSON.stringify({ key: "value" })));

		assert.equal(response.json(), responseBody);
	});

	it("should handle 404s", async (context) => {
		nock.fake("http://httpbin.org/").get("/get").reply(404);

		await assert.rejects(
			() => context.subject.get("http://httpbin.org/get"),
			"HTTP request returned status code 404",
		);
	});
});
