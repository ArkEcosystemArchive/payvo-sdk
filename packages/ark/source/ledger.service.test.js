import { assert, describe, loader, mockery, test } from "@payvo/sdk-test";

import { Address } from "@arkecosystem/crypto-identities";
import { IoC, Services } from "@payvo/sdk";
import { openTransportReplayer, RecordStore } from "@ledgerhq/hw-transport-mocker";
import nock from "nock";

import { ledger } from "../test/fixtures/ledger";
import { createService } from "../test/mocking";
import { AddressService } from "./address.service";
import { ClientService } from "./client.service";
import { LedgerService } from "./ledger.service";
import { SignedTransactionData } from "./signed-transaction.dto";
import { ConfirmedTransactionData } from "./confirmed-transaction.dto";
import { WalletData } from "./wallet.dto";

const createMockService = async (record) => {
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

test("should pass with a resolved transport closure", async () => {
	const ark = await createMockService("");

	assert.undefined(await ark.disconnect());
});

test("should pass with an app version", async () => {
	const ark = await createMockService(ledger.appVersion.record);

	assert.is(await ark.getVersion(), ledger.appVersion.result);
});

test("should pass with a compressed publicKey", async () => {
	const ark = await createMockService(ledger.publicKey.record);

	assert.is(await ark.getPublicKey(ledger.bip44.path), ledger.publicKey.result);
});

test("should pass with a compressed publicKey", async () => {
	const ark = await createMockService(ledger.publicKey.record);

	await assert.rejects(() => ark.getExtendedPublicKey(ledger.bip44.path));
});

test("should pass with a schnorr signature", async () => {
	const ark = await createMockService(ledger.transaction.schnorr.record);

	assert.is(
		await ark.signTransaction(ledger.bip44.path, Buffer.from(ledger.transaction.schnorr.payload, "hex")),
		ledger.transaction.schnorr.result,
	);
});

test("should pass with a schnorr signature", async () => {
	const ark = await createMockService(ledger.message.schnorr.record);

	assert.is(
		await ark.signMessage(ledger.bip44.path, Buffer.from(ledger.message.schnorr.payload, "hex")),
		ledger.message.schnorr.result,
	);
});

describe("scan", (suite) => {
	suite.before(() => nock.disableNetConnect());

	suite.after.each(() => nock.cleanAll());

	suite("should scan for legacy wallets", async () => {
		nock(/.+/)
			.get(
				"/api/wallets?address=D9xJncW4ECUSJQWeLP7wncxhDTvNeg2HNK%2CDFgggtreMXQNQKnxHddvkaPHcQbRdK3jyJ%2CDFr1CR81idSmfgQ19KXe4M6keqUEAuU8kF%2CDTYiNbvTKveMtJC8KPPdBrgRWxfPxGp1WV%2CDJyGFrZv4MYKrTMcjzEyhZzdTAJju2Rcjr",
			)
			.reply(200, loader.json(`test/fixtures/client/wallets-page-0.json`))
			.get(
				"/api/wallets?address=DHnV81YdhYDkwCLD8pkxiXh53pGFw435GS%2CDGhLzafzQpBYjDAWP41U4cx5CKZ5BdSnS3%2CDLVXZyKFxLLdyuEtJRUvFoKcorSrnBnq48%2CDFZAfJ1i1LsvhkUk76Piw4v7oTgq12pX9Z%2CDGfNF9bGPss6YKLEqK5gwr4C1M7vgfenzn",
			)
			.reply(200, loader.json(`test/fixtures/client/wallets-page-1.json`));

		const ark = await createMockService(ledger.wallets.record);

		const walletData = await ark.scan({ useLegacy: true });
		assert.length(Object.keys(walletData), 2);
		assert.object(walletData);

		for (const wallet of Object.values(walletData)) {
			const publicKey = wallet.publicKey();

			if (publicKey) {
				assert.is(Address.fromPublicKey(publicKey, { pubKeyHash: 30 }), wallet.address());
			}

			assert.object(wallet.toObject());
		}
	});

	suite("should scan for new wallets", async () => {
		nock(/.+/)
			.get("/api/wallets")
			.query(true)
			.reply(200, loader.json(`test/fixtures/client/wallets-page-0.json`))
			.get("/api/wallets")
			.query(true)
			.reply(200, loader.json(`test/fixtures/client/wallets-page-1.json`));

		const ark = await createMockService(ledger.wallets.record);

		mockery(ark, "getExtendedPublicKey").mockResolvedValue(
			"030fde54605c5d53436217a2849d276376d0b0f12c71219cd62b0a4539e1e75acd",
		);

		const walletData = await ark.scan({ useLegacy: false, startPath: "m/44'/0'/0'/0/0" });
		assert.length(Object.keys(walletData), 1);
		assert.object(walletData);

		for (const wallet of Object.values(walletData)) {
			const publicKey = wallet.publicKey();

			if (publicKey) {
				assert.is(Address.fromPublicKey(publicKey, { pubKeyHash: 30 }), wallet.address());
			}

			assert.object(wallet.toObject());
		}
	});
});

test("#isNanoS", async () => {
	const subject = await createMockService(ledger.message.schnorr.record);

	assert.boolean(await subject.isNanoS());
});

test("#isNanoX", async () => {
	const subject = await createMockService(ledger.message.schnorr.record);

	assert.boolean(await subject.isNanoX());
});

test.run();
