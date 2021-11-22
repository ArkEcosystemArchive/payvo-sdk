import { assert, describe, test } from "@payvo/sdk-test";
import { IoC, Services } from "@payvo/sdk";
import { openTransportReplayer, RecordStore } from "@ledgerhq/hw-transport-mocker";

import { ledger } from "../test/fixtures/ledger";
import { createService } from "../test/mocking";
import { AddressService } from "./address.service";
import { ClientService } from "./client.service";
import { LedgerService } from "./ledger.service";
import { SignedTransactionData } from "./signed-transaction.dto";
import { ConfirmedTransactionData } from "./confirmed-transaction.dto";
import { WalletData } from "./wallet.dto";

const createMockService = async (record, opts) => {
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
			async () => await openTransportReplayer(RecordStore.fromString(record, opts)),
		);
	});

	await transport.connect();

	return transport;
};

describe("disconnect", ({ afterEach, beforeEach, test }) => {
	test("should pass with a resolved transport closure", async () => {
		const subject = await createMockService("");

		assert.undefined(await subject.disconnect());
	});
});

describe("disconnect", ({ afterEach, beforeEach, test }) => {
	test("should pass with a resolved transport closure", async () => {
		const subject = await createMockService("");

		assert.undefined(await subject.disconnect());
	});
});

describe("getVersion", ({ afterEach, beforeEach, test }) => {
	test("should pass with an app version", async () => {
		const subject = await createMockService(ledger.appVersion.record);

		assert.is(await subject.getVersion(), ledger.appVersion.result);
	});
});

describe("getPublicKey", ({ afterEach, beforeEach, test }) => {
	test("should pass with a compressed publicKey", async () => {
		const subject = await createMockService(ledger.publicKey.record);

		assert.is(await subject.getPublicKey(ledger.bip44.path), ledger.publicKey.result);
	});
});

describe("signTransaction", ({ afterEach, beforeEach, test }) => {
	test.skip("should pass with a signature", async () => {
		const subject = await createMockService(ledger.publicKey.record + ledger.transaction.record, {
			autoSkipUnknownApdu: true,
			warning: (log) => console.warn(log),
		});

		assert.true(await subject.getPublicKey(ledger.bip44.path));
		assert.is(
			await subject.signTransaction(ledger.bip44.path, Buffer.from(ledger.transaction.payload)),
			ledger.transaction.result,
		);
	});

	test("should fail with an incorrectly-set path", async () => {
		const subject = await createMockService(ledger.transaction.record);

		await assert.rejects(() => subject.signTransaction(ledger.bip44.path, Buffer.from(ledger.transaction.payload)));
	});
});

describe("signMessage", ({ afterEach, beforeEach, test }) => {
	test("should pass with an ecdsa signature", async () => {
		const subject = await createMockService("");

		await assert.rejects(() => subject.signMessage("", Buffer.alloc(0)));
	});
});

test.run();
