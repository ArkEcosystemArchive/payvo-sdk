import { assert, describe, loader, test } from "@payvo/sdk-test";
import { DateTime } from "@payvo/sdk-intl";
import { IoC, Services, Signatories } from "@payvo/sdk";
import {nock} from "@payvo/sdk-test";

import { identity } from "../test/fixtures/identity";
import { createService } from "../test/mocking";
import { AddressService } from "./address.service";
import { ClientService } from "./client.service";
import { FeeService } from "./fee.service";
import { KeyPairService } from "./key-pair.service";
import { LedgerService } from "./ledger.service";
import { PublicKeyService } from "./public-key.service";
import { TransactionService } from "./transaction.service";
import { MultiSignatureService } from "./multi-signature.service";
import { TransactionSerializer } from "./transaction.serializer";
import { BindingType } from "./coin.contract";
import { AssetSerializer } from "./asset.serializer";
import { SignedTransactionData } from "./signed-transaction.dto";
import { ConfirmedTransactionData } from "./confirmed-transaction.dto";
import { WalletData } from "./wallet.dto";

let subject;
let musig;

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

test.before(async () => {
	nock.disableNetConnect();

	nock.fake(/.+/).get("/api/v2/fees").reply(200, loader.json(`test/fixtures/client/fees.json`)).persist();

	subject = await createService(TransactionService, "lsk.testnet", (container) => {
		container.constant(IoC.BindingType.Container, container);
		container.singleton(IoC.BindingType.AddressService, AddressService);
		container.singleton(IoC.BindingType.ClientService, ClientService);
		container.constant(IoC.BindingType.DataTransferObjects, {
			SignedTransactionData,
			ConfirmedTransactionData,
			WalletData,
		});
		container.singleton(IoC.BindingType.DataTransferObjectService, Services.AbstractDataTransferObjectService);
		container.singleton(IoC.BindingType.FeeService, FeeService);
		container.singleton(IoC.BindingType.KeyPairService, KeyPairService);
		container.constant(IoC.BindingType.LedgerTransportFactory, async () => {});
		container.singleton(IoC.BindingType.LedgerService, LedgerService);
		container.singleton(IoC.BindingType.PublicKeyService, PublicKeyService);
		container.singleton(IoC.BindingType.MultiSignatureService, MultiSignatureService);
		container.singleton(BindingType.AssetSerializer, AssetSerializer);
		container.singleton(BindingType.TransactionSerializer, TransactionSerializer);
	});

	musig = createService(MultiSignatureService, "lsk.testnet", (container) => {
		container.constant(IoC.BindingType.Container, container);
		container.singleton(IoC.BindingType.AddressService, AddressService);
		container.singleton(IoC.BindingType.ClientService, ClientService);
		container.constant(IoC.BindingType.DataTransferObjects, {
			SignedTransactionData,
			ConfirmedTransactionData,
			WalletData,
		});
		container.singleton(IoC.BindingType.DataTransferObjectService, Services.AbstractDataTransferObjectService);
		container.singleton(IoC.BindingType.FeeService, FeeService);
		container.singleton(IoC.BindingType.KeyPairService, KeyPairService);
		container.constant(IoC.BindingType.LedgerTransportFactory, async () => {});
		container.singleton(IoC.BindingType.LedgerService, LedgerService);
		container.singleton(IoC.BindingType.PublicKeyService, PublicKeyService);
		container.singleton(BindingType.AssetSerializer, AssetSerializer);
		container.singleton(BindingType.TransactionSerializer, TransactionSerializer);
	});

	jest.spyOn(DateTime, "make").returnValue(DateTime.make("2021-01-01 12:00:00"));
});

