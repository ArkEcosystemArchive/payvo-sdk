/* eslint-disable import/order */
import { assert, nock, test } from "@payvo/sdk-test";

import fs from "fs-extra";
import { resolve } from "path";

import { FeedService } from "./feed";

const fixture = fs.readFileSync(resolve("test/fixtures/feed.xml")).toString();

let subject;

test.before.each(() => (subject = new FeedService()));

test("should retrieve the feed and parse it", async () => {
	nock.fake("https://blog.ark.io/").get("/feed").reply(200, fixture);

	assert.object(await subject.parse("https://blog.ark.io/feed"));
});

test("should throw an error when the request or parsing fails", async () => {
	nock.fake("https://blog.ark.io/").get("/feed").reply(200, "malformed");

	assert.rejects(() => subject.parse("https://blog.ark.io/feed"));
});

test("should retrieve the items of the feed", async () => {
	nock.fake("https://blog.ark.io/").get("/feed").reply(200, fixture);

	assert.array(await subject.items("https://blog.ark.io/feed"));
});

test("should throw an error when the request or parsing fails", async () => {
	nock.fake("https://blog.ark.io/").get("/feed").reply(200, "malformed");

	assert.rejects(() => subject.items("https://blog.ark.io/feed"));
});

test.run();
