import "jest-extended";

import { IoC, Services } from "@payvo/sdk";
import { openTransportReplayer, RecordStore } from "@ledgerhq/hw-transport-mocker";

import { ledger } from "../test/fixtures/ledger.js";
import { createService, requireModule } from "../test/mocking.js";
import { AddressService } from "./address.service";
import { ClientService } from "./client.service";
import { LedgerService } from "./ledger.service";
import { SignedTransactionData } from "./signed-transaction.dto";
import { ConfirmedTransactionData } from "./confirmed-transaction.dto";
import { WalletData } from "./wallet.dto";

const createMockService = async (record: string) => {
    const transport = await createService(LedgerService, undefined, (container) => {
        container.constant(IoC.BindingType.Container, container);
        container.singleton(IoC.BindingType.AddressService, AddressService);
        container.singleton(IoC.BindingType.ClientService, ClientService);
        container.constant(IoC.BindingType.DataTransferObjects, {
            SignedTransactionData,
            ConfirmedTransactionData,
            WalletData,
        });
        container.singleton(IoC.BindingType.DataTransferObjectService, Services.AbstractDataTransferObjectService);
        container.constant(
            IoC.BindingType.LedgerTransportFactory,
            async () => await openTransportReplayer(RecordStore.fromString(record)),
        );
    });

    await transport.connect();

    return transport;
};

describe("disconnect", () => {
    it("should pass with a resolved transport closure", async () => {
        const subject = await createMockService("");

        await expect(subject.disconnect()).resolves.toBeUndefined();
    });
});

describe("disconnect", () => {
    it("should pass with a resolved transport closure", async () => {
        const subject = await createMockService("");

        await expect(subject.disconnect()).resolves.toBeUndefined();
    });
});

describe("getVersion", () => {
    it("should pass with an app version", async () => {
        const subject = await createMockService(ledger.appVersion.record);

        await expect(subject.getVersion()).resolves.toBe(ledger.appVersion.result);
    });
});

describe.skip("getPublicKey", () => {
    it("should pass with a compressed publicKey", async () => {
        const subject = await createMockService(ledger.publicKey.record);

        await expect(subject.getPublicKey(ledger.bip44.path)).resolves.toEqual(ledger.publicKey.result);
    });
});

describe.skip("signTransaction", () => {
    it("should pass with a signature", async () => {
        const subject = await createMockService(ledger.transaction.record);

        await expect(
            subject.signTransaction(ledger.bip44.path, Buffer.from(ledger.transaction.payload, "hex")),
        ).resolves.toEqual(ledger.transaction.result);
    });
});

describe("signMessage", () => {
    it("should fail with a 'NotImplemented' error", async () => {
        const subject = await createMockService("");

        await expect(subject.signMessage("", Buffer.alloc(0))).rejects.toThrow();
    });
});
