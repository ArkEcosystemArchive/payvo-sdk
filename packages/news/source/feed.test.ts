/* eslint-disable import/order */

import fs from "fs-extra";
import nock from "nock";
import { resolve } from "path";

import { FeedService } from "./feed.js";

const fixture = fs.readFileSync(resolve("test/fixtures/feed.xml")).toString();

let subject: FeedService;

test.before.each(() => (subject = new FeedService()));

describe("FeedService", () => {
    describe("#parse", () => {
        it("should retrieve the feed and parse it", async () => {
            nock("https://blog.ark.io/").get("/feed").reply(200, fixture);

            await assert.is(subject.parse("https://blog.ark.io/feed")).resolves, "object");
    });

    it("should throw an error when the request or parsing fails", async () => {
        nock("https://blog.ark.io/").get("/feed").reply(200, "malformed");

        await assert.is(subject.parse("https://blog.ark.io/feed")).rejects.toThrowError();
    });
});

describe("#items", () => {
    it("should retrieve the items of the feed", async () => {
        nock("https://blog.ark.io/").get("/feed").reply(200, fixture);

        await assert.is(subject.items("https://blog.ark.io/feed")).resolves.toBeArray();
    });

    it("should throw an error when the request or parsing fails", async () => {
        nock("https://blog.ark.io/").get("/feed").reply(200, "malformed");

        await assert.is(subject.items("https://blog.ark.io/feed")).rejects.toThrowError();
    });
});
});
