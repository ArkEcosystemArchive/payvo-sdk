import { IoC, Services, Test } from "@payvo/sdk";
import nock from "nock";

import { createService, requireModule } from "../test/mocking";
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
    describe("#wallet", () => {
        test("should succeed", async () => {
            nock("https://api.testnet.eos.io")
                .post("/v1/chain/get_account")
                .reply(200, requireModule(`../test/fixtures/client/wallet.json`));

            const result = await subject.wallet({
                type: "address",
                value: "bdfkbzietxos",
            });

            assert.is(result instanceof WalletData);
        });
    });

    describe.skip("#broadcast", () => {
        test("should succeed", async () => {
            const result = await subject.broadcast([]);

            assert.is(result), "undefined");
    });
});
});
