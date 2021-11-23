import { assert, describe, loader, test } from "@payvo/sdk-test";
import { IoC, Services, Signatories, Test } from "@payvo/sdk";
import {nock} from "@payvo/sdk-test";

import { createService } from "../test/mocking";
import { identity } from "../test/fixtures/identity";
import { FeeService } from "./fee.service";
import { AddressService } from "./address.service";
import { ClientService } from "./client.service";
import { KeyPairService } from "./key-pair.service";
import { LedgerService } from "./ledger.service";
import { PublicKeyService } from "./public-key.service";
import { MultiSignatureService } from "./multi-signature.service";
import { TransactionSerializer } from "./transaction.serializer";
import { BindingType } from "./coin.contract";
import { AssetSerializer } from "./asset.serializer";
import { TransactionService } from "./transaction.service";
import { BigNumber } from "@payvo/sdk-helpers";
import { SignedTransactionData } from "./signed-transaction.dto";
import { ConfirmedTransactionData } from "./confirmed-transaction.dto";
import { WalletData } from "./wallet.dto";

let subject;

test.before(async () => {
	nock.disableNetConnect();
});

test.before.each(async () => {
	subject = await createService(FeeService, "lsk.testnet", (container) => {
		container.constant(IoC.BindingType.Container, container);
		container.singleton(IoC.BindingType.AddressService, AddressService);
		container.singleton(IoC.BindingType.ClientService, ClientService);
		container.constant(IoC.BindingType.DataTransferObjects, {
			SignedTransactionData,
			ConfirmedTransactionData,
			WalletData,
		});
		container.singleton(IoC.BindingType.DataTransferObjectService, Services.AbstractDataTransferObjectService);
		container.singleton(IoC.BindingType.KeyPairService, KeyPairService);
		container.constant(IoC.BindingType.LedgerTransportFactory, async () => {});
		container.singleton(IoC.BindingType.LedgerService, LedgerService);
		container.singleton(IoC.BindingType.PublicKeyService, PublicKeyService);
		container.singleton(IoC.BindingType.MultiSignatureService, MultiSignatureService);
		container.singleton(BindingType.AssetSerializer, AssetSerializer);
		container.singleton(BindingType.TransactionSerializer, TransactionSerializer);
	});
});

test("#all should succeed", async () => {
	const result = await subject.all();

	assert.containKeys(result, [
		"transfer",
		"secondSignature",
		"delegateRegistration",
		"vote",
		"multiSignature",
		"ipfs",
		"multiPayment",
		"delegateResignation",
		"htlcLock",
		"htlcClaim",
		"htlcRefund",
	]);

	assert.is(result.transfer.min.toString(), "10000000");
	assert.is(result.transfer.avg.toString(), "10000000");
	assert.is(result.transfer.max.toString(), "10000000");
	assert.is(result.transfer.static.toString(), "10000000");
});

