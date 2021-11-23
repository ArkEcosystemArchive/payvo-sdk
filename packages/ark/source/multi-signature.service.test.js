import { assert, loader, test } from "@payvo/sdk-test";
import { IoC, Services, Signatories } from "@payvo/sdk";
import { nock } from "@payvo/sdk-test";

import { createService } from "../test/mocking";
import { MultiSignatureService } from "./multi-signature.service";
import { ClientService } from "./client.service";
import { BindingType } from "./coin.contract";
import { MultiSignatureSigner } from "./multi-signature.signer";
import { KeyPairService } from "./key-pair.service";
import { LedgerService } from "./ledger.service";
import { PublicKeyService } from "./public-key.service";
import { AddressService } from "./address.service";
import { SignedTransactionData } from "./signed-transaction.dto";
import { ConfirmedTransactionData } from "./confirmed-transaction.dto";
import { WalletData } from "./wallet.dto";

let subject;

test.before(async () => {
	nock.disableNetConnect();

	subject = await createService(MultiSignatureService, undefined, (container) => {
		container.constant(IoC.BindingType.Container, container);
		container.singleton(IoC.BindingType.AddressService, AddressService);
		container.singleton(IoC.BindingType.ClientService, ClientService);
		container.constant(IoC.BindingType.DataTransferObjects, {
			SignedTransactionData,
			ConfirmedTransactionData,
			WalletData,
		});
		container.singleton(IoC.BindingType.DataTransferObjectService, Services.AbstractDataTransferObjectService);
		container.singleton(BindingType.MultiSignatureSigner, MultiSignatureSigner);
		container.singleton(IoC.BindingType.KeyPairService, KeyPairService);
		container.constant(IoC.BindingType.LedgerTransportFactory, async () => {});
		container.singleton(IoC.BindingType.LedgerService, LedgerService);
		container.singleton(IoC.BindingType.PublicKeyService, PublicKeyService);
	});
});

test.after.each(() => nock.cleanAll());

let fixtures;

test.before.each(async () => {
	fixtures = loader.json(`test/fixtures/client/multisig-transactions.json`);
});

test("#allWithPendingState", async () => {
	nock.fake(/.+/).post("/").reply(200, fixtures);

	assert.length(await subject.allWithPendingState("DBk4cPYpqp7EBcvkstVDpyX7RQJNHxpMg8"), 3);
});

test("#allWithReadyState", async () => {
	nock.fake(/.+/).post("/").reply(200, fixtures);

	assert.length(await subject.allWithReadyState("DBk4cPYpqp7EBcvkstVDpyX7RQJNHxpMg8"), 3);
});

test("#findById", async () => {
	nock.fake(/.+/).post("/").reply(200, { result: fixtures.result[0] });

	assert.object(await subject.findById("DBk4cPYpqp7EBcvkstVDpyX7RQJNHxpMg8"));
});

test("#broadcast", async () => {
	nock.fake(/.+/)
		.post("/")
		.reply(200, { result: { id: "abc" } })
		.post("/")
		.reply(200, { result: { id: "abc" } });

	await assert.equal(await subject.broadcast({}), { accepted: ["abc"], errors: {}, rejected: [] });
	await assert.equal(await subject.broadcast({ asset: { multiSignature: "123" } }), {
		accepted: ["abc"],
		errors: {},
		rejected: [],
	});
});

test("#addSignature", async () => {
	const mnemonic = "skin fortune security mom coin hurdle click emotion heart brisk exact reason";
	const signatory = new Signatories.Signatory(
		new Signatories.MnemonicSignatory({
			signingKey: mnemonic,
			address: "address",
			publicKey: "02940c966a0b30653fbd102d40be14666bde4d6da5a736422290684cdcac13d7db",
			privateKey: "privateKey",
			options: {
				bip44: {
					account: 0,
				},
			},
		}),
	);

	const transactionData = {
		type: 4,
		typeGroup: 1,
		version: 2,
		signatures: [],
		nonce: "1",
		amount: "0",
		fee: "0",
		senderPublicKey: "02940c966a0b30653fbd102d40be14666bde4d6da5a736422290684cdcac13d7db",
		asset: {
			multiSignature: {
				publicKeys: [
					"02940c966a0b30653fbd102d40be14666bde4d6da5a736422290684cdcac13d7db",
					"034151a3ec46b5670a682b0a63394f863587d1bc97483b1b6c70eb58e7f0aed192",
				],
				min: 2,
			},
		},
		multiSignature: {
			publicKeys: [
				"02940c966a0b30653fbd102d40be14666bde4d6da5a736422290684cdcac13d7db",
				"034151a3ec46b5670a682b0a63394f863587d1bc97483b1b6c70eb58e7f0aed192",
			],
			min: 2,
		},
	};

	assert.equal((await subject.addSignature(transactionData, signatory)).data().signatures, [
		"00be3162093f9fc76273ab208cd0cff1dc9560e1faba6f27f9ffce9a3c593671aa8913c071118f446e27de404ceac9c2188edd8ad9f1a2c8033258f65138bca9a4",
	]);

	assert.equal((await subject.addSignature(transactionData, signatory)).data().signatures, [
		"00be3162093f9fc76273ab208cd0cff1dc9560e1faba6f27f9ffce9a3c593671aa8913c071118f446e27de404ceac9c2188edd8ad9f1a2c8033258f65138bca9a4",
	]);
});

test("#isMultiSignatureRegistrationReady", async () => {
	const transaction = (await createService(SignedTransactionData)).configure("123", { signatures: [] });

	assert.true(subject.isMultiSignatureReady(transaction));
});

test("#needsSignatures", async () => {
	const transaction = (await createService(SignedTransactionData)).configure("123", { signatures: [] });

	assert.false(subject.needsSignatures(transaction));
});

test("#needsAllSignatures", async () => {
	const transaction = (await createService(SignedTransactionData)).configure("123", {
		signatures: [],
		multiSignature: {
			publicKeys: [
				"0301fd417566397113ba8c55de2f093a572744ed1829b37b56a129058000ef7bce",
				"034151a3ec46b5670a682b0a63394f863587d1bc97483b1b6c70eb58e7f0aed192",
			],
			min: 2,
		},
	});

	assert.true(subject.needsAllSignatures(transaction));
});

test("#needsWalletSignature", async () => {
	const transaction = (await createService(SignedTransactionData)).configure("123", { signatures: [] });

	assert.false(subject.needsWalletSignature(transaction, "DBk4cPYpqp7EBcvkstVDpyX7RQJNHxpMg8"));
});

test("#needsFinalSignature", async () => {
	const transaction = (await createService(SignedTransactionData)).configure("123", { signatures: [] });

	assert.true(subject.needsFinalSignature(transaction));
});

test("#remainingSignatureCount", async () => {
	const transaction = (await createService(SignedTransactionData)).configure("123", {
		signatures: [],
		multiSignature: {
			publicKeys: [
				"0301fd417566397113ba8c55de2f093a572744ed1829b37b56a129058000ef7bce",
				"034151a3ec46b5670a682b0a63394f863587d1bc97483b1b6c70eb58e7f0aed192",
			],
			min: 2,
		},
	});

	assert.is(subject.remainingSignatureCount(transaction), 2);
});

test.run();