test("#transfer", async () => {
	const result = await subject.transfer({
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

	assert.instance(result, SignedTransactionData);
	assert.instance(result.timestamp(), DateTime);
	assert.is(result.toBroadcast());
});

test("delegateRegistration - should verify", async () => {
	const result = await subject.delegateRegistration({
		fee: 10,
		signatory: new Signatories.Signatory(
			new Signatories.MnemonicSignatory({
				signingKey: identity.mnemonic,
				address: identity.address,
				publicKey: identity.publicKey,
				privateKey: identity.privateKey,
			}),
		),
		data: {
			username: "johndoe",
		},
	});

	assert.instance(result, SignedTransactionData);
	assert.is(result.toBroadcast());
});

test("vote - should verify", async () => {
	const result = await subject.vote({
		fee: 10,
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
					id: identity.address,
					amount: 100,
				},
			],
			unvotes: [
				{
					id: "lskk8upba9sj8zsktr8hb2vcgk3quvgmx8h27h4gr",
					amount: 20,
				},
			],
		},
	});

	assert.instance(result, SignedTransactionData);
	assert.is(result.toBroadcast());
});

test("should fail to vote with a number that is not a multiple of 10", async () => {
	await assert.rejects(
		() =>
			subject.vote({
				fee: 10,
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
							id: identity.address,
							amount: 1,
						},
					],
					unvotes: [],
				},
			}),
		"not a multiple of 10",
	);
});

for (const parameter of ["mandatoryKeys", "optionalKeys"]) {
	test("multiSignature should throw error when %s is not a string list", async () => {
		await assert.rejects(
			() =>
				subject.multiSignature({
					fee: 10,
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
						[parameter]: "",
					},
				}),
			`Expected [input.data.${parameter}] to be defined as a list of strings.`,
		);
	});
}

test("multiSignature should verify", async () => {
	nock.disableNetConnect();

	nock.fake(/.+/)
		.get("/api/v2/accounts?address=lskp4agpmjwgw549xdrhgdt6dfwqrpvohgbkhyt8p")
		.reply(200, loader.json(`test/fixtures/musig/lskp4agpmjwgw549xdrhgdt6dfwqrpvohgbkhyt8p.json`))
		.get("/api/v2/accounts?publicKey=ac574896c846b59477a9115b952563938c48d0096b84846c0b634a621e1774ed")
		.reply(200, loader.json(`test/fixtures/musig/lskp4agpmjwgw549xdrhgdt6dfwqrpvohgbkhyt8p.json`))
		.get("/api/v2/accounts?address=lskn2de9mo9z3g9jvbpj4yjn84vrvjzcn5c5mon7a")
		.reply(200, loader.json(`test/fixtures/musig/lskn2de9mo9z3g9jvbpj4yjn84vrvjzcn5c5mon7a.json`))
		.persist();

	const transaction1 = await subject.multiSignature({
		fee: 10,
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

	assert.instance(transaction1, SignedTransactionData);

	const transaction2 = await musig.addSignature(
		transaction1.data(),
		new Signatories.Signatory(
			new Signatories.MnemonicSignatory({
				signingKey: wallet2.signingKey,
				address: wallet2.address,
				publicKey: wallet2.publicKey,
				privateKey: identity.privateKey,
			}),
		),
	);

	assert.instance(transaction2, SignedTransactionData);

	const transaction3 = await musig.addSignature(
		transaction2.data(),
		new Signatories.Signatory(
			new Signatories.MnemonicSignatory({
				signingKey: wallet1.signingKey,
				address: wallet1.address,
				publicKey: wallet1.publicKey,
				privateKey: identity.privateKey,
			}),
		),
	);

	assert.instance(transaction3, SignedTransactionData);

	nock.enableNetConnect();
});

test("#unlockToken", async () => {
	const result = await subject.unlockToken({
		fee: 10,
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
					address: "lsknnwoty8tmzoc96rscwu7bw4kmcwvdatawerehw",
					amount: BigNumber.make(10e8),
					height: "14216291",
					isReady: true,
					timestamp: DateTime.make("2021-07-28T06:26:40.000Z"),
				},
			],
		},
	});

	assert.instance(result, SignedTransactionData);
	assert.object(result.toBroadcast());
});

test.run();
