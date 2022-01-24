import { IoC, Services, Signatories } from "@payvo/sdk";
import { BigNumber } from "@payvo/sdk-helpers";
import { describe } from "@payvo/sdk-test";

import { createService } from "../test/mocking.js";
import { AddressService } from "./address.service.js";
import { ClientService } from "./client.service.js";
import { ConfirmedTransactionData } from "./confirmed-transaction.dto.js";
import { KeyPairService } from "./key-pair.service.js";
import { LedgerService } from "./ledger.service.js";
import { MultiSignatureService } from "./multi-signature.service.js";
import { MultiSignatureSigner } from "./multi-signature.signer.js";
import { PublicKeyService } from "./public-key.service.js";
import { SignedTransactionData } from "./signed-transaction.dto.js";
import { WalletData } from "./wallet.dto.js";

describe("MultiSignatureService", async ({ assert, nock, beforeAll, beforeEach, it, loader }) => {
	beforeAll(async (context) => {
		context.subject = await createService(MultiSignatureService, undefined, (container) => {
			container.constant(IoC.BindingType.Container, container);
			container.constant(IoC.BindingType.DataTransferObjects, {
				ConfirmedTransactionData,
				SignedTransactionData,
				WalletData,
			});
			container.singleton(IoC.BindingType.DataTransferObjectService, Services.AbstractDataTransferObjectService);
			container.singleton(IoC.BindingType.AddressService, AddressService);
			container.singleton(IoC.BindingType.ClientService, ClientService);
			container.factory(MultiSignatureSigner);
			container.singleton(IoC.BindingType.KeyPairService, KeyPairService);
			container.constant(IoC.BindingType.LedgerTransportFactory, async () => {});
			container.singleton(IoC.BindingType.LedgerService, LedgerService);
			container.singleton(IoC.BindingType.PublicKeyService, PublicKeyService);
		});
	});

	beforeEach(async (context) => {
		context.fixtures = loader.json(`test/fixtures/client/multisig-transactions.json`);
	});

	it("should list all all transaction With a PendingState", async (context) => {
		nock.fake(/.+/).post("/").reply(200, context.fixtures);

		assert.length(await context.subject.allWithPendingState("DBk4cPYpqp7EBcvkstVDpyX7RQJNHxpMg8"), 3);
	});

	it("should list all all transaction With a ReadyState", async (context) => {
		nock.fake(/.+/).post("/").reply(200, context.fixtures);

		assert.length(await context.subject.allWithReadyState("DBk4cPYpqp7EBcvkstVDpyX7RQJNHxpMg8"), 3);
	});

	it("should find a transaction by its ID", async (context) => {
		nock.fake(/.+/).post("/").reply(200, { result: context.fixtures.result[0] });

		assert.object(await context.subject.findById("DBk4cPYpqp7EBcvkstVDpyX7RQJNHxpMg8"));
	});

	it("should broadcast a transaction", async (context) => {
		nock.fake(/.+/)
			.post("/")
			.reply(200, { result: { id: "abc" } })
			.post("/")
			.reply(200, { result: { id: "abc" } });

		await assert.equal(await context.subject.broadcast({}), { accepted: ["abc"], errors: {}, rejected: [] });
		await assert.equal(await context.subject.broadcast({ asset: { multiSignature: "123" } }), {
			accepted: ["abc"],
			errors: {},
			rejected: [],
		});
	});

	it("should add a signature", async (context) => {
		const mnemonic = "skin fortune security mom coin hurdle click emotion heart brisk exact reason";
		const signatory = new Signatories.Signatory(
			new Signatories.MnemonicSignatory({
				address: "address",
				options: {
					bip44: {
						account: 0,
					},
				},
				privateKey: "privateKey",
				publicKey: "02940c966a0b30653fbd102d40be14666bde4d6da5a736422290684cdcac13d7db",
				signingKey: mnemonic,
			}),
		);

		const transactionData = {
			amount: new BigNumber("0"),
			asset: {
				multiSignature: {
					min: 2,
					publicKeys: [
						"02940c966a0b30653fbd102d40be14666bde4d6da5a736422290684cdcac13d7db",
						"034151a3ec46b5670a682b0a63394f863587d1bc97483b1b6c70eb58e7f0aed192",
					],
				},
			},
			fee: new BigNumber("0"),
			multiSignature: {
				min: 2,
				publicKeys: [
					"02940c966a0b30653fbd102d40be14666bde4d6da5a736422290684cdcac13d7db",
					"034151a3ec46b5670a682b0a63394f863587d1bc97483b1b6c70eb58e7f0aed192",
				],
			},
			nonce: new BigNumber("1"),
			senderPublicKey: "02940c966a0b30653fbd102d40be14666bde4d6da5a736422290684cdcac13d7db",
			signatures: [],
			type: 4,
			typeGroup: 1,
			version: 2,
		};

		assert.equal((await context.subject.addSignature(transactionData, signatory)).data().signatures, [
			"00be3162093f9fc76273ab208cd0cff1dc9560e1faba6f27f9ffce9a3c593671aa8913c071118f446e27de404ceac9c2188edd8ad9f1a2c8033258f65138bca9a4",
		]);

		assert.equal((await context.subject.addSignature(transactionData, signatory)).data().signatures, [
			"00be3162093f9fc76273ab208cd0cff1dc9560e1faba6f27f9ffce9a3c593671aa8913c071118f446e27de404ceac9c2188edd8ad9f1a2c8033258f65138bca9a4",
		]);
	});

	it("should determine if the multi-signature registration is ready", async (context) => {
		const transaction = (await createService(SignedTransactionData)).configure("123", { signatures: [] });

		assert.true(context.subject.isMultiSignatureReady(transaction));
	});

	it("should determine if it needs any signatures", async (context) => {
		const transaction = (await createService(SignedTransactionData)).configure("123", { signatures: [] });

		assert.false(context.subject.needsSignatures(transaction));
	});

	it("should determine if it needs all signatures", async (context) => {
		const transaction = (await createService(SignedTransactionData)).configure("123", {
			multiSignature: {
				min: 2,
				publicKeys: [
					"0301fd417566397113ba8c55de2f093a572744ed1829b37b56a129058000ef7bce",
					"034151a3ec46b5670a682b0a63394f863587d1bc97483b1b6c70eb58e7f0aed192",
				],
			},
			signatures: [],
		});

		assert.true(context.subject.needsAllSignatures(transaction));
	});

	it("should determine if it needs the signature of a specific wallet", async (context) => {
		const transaction = (await createService(SignedTransactionData)).configure("123", { signatures: [] });

		assert.false(context.subject.needsWalletSignature(transaction, "DBk4cPYpqp7EBcvkstVDpyX7RQJNHxpMg8"));
	});

	it("should determine if it needs the final signature by the initiator", async (context) => {
		const transaction = (await createService(SignedTransactionData)).configure("123", { signatures: [] });

		assert.true(context.subject.needsFinalSignature(transaction));
	});

	it("should determine the remaining signature count", async (context) => {
		const transaction = (await createService(SignedTransactionData)).configure("123", {
			multiSignature: {
				min: 2,
				publicKeys: [
					"0301fd417566397113ba8c55de2f093a572744ed1829b37b56a129058000ef7bce",
					"034151a3ec46b5670a682b0a63394f863587d1bc97483b1b6c70eb58e7f0aed192",
				],
			},
			signatures: [],
		});

		assert.is(context.subject.remainingSignatureCount(transaction), 2);
	});
});