describe("#calculate", ({ beforeEach, test }) => {
	let service;

	beforeEach(async () => {
		nock.fake(/.+/).get("/api/v2/fees").reply(200, loader.json(`test/fixtures/client/fees.json`)).persist();

		subject = await createService(FeeService, "lsk.testnet", (container) => {
			container.constant(IoC.BindingType.Container, container);
			container.singleton(IoC.BindingType.AddressService, AddressService);
			container.singleton(IoC.BindingType.ClientService, ClientService);
			container.constant(IoC.BindingType.DataTransferObjects, {
				SignedTransactionData,
				ConfirmedTransactionData,
				WalletData,
			});
			container.singleton(IoC.BindingType.DataTransferObjectService, Services.AbstractDataTransferObjectService);
			container.singleton(IoC.BindingType.KeyPairService, KeyPairService);
			container.constant(IoC.BindingType.LedgerTransportFactory, async () => {});
			container.singleton(IoC.BindingType.LedgerService, LedgerService);
			container.singleton(IoC.BindingType.PublicKeyService, PublicKeyService);
			container.singleton(IoC.BindingType.MultiSignatureService, MultiSignatureService);
			container.singleton(BindingType.AssetSerializer, AssetSerializer);
			container.singleton(BindingType.TransactionSerializer, TransactionSerializer);
		});

		service = await createService(TransactionService, "lsk.testnet", (container) => {
			container.constant(IoC.BindingType.Container, container);
			container.singleton(IoC.BindingType.AddressService, AddressService);
			container.singleton(IoC.BindingType.ClientService, ClientService);
			container.singleton(IoC.BindingType.FeeService, FeeService);
			container.constant(IoC.BindingType.DataTransferObjects, {
				SignedTransactionData,
				ConfirmedTransactionData,
				WalletData,
			});
			container.singleton(IoC.BindingType.DataTransferObjectService, Services.AbstractDataTransferObjectService);
			container.singleton(IoC.BindingType.KeyPairService, KeyPairService);
			container.constant(IoC.BindingType.LedgerTransportFactory, async () => {});
			container.singleton(IoC.BindingType.LedgerService, LedgerService);
			container.singleton(IoC.BindingType.PublicKeyService, PublicKeyService);
			container.singleton(IoC.BindingType.MultiSignatureService, MultiSignatureService);
			container.singleton(BindingType.AssetSerializer, AssetSerializer);
			container.singleton(BindingType.TransactionSerializer, TransactionSerializer);
		});
	});

	test("transfer", async () => {
		const transaction = await service.transfer({
			signatory: new Signatories.Signatory(
				new Signatories.MnemonicSignatory({
					signingKey: identity.mnemonic,
					address: identity.address,
					publicKey: identity.publicKey,
					privateKey: identity.privateKey,
				}),
			),
			data: {
				amount: 1,
				to: identity.address,
			},
		});

		const slow = await subject.calculate(transaction, { priority: "slow" });
		const average = await subject.calculate(transaction, { priority: "average" });
		const fast = await subject.calculate(transaction, { priority: "fast" });

		assert.number(slow.toHuman());
		assert.is(slow.toHuman(), 0.00141);
		assert.number(average.toHuman());
		assert.is(average.toHuman(), 0.00141);
		assert.number(fast.toHuman());
		assert.is(fast.toHuman(), 0.00141);
	});

	test("delegateRegistration", async () => {
		const transaction = await service.delegateRegistration({
			signatory: new Signatories.Signatory(
				new Signatories.MnemonicSignatory({
					signingKey: identity.mnemonic,
					address: identity.address,
					publicKey: identity.publicKey,
					privateKey: identity.privateKey,
				}),
			),
			data: {
				username: "username",
			},
		});

		const slow = await subject.calculate(transaction, { priority: "slow" });
		const average = await subject.calculate(transaction, { priority: "average" });
		const fast = await subject.calculate(transaction, { priority: "fast" });

		assert.number(slow.toHuman());
		assert.is(slow.toHuman(), 10.00124);
		assert.number(average.toHuman());
		assert.is(average.toHuman(), 10.00124);
		assert.number(fast.toHuman());
		assert.is(fast.toHuman(), 10.00124);
	});

	test("multiSignature", async () => {
		nock.fake(/.+/)
			.get("/api/v2/accounts?address=lskp4agpmjwgw549xdrhgdt6dfwqrpvohgbkhyt8p")
			.reply(200, loader.json(`test/fixtures/musig/lskp4agpmjwgw549xdrhgdt6dfwqrpvohgbkhyt8p.json`))
			.get("/api/v2/accounts?publicKey=ac574896c846b59477a9115b952563938c48d0096b84846c0b634a621e1774ed")
			.reply(200, loader.json(`test/fixtures/musig/lskp4agpmjwgw549xdrhgdt6dfwqrpvohgbkhyt8p.json`))
			.get("/api/v2/accounts?address=lskn2de9mo9z3g9jvbpj4yjn84vrvjzcn5c5mon7a")
			.reply(200, loader.json(`test/fixtures/musig/lskn2de9mo9z3g9jvbpj4yjn84vrvjzcn5c5mon7a.json`))
			.persist();

		const wallet1 = {
			signingKey: "foil broccoli rare pony man umbrella visual cram wing rotate fall never",
			address: "lskp4agpmjwgw549xdrhgdt6dfwqrpvohgbkhyt8p",
			publicKey: "ac574896c846b59477a9115b952563938c48d0096b84846c0b634a621e1774ed",
		};

		const wallet2 = {
			signingKey: "penalty name learn right reason inherit peace mango guitar heart nature love",
			address: "lskn2de9mo9z3g9jvbpj4yjn84vrvjzcn5c5mon7a",
			publicKey: "5f7f98c50575a4a7e70a46ff35b72f4fe2a1ad3bc9a918b692d132d9c556bdf0",
		};

		const transaction = await service.multiSignature({
			signatory: new Signatories.Signatory(
				new Signatories.MnemonicSignatory({
					signingKey: wallet1.signingKey,
					address: wallet1.address,
					publicKey: wallet1.publicKey,
					privateKey: identity.privateKey,
				}),
			),
			data: {
				numberOfSignatures: 2,
				mandatoryKeys: [wallet1.publicKey, wallet2.publicKey],
				optionalKeys: [],
			},
		});

		const slow = await subject.calculate(transaction, { priority: "slow" });
		const average = await subject.calculate(transaction, { priority: "average" });
		const fast = await subject.calculate(transaction, { priority: "fast" });

		assert.number(slow.toHuman());
		assert.is(slow.toHuman(), 0.00314);
		assert.number(average.toHuman());
		assert.is(average.toHuman(), 0.00314);
		assert.number(fast.toHuman());
		assert.is(fast.toHuman(), 0.00314);
	});

	test("multiSignature with 5 participants", async () => {
		nock.fake(/.+/)
			.get("/api/v2/accounts?address=lskp4agpmjwgw549xdrhgdt6dfwqrpvohgbkhyt8p")
			.reply(200, loader.json(`test/fixtures/musig/lskp4agpmjwgw549xdrhgdt6dfwqrpvohgbkhyt8p.json`))
			.get("/api/v2/accounts?publicKey=ac574896c846b59477a9115b952563938c48d0096b84846c0b634a621e1774ed")
			.reply(200, loader.json(`test/fixtures/musig/lskp4agpmjwgw549xdrhgdt6dfwqrpvohgbkhyt8p.json`))
			.get("/api/v2/accounts?address=lskn2de9mo9z3g9jvbpj4yjn84vrvjzcn5c5mon7a")
			.reply(200, loader.json(`test/fixtures/musig/lskn2de9mo9z3g9jvbpj4yjn84vrvjzcn5c5mon7a.json`))
			.persist();

		const wallet1 = {
			signingKey: "foil broccoli rare pony man umbrella visual cram wing rotate fall never",
			address: "lskp4agpmjwgw549xdrhgdt6dfwqrpvohgbkhyt8p",
			publicKey: "ac574896c846b59477a9115b952563938c48d0096b84846c0b634a621e1774ed",
		};

		const wallet2 = {
			signingKey: "penalty name learn right reason inherit peace mango guitar heart nature love",
			address: "lskn2de9mo9z3g9jvbpj4yjn84vrvjzcn5c5mon7a",
			publicKey: "5f7f98c50575a4a7e70a46ff35b72f4fe2a1ad3bc9a918b692d132d9c556bdf0",
		};

		const transaction = await service.multiSignature({
			signatory: new Signatories.Signatory(
				new Signatories.MnemonicSignatory({
					signingKey: wallet1.signingKey,
					address: wallet1.address,
					publicKey: wallet1.publicKey,
					privateKey: identity.privateKey,
				}),
			),
			data: {
				numberOfSignatures: 2,
				mandatoryKeys: [
					wallet1.publicKey,
					wallet2.publicKey,
					wallet2.publicKey,
					wallet2.publicKey,
					wallet2.publicKey,
				],
				optionalKeys: [],
			},
		});

		const slow = await subject.calculate(transaction, { priority: "slow" });
		const average = await subject.calculate(transaction, { priority: "average" });
		const fast = await subject.calculate(transaction, { priority: "fast" });

		assert.number(slow.toHuman());
		assert.is(slow.toHuman(), 0.00615);
		assert.number(average.toHuman());
		assert.is(average.toHuman(), 0.00615);
		assert.number(fast.toHuman());
		assert.is(fast.toHuman(), 0.00615);
	});

	test("vote", async () => {
		const transaction = await service.vote({
			signatory: new Signatories.Signatory(
				new Signatories.MnemonicSignatory({
					signingKey: identity.mnemonic,
					address: identity.address,
					publicKey: identity.publicKey,
					privateKey: identity.privateKey,
				}),
			),
			data: {
				votes: [
					{
						amount: 10,
						id: "lskp4agpmjwgw549xdrhgdt6dfwqrpvohgbkhyt8p",
					},
				],
			},
		});

		const slow = await subject.calculate(transaction, { priority: "slow" });
		const average = await subject.calculate(transaction, { priority: "average" });
		const fast = await subject.calculate(transaction, { priority: "fast" });

		assert.number(slow.toHuman());
		assert.is(slow.toHuman(), 0.00142);
		assert.number(average.toHuman());
		assert.is(average.toHuman(), 0.00142);
		assert.number(fast.toHuman());
		assert.is(fast.toHuman(), 0.00142);
	});

	test("unlockToken", async () => {
		const transaction = await service.unlockToken({
			signatory: new Signatories.Signatory(
				new Signatories.MnemonicSignatory({
					signingKey: identity.mnemonic,
					address: identity.address,
					publicKey: identity.publicKey,
					privateKey: identity.privateKey,
				}),
			),
			data: {
				objects: [
					{
						address: "lskp4agpmjwgw549xdrhgdt6dfwqrpvohgbkhyt8p",
						amount: BigNumber.make(1e8),
						height: "14548929",
					},
				],
			},
		});

		const slow = await subject.calculate(transaction, { priority: "slow" });
		const average = await subject.calculate(transaction, { priority: "average" });
		const fast = await subject.calculate(transaction, { priority: "fast" });

		assert.number(slow.toHuman());
		assert.is(slow.toHuman(), 0.00146);
		assert.number(average.toHuman());
		assert.is(average.toHuman(), 0.00146);
		assert.number(fast.toHuman());
		assert.is(fast.toHuman(), 0.00146);
	});

	test("should throw error on unrecognized transaction type", async () => {
		await assert.rejects(
			() => subject.calculate({ moduleID: 10, assetID: 10, asset: {} }),
			"Failed to determine module and asset ID.",
		);
	});
});

test.run();
