import { IoC, Services, Signatories } from "@payvo/sdk";
import { BigNumber } from "@payvo/sdk-helpers";
import { describe, loader } from "@payvo/sdk-test";

import { identity } from "../test/fixtures/identity";
import { createService } from "../test/mocking";
import { AddressService } from "./address.service.js";
import { ClientService } from "./client.service.js";
import { ConfirmedTransactionData } from "./confirmed-transaction.dto.js";
import { FeeService } from "./fee.service.js";
import { KeyPairService } from "./key-pair.service.js";
import { LedgerService } from "./ledger.service.js";
import { MultiSignatureService } from "./multi-signature.service.js";
import { PublicKeyService } from "./public-key.service.js";
import { SignedTransactionData } from "./signed-transaction.dto.js";
import { TransactionService } from "./transaction.service.js";
import { WalletData } from "./wallet.dto.js";

describe("#all", async ({ beforeEach, it, assert }) => {
	beforeEach(async (context) => {
		context.subject = await createService(FeeService, "lsk.testnet", (container) => {
			container.constant(IoC.BindingType.Container, container);
			container.constant(IoC.BindingType.DataTransferObjects, {
				ConfirmedTransactionData,
				SignedTransactionData,
				WalletData,
			});
			container.singleton(IoC.BindingType.DataTransferObjectService, Services.AbstractDataTransferObjectService);
			container.singleton(IoC.BindingType.AddressService, AddressService);
			container.singleton(IoC.BindingType.ClientService, ClientService);
			container.singleton(IoC.BindingType.KeyPairService, KeyPairService);
			container.constant(IoC.BindingType.LedgerTransportFactory, async () => {});
			container.singleton(IoC.BindingType.LedgerService, LedgerService);
			container.singleton(IoC.BindingType.PublicKeyService, PublicKeyService);
			container.singleton(IoC.BindingType.MultiSignatureService, MultiSignatureService);
		});
	});

	it("should succeed", async (context) => {
		const result = await context.subject.all();

		assert.containKeys(result, [
			"transfer",
			"secondSignature",
			"delegateRegistration",
			"vote",
			"multiSignature",
			"ipfs",
			"multiPayment",
			"delegateResignation",
		]);

		assert.is(result.transfer.min.toString(), "10000000");
		assert.is(result.transfer.avg.toString(), "10000000");
		assert.is(result.transfer.max.toString(), "10000000");
		assert.is(result.transfer.static.toString(), "10000000");
	});
});

