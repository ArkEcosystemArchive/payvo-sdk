import "jest-extended";

import { IoC, Services } from "@payvo/sdk";
import { openTransportReplayer, RecordStore } from "@ledgerhq/hw-transport-mocker";

import { ledger } from "../test/fixtures/ledger.js";
import { createService, requireModule } from "../test/mocking.js";
import { AddressService } from "./address.service.js";
import { ClientService } from "./client.service.js";
import { LedgerService } from "./ledger.service.js";
import { SignedTransactionData } from "./signed-transaction.dto.js";
import { ConfirmedTransactionData } from "./confirmed-transaction.dto.js";
import { WalletData } from "./wallet.dto.js";

const createMockService = async (record: string) => {
	const transport = await createService(LedgerService, "btc.testnet", (container) => {
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

describe.skip("getExtendedPublicKey", () => {
	it("should pass with for a given path", async () => {
		const subject = await createMockService(ledger.extendedPublicKey.record);

		await expect(subject.getExtendedPublicKey(ledger.extendedPublicKey.path)).resolves.toEqual(
			ledger.extendedPublicKey.result,
		);
	});
});

describe("signMessage", () => {
	it("should pass with an ecdsa signature", async () => {
		const subject = await createMockService(ledger.message.record);

		await expect(
			subject.signMessage(ledger.bip44.path, Buffer.from(ledger.message.payload, "utf-8")),
		).resolves.toEqual(ledger.message.result);
	});
});
