import { Test } from "@payvo/sdk";
import nock from "nock";

import { createService } from "../test/mocking";
import { ConfirmedTransactionData } from "./confirmed-transaction.dto";

let subject: ConfirmedTransactionData;

test.before(() => nock.disableNetConnect());

describe("transaction", () => {
    describe("blockId", () => {
        test("should parse blockId correctly", async () => {
            subject = await createService(ConfirmedTransactionData).configure(
                loader.json(`test/fixtures/client/transactions.json`).data[1],
            );
            assert.is(subject.blockId()), "string");
        assert.is(subject.blockId(), "14742837");
    });
});

describe("memo", () => {
    test("should parse memo correctly", async () => {
        subject = await createService(ConfirmedTransactionData).configure(
            loader.json(`test/fixtures/client/transactions.json`).data[1],
        );
        assert.is(subject.memo(), "Mariano");
    });

    test("should parse missing memo correctly", async () => {
        subject = await createService(ConfirmedTransactionData).configure(
            loader.json(`test/fixtures/client/transactions.json`).data[0],
        );
        assert.is(subject.memo()), "undefined");
});
});
});