describe("#calculate", ({ beforeEach, it, assert, nock }) => {
	let service;

	beforeEach(async (context) => {
		nock.fake(/.+/).get("/api/v2/fees").reply(200, loader.json(`test/fixtures/client/fees.json`)).persist();

		context.subject = await createService(FeeService, "lsk.testnet", (container) => {
			container.constant(IoC.BindingType.Container, container);
			container.constant(IoC.BindingType.DataTransferObjects, {
				ConfirmedTransactionData,
				SignedTransactionData,
				WalletData,
			});
			container.singleton(IoC.BindingType.DataTransferObjectService, Services.AbstractDataTransferObjectService);
			container.singleton(IoC.BindingType.AddressService, AddressService);
			container.singleton(IoC.BindingType.ClientService, ClientService);
			container.singleton(IoC.BindingType.KeyPairService, KeyPairService);
			container.constant(IoC.BindingType.LedgerTransportFactory, async () => {});
			container.singleton(IoC.BindingType.LedgerService, LedgerService);
			container.singleton(IoC.BindingType.PublicKeyService, PublicKeyService);
			container.singleton(IoC.BindingType.MultiSignatureService, MultiSignatureService);
		});

		service = await createService(TransactionService, "lsk.testnet", (container) => {
			container.constant(IoC.BindingType.Container, container);
			container.constant(IoC.BindingType.DataTransferObjects, {
				ConfirmedTransactionData,
				SignedTransactionData,
				WalletData,
			});
			container.singleton(IoC.BindingType.DataTransferObjectService, Services.AbstractDataTransferObjectService);
			container.singleton(IoC.BindingType.AddressService, AddressService);
			container.singleton(IoC.BindingType.ClientService, ClientService);
			container.singleton(IoC.BindingType.FeeService, FeeService);
			container.singleton(IoC.BindingType.KeyPairService, KeyPairService);
			container.constant(IoC.BindingType.LedgerTransportFactory, async () => {});
			container.singleton(IoC.BindingType.LedgerService, LedgerService);
			container.singleton(IoC.BindingType.PublicKeyService, PublicKeyService);
			container.singleton(IoC.BindingType.MultiSignatureService, MultiSignatureService);
		});
	});

	it("should calculate fee for transfer", async (context) => {
		const transaction = await service.transfer({
			data: {
				amount: 1,
				to: identity.address,
			},
			signatory: new Signatories.Signatory(
				new Signatories.MnemonicSignatory({
					address: identity.address,
					privateKey: identity.privateKey,
					publicKey: identity.publicKey,
					signingKey: identity.mnemonic,
				}),
			),
		});

		const slow = await context.subject.calculate(transaction, { priority: "slow" });
		const average = await context.subject.calculate(transaction, { priority: "average" });
		const fast = await context.subject.calculate(transaction, { priority: "fast" });

		assert.number(slow.toHuman());
		assert.is(slow.toHuman(), 0.001_41);
		assert.number(average.toHuman());
		assert.is(average.toHuman(), 0.001_41);
		assert.number(fast.toHuman());
		assert.is(fast.toHuman(), 0.001_41);
	});

	it("should calculate fee for delegateRegistration", async (context) => {
		const transaction = await service.delegateRegistration({
			data: {
				username: "username",
			},
			signatory: new Signatories.Signatory(
				new Signatories.MnemonicSignatory({
					address: identity.address,
					privateKey: identity.privateKey,
					publicKey: identity.publicKey,
					signingKey: identity.mnemonic,
				}),
			),
		});

		const slow = await context.subject.calculate(transaction, { priority: "slow" });
		const average = await context.subject.calculate(transaction, { priority: "average" });
		const fast = await context.subject.calculate(transaction, { priority: "fast" });

		assert.number(slow.toHuman());
		assert.is(slow.toHuman(), 10.001_24);
		assert.number(average.toHuman());
		assert.is(average.toHuman(), 10.001_24);
		assert.number(fast.toHuman());
		assert.is(fast.toHuman(), 10.001_24);
	});

	// it("should calculate fee for multiSignature", async (context) => {
	// 	nock.fake(/.+/)
	// 		.get("/api/v2/accounts?address=lskp4agpmjwgw549xdrhgdt6dfwqrpvohgbkhyt8p")
	// 		.reply(200, loader.json(`test/fixtures/musig/lskp4agpmjwgw549xdrhgdt6dfwqrpvohgbkhyt8p.json`))
	// 		.get("/api/v2/accounts?publicKey=ac574896c846b59477a9115b952563938c48d0096b84846c0b634a621e1774ed")
	// 		.reply(200, loader.json(`test/fixtures/musig/lskp4agpmjwgw549xdrhgdt6dfwqrpvohgbkhyt8p.json`))
	// 		.get("/api/v2/accounts?address=lskn2de9mo9z3g9jvbpj4yjn84vrvjzcn5c5mon7a")
	// 		.reply(200, loader.json(`test/fixtures/musig/lskn2de9mo9z3g9jvbpj4yjn84vrvjzcn5c5mon7a.json`))
	// 		.persist();

	// 	const wallet1 = {
	// 		address: "lskp4agpmjwgw549xdrhgdt6dfwqrpvohgbkhyt8p",
	// 		publicKey: "ac574896c846b59477a9115b952563938c48d0096b84846c0b634a621e1774ed",
	// 		signingKey: "foil broccoli rare pony man umbrella visual cram wing rotate fall never",
	// 	};

	// 	const wallet2 = {
	// 		address: "lskn2de9mo9z3g9jvbpj4yjn84vrvjzcn5c5mon7a",
	// 		publicKey: "5f7f98c50575a4a7e70a46ff35b72f4fe2a1ad3bc9a918b692d132d9c556bdf0",
	// 		signingKey: "penalty name learn right reason inherit peace mango guitar heart nature love",
	// 	};

	// 	const transaction = await service.multiSignature({
	// 		data: {
	// 			mandatoryKeys: [wallet1.publicKey, wallet2.publicKey],
	// 			numberOfSignatures: 2,
	// 			optionalKeys: [],
	// 		},
	// 		signatory: new Signatories.Signatory(
	// 			new Signatories.MnemonicSignatory({
	// 				address: wallet1.address,
	// 				privateKey: identity.privateKey,
	// 				publicKey: wallet1.publicKey,
	// 				signingKey: wallet1.signingKey,
	// 			}),
	// 		),
	// 	});

	// 	const slow = await context.subject.calculate(transaction, { priority: "slow" });
	// 	const average = await context.subject.calculate(transaction, { priority: "average" });
	// 	const fast = await context.subject.calculate(transaction, { priority: "fast" });

	// 	assert.number(slow.toHuman());
	// 	assert.is(slow.toHuman(), 0.003_14);
	// 	assert.number(average.toHuman());
	// 	assert.is(average.toHuman(), 0.003_14);
	// 	assert.number(fast.toHuman());
	// 	assert.is(fast.toHuman(), 0.003_14);
	// });

	// it("should calculate fee for multiSignature with 5 participants", async (context) => {
	// 	nock.fake(/.+/)
	// 		.get("/api/v2/accounts?address=lskp4agpmjwgw549xdrhgdt6dfwqrpvohgbkhyt8p")
	// 		.reply(200, loader.json(`test/fixtures/musig/lskp4agpmjwgw549xdrhgdt6dfwqrpvohgbkhyt8p.json`))
	// 		.get("/api/v2/accounts?publicKey=ac574896c846b59477a9115b952563938c48d0096b84846c0b634a621e1774ed")
	// 		.reply(200, loader.json(`test/fixtures/musig/lskp4agpmjwgw549xdrhgdt6dfwqrpvohgbkhyt8p.json`))
	// 		.get("/api/v2/accounts?address=lskn2de9mo9z3g9jvbpj4yjn84vrvjzcn5c5mon7a")
	// 		.reply(200, loader.json(`test/fixtures/musig/lskn2de9mo9z3g9jvbpj4yjn84vrvjzcn5c5mon7a.json`))
	// 		.persist();

	// 	const wallet1 = {
	// 		address: "lskp4agpmjwgw549xdrhgdt6dfwqrpvohgbkhyt8p",
	// 		publicKey: "ac574896c846b59477a9115b952563938c48d0096b84846c0b634a621e1774ed",
	// 		signingKey: "foil broccoli rare pony man umbrella visual cram wing rotate fall never",
	// 	};

	// 	const wallet2 = {
	// 		address: "lskn2de9mo9z3g9jvbpj4yjn84vrvjzcn5c5mon7a",
	// 		publicKey: "5f7f98c50575a4a7e70a46ff35b72f4fe2a1ad3bc9a918b692d132d9c556bdf0",
	// 		signingKey: "penalty name learn right reason inherit peace mango guitar heart nature love",
	// 	};

	// 	const transaction = await service.multiSignature({
	// 		data: {
	// 			mandatoryKeys: [
	// 				wallet1.publicKey,
	// 				wallet2.publicKey,
	// 				wallet2.publicKey,
	// 				wallet2.publicKey,
	// 				wallet2.publicKey,
	// 			],
	// 			numberOfSignatures: 2,
	// 			optionalKeys: [],
	// 		},
	// 		signatory: new Signatories.Signatory(
	// 			new Signatories.MnemonicSignatory({
	// 				address: wallet1.address,
	// 				privateKey: identity.privateKey,
	// 				publicKey: wallet1.publicKey,
	// 				signingKey: wallet1.signingKey,
	// 			}),
	// 		),
	// 	});

	// 	const slow = await context.subject.calculate(transaction, { priority: "slow" });
	// 	const average = await context.subject.calculate(transaction, { priority: "average" });
	// 	const fast = await context.subject.calculate(transaction, { priority: "fast" });

	// 	assert.number(slow.toHuman());
	// 	assert.is(slow.toHuman(), 0.006_15);
	// 	assert.number(average.toHuman());
	// 	assert.is(average.toHuman(), 0.006_15);
	// 	assert.number(fast.toHuman());
	// 	assert.is(fast.toHuman(), 0.006_15);
	// });

	it("should calculate fee for vote", async (context) => {
		const transaction = await service.vote({
			data: {
				votes: [
					{
						amount: 10,
						id: "lskp4agpmjwgw549xdrhgdt6dfwqrpvohgbkhyt8p",
					},
				],
			},
			signatory: new Signatories.Signatory(
				new Signatories.MnemonicSignatory({
					address: identity.address,
					privateKey: identity.privateKey,
					publicKey: identity.publicKey,
					signingKey: identity.mnemonic,
				}),
			),
		});

		const slow = await context.subject.calculate(transaction, { priority: "slow" });
		const average = await context.subject.calculate(transaction, { priority: "average" });
		const fast = await context.subject.calculate(transaction, { priority: "fast" });

		assert.number(slow.toHuman());
		assert.is(slow.toHuman(), 0.001_42);
		assert.number(average.toHuman());
		assert.is(average.toHuman(), 0.001_42);
		assert.number(fast.toHuman());
		assert.is(fast.toHuman(), 0.001_42);
	});

	it("should calculate fee for unlockToken", async (context) => {
		const transaction = await service.unlockToken({
			data: {
				objects: [
					{
						address: "lskp4agpmjwgw549xdrhgdt6dfwqrpvohgbkhyt8p",
						amount: BigNumber.make(1e8),
						height: "14548929",
					},
				],
			},
			signatory: new Signatories.Signatory(
				new Signatories.MnemonicSignatory({
					address: identity.address,
					privateKey: identity.privateKey,
					publicKey: identity.publicKey,
					signingKey: identity.mnemonic,
				}),
			),
		});

		const slow = await context.subject.calculate(transaction, { priority: "slow" });
		const average = await context.subject.calculate(transaction, { priority: "average" });
		const fast = await context.subject.calculate(transaction, { priority: "fast" });

		assert.number(slow.toHuman());
		assert.is(slow.toHuman(), 0.001_46);
		assert.number(average.toHuman());
		assert.is(average.toHuman(), 0.001_46);
		assert.number(fast.toHuman());
		assert.is(fast.toHuman(), 0.001_46);
	});

	it("should throw error on unrecognized transaction type", async (context) => {
		await assert.rejects(
			() => context.subject.calculate({ asset: {}, assetID: 10, moduleID: 10 }),
			"Failed to determine module and asset ID.",
		);
	});
});
