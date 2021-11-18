/* eslint-disable import/order */
import { test } from "uvu";
import * as assert from "uvu/assert";

import fs from "fs-extra";
import nock from "nock";
import { resolve } from "path";

import { FeedService } from "./feed";

const fixture = fs.readFileSync(resolve("test/fixtures/feed.xml")).toString();

let subject;

test.before.each(() => (subject = new FeedService()));

const rejects = async (exp) => {
	try {
		await exp();
	} catch (err) {
		return;
	}
};

test("should retrieve the feed and parse it", async () => {
	nock("https://blog.ark.io/").get("/feed").reply(200, fixture);

	assert.type(await subject.parse("https://blog.ark.io/feed"), "object");
});

test("should throw an error when the request or parsing fails", async () => {
	nock("https://blog.ark.io/").get("/feed").reply(200, "malformed");

	rejects(() => subject.parse("https://blog.ark.io/feed"));
});

test("should retrieve the items of the feed", async () => {
	nock("https://blog.ark.io/").get("/feed").reply(200, fixture);

	assert.ok(Array.isArray(await subject.items("https://blog.ark.io/feed")));
});

test("should throw an error when the request or parsing fails", async () => {
	nock("https://blog.ark.io/").get("/feed").reply(200, "malformed");

	rejects(() => subject.items("https://blog.ark.io/feed"));
});

test.run();
