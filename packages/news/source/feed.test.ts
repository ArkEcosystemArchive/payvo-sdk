/* eslint-disable import/order */
import { describe } from "@payvo/sdk-test";
import fs from "fs-extra";
import { resolve } from "path";

import { FeedService } from "./feed.js";

const fixture = fs.readFileSync(resolve("test/fixtures/feed.xml")).toString();

describe("FeedService", async ({ assert, beforeEach, it, nock }) => {
	beforeEach((context) => (context.subject = new FeedService()));

	it("should retrieve the feed and parse it", async (context) => {
		nock.fake("https://blog.ark.io/").get("/feed").reply(200, fixture);

		assert.object(await context.subject.parse("https://blog.ark.io/feed"));
	});

	it("should throw an error when the request or parsing fails", async (context) => {
		nock.fake("https://blog.ark.io/").get("/feed").reply(200, "malformed");

		assert.rejects(() => context.subject.parse("https://blog.ark.io/feed"));
	});

	it("should retrieve the items of the feed", async (context) => {
		nock.fake("https://blog.ark.io/").get("/feed").reply(200, fixture);

		assert.array(await context.subject.items("https://blog.ark.io/feed"));
	});

	it("should throw an error when the request or parsing fails", async (context) => {
		nock.fake("https://blog.ark.io/").get("/feed").reply(200, "malformed");

		assert.rejects(() => context.subject.items("https://blog.ark.io/feed"));
	});
});
