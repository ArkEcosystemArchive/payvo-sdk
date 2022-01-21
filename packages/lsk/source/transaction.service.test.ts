import { IoC, Services, Signatories } from "@payvo/sdk";
import { BigNumber } from "@payvo/sdk-helpers";
import { DateTime } from "@payvo/sdk-intl";
import { describeWithContext } from "@payvo/sdk-test";

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

describeWithContext(
	"TransactionService",
	{
		wallet1: {
			address: "lskp4agpmjwgw549xdrhgdt6dfwqrpvohgbkhyt8p",
			publicKey: "ac574896c846b59477a9115b952563938c48d0096b84846c0b634a621e1774ed",
			signingKey: "foil broccoli rare pony man umbrella visual cram wing rotate fall never",
		},

		wallet2: {
			address: "lskn2de9mo9z3g9jvbpj4yjn84vrvjzcn5c5mon7a",
			publicKey: "5f7f98c50575a4a7e70a46ff35b72f4fe2a1ad3bc9a918b692d132d9c556bdf0",
			signingKey: "penalty name learn right reason inherit peace mango guitar heart nature love",
		},
	},
	({ afterEach, beforeAll, it, assert, stub, each, loader, nock }) => {
		beforeAll(async (context) => {
			nock.fake(/.+/).get("/api/v2/fees").reply(200, loader.json(`test/fixtures/client/fees.json`)).persist();

			context.subject = await createService(TransactionService, "lsk.testnet", (container) => {
				container.constant(IoC.BindingType.Container, container);
				container.constant(IoC.BindingType.DataTransferObjects, {
					ConfirmedTransactionData,
					SignedTransactionData,
					WalletData,
				});
				container.singleton(
					IoC.BindingType.DataTransferObjectService,
					Services.AbstractDataTransferObjectService,
				);
				container.singleton(IoC.BindingType.AddressService, AddressService);
				container.singleton(IoC.BindingType.ClientService, ClientService);
				container.singleton(IoC.BindingType.FeeService, FeeService);
				container.singleton(IoC.BindingType.KeyPairService, KeyPairService);
				container.constant(IoC.BindingType.LedgerTransportFactory, async () => {});
				container.singleton(IoC.BindingType.LedgerService, LedgerService);
				container.singleton(IoC.BindingType.PublicKeyService, PublicKeyService);
				container.singleton(IoC.BindingType.MultiSignatureService, MultiSignatureService);
			});

			context.musig = createService(MultiSignatureService, "lsk.testnet", (container) => {
				container.constant(IoC.BindingType.Container, container);
				container.constant(IoC.BindingType.DataTransferObjects, {
					ConfirmedTransactionData,
					SignedTransactionData,
					WalletData,
				});
				container.singleton(
					IoC.BindingType.DataTransferObjectService,
					Services.AbstractDataTransferObjectService,
				);
				container.singleton(IoC.BindingType.AddressService, AddressService);
				container.singleton(IoC.BindingType.ClientService, ClientService);
				container.singleton(IoC.BindingType.FeeService, FeeService);
				container.singleton(IoC.BindingType.KeyPairService, KeyPairService);
				container.constant(IoC.BindingType.LedgerTransportFactory, async () => {});
				container.singleton(IoC.BindingType.LedgerService, LedgerService);
				container.singleton(IoC.BindingType.PublicKeyService, PublicKeyService);
			});

			const gotoTime = DateTime.make("2021-01-01 12:00:00");

			context.dateTime = stub(DateTime, "make");
			context.dateTime.returnValue(gotoTime);
		});

		it("#transfer", async (context) => {
			const result = await context.subject.transfer({
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

			assert.instance(result, SignedTransactionData);
			assert.instance(result.timestamp(), DateTime);
			assert.object(result.toBroadcast());
		});

		it("delegateRegistration - should verify", async (context) => {
			const result = await context.subject.delegateRegistration({
				data: {
					username: "johndoe",
				},
				fee: 10,
				signatory: new Signatories.Signatory(
					new Signatories.MnemonicSignatory({
						address: identity.address,
						privateKey: identity.privateKey,
						publicKey: identity.publicKey,
						signingKey: identity.mnemonic,
					}),
				),
			});

			assert.instance(result, SignedTransactionData);
			assert.object(result.toBroadcast());
		});

		it("vote - should verify", async (context) => {
			const result = await context.subject.vote({
				data: {
					unvotes: [
						{
							amount: 20,
							id: "lskk8upba9sj8zsktr8hb2vcgk3quvgmx8h27h4gr",
						},
					],
					votes: [
						{
							amount: 100,
							id: identity.address,
						},
					],
				},
				fee: 10,
				signatory: new Signatories.Signatory(
					new Signatories.MnemonicSignatory({
						address: identity.address,
						privateKey: identity.privateKey,
						publicKey: identity.publicKey,
						signingKey: identity.mnemonic,
					}),
				),
			});

			assert.instance(result, SignedTransactionData);
			assert.object(result.toBroadcast());
		});

		it("should fail to vote with a number that is not a multiple of 10", async (context) => {
			await assert.rejects(
				() =>
					context.subject.vote({
						data: {
							unvotes: [],
							votes: [
								{
									amount: 1,
									id: identity.address,
								},
							],
						},
						fee: 10,
						signatory: new Signatories.Signatory(
							new Signatories.MnemonicSignatory({
								address: identity.address,
								privateKey: identity.privateKey,
								publicKey: identity.publicKey,
								signingKey: identity.mnemonic,
							}),
						),
					}),
				"not a multiple of 10",
			);
		});

		// each(
		// 	"multiSignature should throw error when %s is not a string list",
		// 	async ({ dataset, context }) => {
		// 		await assert.rejects(
		// 			() =>
		// 				context.subject.multiSignature({
		// 					data: {
		// 						[dataset]: "",
		// 						mandatoryKeys: [context.wallet1.publicKey, context.wallet2.publicKey],
		// 						numberOfSignatures: 2,
		// 						optionalKeys: [],
		// 					},
		// 					fee: 10,
		// 					signatory: new Signatories.Signatory(
		// 						new Signatories.MnemonicSignatory({
		// 							address: context.wallet1.address,
		// 							privateKey: identity.privateKey,
		// 							publicKey: context.wallet1.publicKey,
		// 							signingKey: context.wallet1.signingKey,
		// 						}),
		// 					),
		// 				}),
		// 			`Expected [input.data.${dataset}] to be defined as a list of strings.`,
		// 		);
		// 	},
		// 	["mandatoryKeys", "optionalKeys"],
		// );

		// it("multiSignature should verify", async (context) => {
		// 	nock.fake(/.+/)
		// 		.get("/api/v2/accounts?address=lskp4agpmjwgw549xdrhgdt6dfwqrpvohgbkhyt8p")
		// 		.reply(200, loader.json(`test/fixtures/musig/lskp4agpmjwgw549xdrhgdt6dfwqrpvohgbkhyt8p.json`))
		// 		.get("/api/v2/accounts?publicKey=ac574896c846b59477a9115b952563938c48d0096b84846c0b634a621e1774ed")
		// 		.reply(200, loader.json(`test/fixtures/musig/lskp4agpmjwgw549xdrhgdt6dfwqrpvohgbkhyt8p.json`))
		// 		.get("/api/v2/accounts?address=lskn2de9mo9z3g9jvbpj4yjn84vrvjzcn5c5mon7a")
		// 		.reply(200, loader.json(`test/fixtures/musig/lskn2de9mo9z3g9jvbpj4yjn84vrvjzcn5c5mon7a.json`))
		// 		.persist();

		// 	const transaction1 = await context.subject.multiSignature({
		// 		data: {
		// 			mandatoryKeys: [context.wallet1.publicKey, context.wallet2.publicKey],
		// 			numberOfSignatures: 2,
		// 			optionalKeys: [],
		// 		},
		// 		fee: 10,
		// 		signatory: new Signatories.Signatory(
		// 			new Signatories.MnemonicSignatory({
		// 				address: context.wallet1.address,
		// 				privateKey: identity.privateKey,
		// 				publicKey: context.wallet1.publicKey,
		// 				signingKey: context.wallet1.signingKey,
		// 			}),
		// 		),
		// 	});

		// 	assert.instance(transaction1, SignedTransactionData);

		// 	const transaction2 = await context.musig.addSignature(
		// 		transaction1.data(),
		// 		new Signatories.Signatory(
		// 			new Signatories.MnemonicSignatory({
		// 				address: context.wallet2.address,
		// 				privateKey: identity.privateKey,
		// 				publicKey: context.wallet2.publicKey,
		// 				signingKey: context.wallet2.signingKey,
		// 			}),
		// 		),
		// 	);

		// 	assert.instance(transaction2, SignedTransactionData);

		// 	const transaction3 = await context.musig.addSignature(
		// 		transaction2.data(),
		// 		new Signatories.Signatory(
		// 			new Signatories.MnemonicSignatory({
		// 				address: context.wallet1.address,
		// 				privateKey: identity.privateKey,
		// 				publicKey: context.wallet1.publicKey,
		// 				signingKey: context.wallet1.signingKey,
		// 			}),
		// 		),
		// 	);

		// 	assert.instance(transaction3, SignedTransactionData);

		// 	nock.enableNetConnect();
		// });

		it("#unlockToken", async (context) => {
			const result = await context.subject.unlockToken({
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
				fee: 10,
				signatory: new Signatories.Signatory(
					new Signatories.MnemonicSignatory({
						address: identity.address,
						privateKey: identity.privateKey,
						publicKey: identity.publicKey,
						signingKey: identity.mnemonic,
					}),
				),
			});

			assert.instance(result, SignedTransactionData);
			assert.object(result.toBroadcast());
		});
	},
);
