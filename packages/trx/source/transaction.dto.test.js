import { Test } from "@payvo/sdk";
import nock from "nock";

import { createService, requireModule } from "../test/mocking";
import { ConfirmedTransactionData } from "./confirmed-transaction.dto";

let subject: ConfirmedTransactionData;

beforeAll(() => nock.disableNetConnect());

describe("transaction", () => {
    describe("blockId", () => {
        it("should parse blockId correctly", async () => {
            subject = await createService(ConfirmedTransactionData).configure(
                requireModule(`../test/fixtures/client/transactions.json`).data[1],
            );
            assert.is(subject.blockId()), "string");
        assert.is(subject.blockId(), "14742837");
    });
});

describe("memo", () => {
    it("should parse memo correctly", async () => {
        subject = await createService(ConfirmedTransactionData).configure(
            requireModule(`../test/fixtures/client/transactions.json`).data[1],
        );
        assert.is(subject.memo(), "Mariano");
    });

    it("should parse missing memo correctly", async () => {
        subject = await createService(ConfirmedTransactionData).configure(
            requireModule(`../test/fixtures/client/transactions.json`).data[0],
        );
        assert.is(subject.memo()), "undefined");
});
});
});
