import { IoC, Services, Test } from "@payvo/sdk";
import { DateTime } from "@payvo/sdk-intl";
import { BigNumber } from "@payvo/sdk-helpers";
import nock from "nock";

import { createService } from "../test/mocking";
import { ClientService } from "./client.service";
import { SignedTransactionData } from "./signed-transaction.dto";
import { ConfirmedTransactionData } from "./confirmed-transaction.dto";
import { WalletData } from "./wallet.dto";

let subject: ClientService;

test.before(async () => {
    nock.disableNetConnect();

    subject = await createService(ClientService, undefined, (container) => {
        container.constant(IoC.BindingType.Container, container);
        container.constant(IoC.BindingType.DataTransferObjects, {
            SignedTransactionData,
            ConfirmedTransactionData,
            WalletData,
        });
        container.singleton(IoC.BindingType.DataTransferObjectService, Services.AbstractDataTransferObjectService);
    });
});

test.after.each(() => nock.cleanAll());

test.before(async () => {
    nock.disableNetConnect();
});

describe("ClientService", () => {
    describe("#transactions", () => {
        test("should succeed", async () => {
            nock("https://neoscan-testnet.io/api/test_net/v1/")
                .get("/get_address_abstracts/Ab9QkPeMzx7ehptvjbjHviAXUfdhAmEAUF/1")
                .reply(200, loader.json(`test/fixtures/client/transactions.json`));

            const result = await subject.transactions({
                identifiers: [{ type: "address", value: "Ab9QkPeMzx7ehptvjbjHviAXUfdhAmEAUF" }],
            });

            assert.is(result, "object");
        assert.is(result.items()[0] instanceof ConfirmedTransactionData);
        assert.is(result.items()[0].id(), "718bc4cfc50c361a8afe032e2c170dfebadce16ea72228a57634413b62b7cf24");
        assert.is(result.items()[0].type(), "transfer");
        assert.is(result.items()[0].timestamp() instanceof DateTime);
        assert.is(result.items()[0].confirmations(), BigNumber.ZERO);
        assert.is(result.items()[0].sender(), "AStJyBXGGBK6bwrRfRUHSjp993PB5C9QgF");
        assert.is(result.items()[0].recipient(), "Ab9QkPeMzx7ehptvjbjHviAXUfdhAmEAUF");
        assert.is(result.items()[0].amount(), BigNumber.make(1));
        assert.is(result.items()[0].fee(), BigNumber.ZERO);
        // @ts-ignore - Better types so that memo gets detected on TransactionDataType
        assert.is(result.items()[0].memo()), "undefined");
});
});

describe("#wallet", () => {
    test("should succeed", async () => {
        nock("https://neoscan-testnet.io/api/test_net/v1/")
            .get("/get_balance/Ab9QkPeMzx7ehptvjbjHviAXUfdhAmEAUF")
            .reply(200, loader.json(`test/fixtures/client/wallet.json`));

        const result = await subject.wallet({
            type: "address",
            value: "Ab9QkPeMzx7ehptvjbjHviAXUfdhAmEAUF",
        });

        assert.is(result, "object");
    assert.is(result.address(), "Ab9QkPeMzx7ehptvjbjHviAXUfdhAmEAUF");
    assert.is(result.balance().available, BigNumber.make(9).times(1e8));
});
    });

describe.skip("#broadcast", () => {
    test("should pass", async () => {
        nock("https://neoscan-testnet.io/api/test_net/v1/")
            .get("/get_balance/Ab9QkPeMzx7ehptvjbjHviAXUfdhAmEAUF")
            .reply(200, loader.json(`test/fixtures/client/balance.json`))
            .post("/api/transactions")
            .reply(200, loader.json(`test/fixtures/client/broadcast.json`));

        const result = await subject.broadcast([
            createService(SignedTransactionData).configure("id", "transactionPayload", ""),
        ]);

        assert.is(result, {
            accepted: ["0cb2e1fc8caa83cfb204e5cd2f66a58f3954a3b7bcc8958aaba38b582376e652"],
            rejected: [],
            errors: {},
        });
    });

    test("should fail", async () => {
        nock("https://neoscan-testnet.io/api/test_net/v1/")
            .post("/api/transactions")
            .reply(200, loader.json(`test/fixtures/client/broadcast-failure.json`));

        const result = await subject.broadcast([
            createService(SignedTransactionData).configure("id", "transactionPayload", ""),
        ]);

        assert.is(result, {
            accepted: [],
            rejected: ["0cb2e1fc8caa83cfb204e5cd2f66a58f3954a3b7bcc8958aaba38b582376e652"],
            errors: {
                "0cb2e1fc8caa83cfb204e5cd2f66a58f3954a3b7bcc8958aaba38b582376e652": "ERR_INSUFFICIENT_FUNDS",
            },
        });
    });
});
});