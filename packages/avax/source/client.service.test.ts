import { Collections, IoC, Services } from "@payvo/sdk";

import { createService, requireModule } from "../test/mocking.js";
import { ClientService } from "./client.service";
import { SignedTransactionData } from "./signed-transaction.dto";
import { ConfirmedTransactionData } from "./confirmed-transaction.dto";
import { WalletData } from "./wallet.dto";

let subject: ClientService;

beforeAll(async () => {
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

describe("ClientService", () => {
    describe("#transaction", () => {
        it("should succeed", async () => {
            const result = await subject.transaction("2qwe2tsgBZ5yqq6Qg2eTDPJ1tVVZZ9KoPLMDwurLTGTNpGMFr9");

            expect(result).toBeInstanceOf(ConfirmedTransactionData);
        });
    });

    describe.skip("#transactions", () => {
        it("should succeed", async () => {
            const result = await subject.transactions({
                identifiers: [
                    {
                        type: "address",
                        value: "X-fuji1my5kqjufcshudkzu4xdt5rlqk99j9nwseclkwq",
                    },
                ],
            });

            expect(result).toBeInstanceOf(Collections.ConfirmedTransactionDataCollection);
        });
    });

    describe("#wallet", () => {
        it("should succeed", async () => {
            const result = await subject.wallet({
                type: "address",
                value: "X-fuji1my5kqjufcshudkzu4xdt5rlqk99j9nwseclkwq",
            });

            expect(result).toBeInstanceOf(WalletData);
        });
    });

    describe("#delegates", () => {
        it("should succeed", async () => {
            await expect(subject.delegates()).resolves.toBeInstanceOf(Collections.WalletDataCollection);
        });
    });
});
