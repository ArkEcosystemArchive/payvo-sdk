import { describe } from "@payvo/sdk-test";
import { IoC, Services } from "@payvo/sdk";
import { openTransportReplayer, RecordStore } from "@ledgerhq/hw-transport-mocker";

import { ledger } from "../test/fixtures/ledger";
import { createService } from "../test/mocking";
import { AddressService } from "./address.service.js";
import { ClientService } from "./client.service.js";
import { LedgerService } from "./ledger.service.js";
import { SignedTransactionData } from "./signed-transaction.dto.js";
import { ConfirmedTransactionData } from "./confirmed-transaction.dto.js";
import { WalletData } from "./wallet.dto.js";
import { BindingType } from "./constants.js";

const createMockService = async (record) => {
	const transport = await createService(LedgerService, undefined, (container) => {
		container.constant(IoC.BindingType.Container, container);
		container.constant(BindingType.ApiPromise, {});
		container.constant(BindingType.Keyring, {});
		container.constant(IoC.BindingType.DataTransferObjects, {
			SignedTransactionData,
			ConfirmedTransactionData,
			WalletData,
		});
		container.singleton(IoC.BindingType.DataTransferObjectService, Services.AbstractDataTransferObjectService);
		container.singleton(IoC.BindingType.AddressService, AddressService);
		container.singleton(IoC.BindingType.ClientService, ClientService);
		container.constant(
			IoC.BindingType.LedgerTransportFactory,
			async () => await openTransportReplayer(RecordStore.fromString(record)),
		);
	});

	await transport.connect();

	return transport;
};

describe("disconnect", ({ it, assert }) => {
	it("should pass with a resolved transport closure", async () => {
		const subject = await createMockService("");

		assert.undefined(await subject.disconnect());
	});
});

describe("getVersion", ({ it, assert }) => {
	it("should generate an app version", async () => {
		const polkadot = await createMockService(ledger.appVersion.record);

		assert.is(await polkadot.getVersion(), ledger.appVersion.result);
	});
});

describe("getPublicKey", ({ it, assert }) => {
	it("should generate a publicKey", async () => {
		const polkadot = await createMockService(ledger.publicKey.record);

		assert.is(await polkadot.getPublicKey(ledger.bip44.path), ledger.publicKey.result);
	});
});

describe("signTransaction", ({ it, assert }) => {
	it("should generate output from a transaction", async () => {
		const polkadot = await createMockService(ledger.transaction.record);

		assert.is(
			await polkadot.signTransaction(ledger.bip44.path, Buffer.from(ledger.transaction.payload, "hex")),
			ledger.transaction.result,
		);
	});
});

describe("signMessage", ({ it, assert }) => {
	it("should fail to generate an output from a message", async () => {
		const polkadot = await createMockService("");

		await assert.rejects(() => polkadot.signMessage("", Buffer.alloc(0)));
	});
});
