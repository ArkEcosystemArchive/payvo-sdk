import { Request } from "@payvo/sdk-http-fetch";
import nock from "nock";

import { CryptoCompare } from "./index.js";

const BASE_URL_CRYPTOCOMPARE = "https://min-api.cryptocompare.com";
const token = "ARK";
const currency = "USD";

let subject: CryptoCompare;

beforeEach(async () => {
    subject = new CryptoCompare(new Request());

    nock(BASE_URL_CRYPTOCOMPARE)
        .get("/data/pricemultifull")
        .query(true)
        .reply(200, (await import("../../../test/fixtures/cryptocompare/market.json")).default);

    nock(BASE_URL_CRYPTOCOMPARE)
        .get(/\/data\/histo.+/)
        .reply(200, (await import("../../../test/fixtures/cryptocompare/historical.json")).default);
});

describe("CryptoCompare", () => {
    it("should return ticker values", async () => {
        const response = await subject.marketData(token);
        const entries = Object.keys(response);
        assert.is(entries).not.toBeEmpty();
        assert.is(entries).toIncludeAllMembers([
            "BTC",
            "ETH",
            "LTC",
            "AUD",
            "BRL",
            "CAD",
            "CHF",
            "CNY",
            "EUR",
            "GBP",
            "HKD",
            "IDR",
            "INR",
            "JPY",
            "KRW",
            "MXN",
            "RUB",
            "USD",
        ]);
        assert.is(response.USD.price, 0.178045896);
    });

    describe("verifyToken", () => {
        it("should return true if found", async () => {
            nock(BASE_URL_CRYPTOCOMPARE).get("/data/price").query(true).reply(200, {
                BTC: 0.00002073,
            });

            assert.is(await subject.verifyToken("ark"), true);
        });

        it("should return false if not found", async () => {
            nock(BASE_URL_CRYPTOCOMPARE).get("/data/price").query(true).reply(200, {
                Response: "Error",
            });

            assert.is(await subject.verifyToken("not-ark"), false);
        });
    });

    it("should return historic day values", async () => {
        const response = await subject.historicalPrice({
            token,
            currency,
            days: 24,
            type: "hour",
            dateFormat: "HH:mm",
        });
        assert.is(response), "object");
    assert.is(response).toContainKeys(["labels", "datasets"]);
});

it("should return the current price", async () => {
    nock(BASE_URL_CRYPTOCOMPARE)
        .get("/data/price")
        .query(true)
        .reply(200, (await import("../../../test/fixtures/cryptocompare/price.json")).default);

    const response = await subject.currentPrice({
        token,
        currency,
    });
    assert.is(response, 1.635);
});
});
