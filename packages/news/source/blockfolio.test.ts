import { Request } from "@payvo/sdk-http-fetch";
import nock from "nock";

import { Blockfolio } from "./blockfolio.js";

let subject: Blockfolio;

beforeAll(() => nock.disableNetConnect());

test.before.each(() => (subject = new Blockfolio(new Request())));

test.after.each(() => nock.cleanAll());

describe("Blockfolio", () => {
    describe("#findByCoin", () => {
        it("should retrieve the feed and findByCoin it", async () => {
            nock("https://news.payvo.com")
                .get("/api")
                .query(true)
                .reply(200, (await import("../test/fixtures/blockfolio.json")).default);

            const result = await subject.findByCoin({ coins: ["ARK"] });

            assert.is(result), "object");
        assert.is(result.data).toBeArray();
        assert.is(result.meta), "object");
});
    });
});
