import "jest-extended";

import { jest } from "@jest/globals";
import { DateTime } from "@payvo/sdk-intl";
import { BigNumber } from "@payvo/sdk-helpers";
import { IoC, Services, Signatories, Test } from "@payvo/sdk";
import nock from "nock";

import { identity } from "../test/fixtures/identity";
import { createService, requireModule } from "../test/mocking";
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

let subject: TransactionService;
let musig: MultiSignatureService;

beforeAll(async () => {
	nock.disableNetConnect();

	nock(/.+/).get("/api/v2/fees").reply(200, requireModule(`../test/fixtures/client/fees.json`)).persist();

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

	jest.spyOn(DateTime, "make").mockReturnValue(DateTime.make("2021-01-01 12:00:00"));
});

describe("TransactionService", () => {
	describe("#transfer", () => {
		it("should sign with an mnemonic", async () => {
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

			expect(result).toBeInstanceOf(SignedTransactionData);
			expect(result.timestamp()).toBeInstanceOf(DateTime);
			expect(result.toBroadcast()).toMatchInlineSnapshot(`
			Object {
			  "asset": Object {
			    "amount": "100000000",
			    "data": "",
			    "recipientAddress": "lskw6h7zzen4f7n8k4ntwd9qtv62gexzv2rh7cb6h",
			  },
			  "assetID": 0,
			  "fee": "141000",
			  "id": "0919bfffb78de38eff73e1363b236c812766e6e5ca1b49195fa0acc338ba1f7f",
			  "moduleID": 2,
			  "nonce": "0",
			  "senderPublicKey": "39b49ead71b16c0b0330a6ba46c57183819936bfdf789dfd2452df4dc04f5a2a",
			  "signatures": Array [
			    "f750fec649514ed39c600553e421ddf0433b2a0448bdfdb17c83af1c6eaca58816901d4f1d414069b57f3ae32d80c205bf8fd1d98f36b9d2c81429b38426580b",
			  ],
			  "timestamp": "2021-01-01T12:00:00.000Z",
			}
		`);
		});
	});

	describe("#delegateRegistration", () => {
		it("should verify", async () => {
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

			expect(result).toBeInstanceOf(SignedTransactionData);
			expect(result.toBroadcast()).toMatchInlineSnapshot(`
			Object {
			  "asset": Object {
			    "username": "johndoe",
			  },
			  "assetID": 0,
			  "fee": "1000000000",
			  "id": "05659b40db0129bc51cdc2575fb414e8f49ec7498c05724e9dbeb6c1a38eb59e",
			  "moduleID": 5,
			  "nonce": "0",
			  "senderPublicKey": "39b49ead71b16c0b0330a6ba46c57183819936bfdf789dfd2452df4dc04f5a2a",
			  "signatures": Array [
			    "46cb605693a44f93278bdada4ab721891fcf21eabca077e7b74136353a1e2a6fe7e47e34b382a397823b47ddc038e8cac0767e4151ada6c01c6d6d51a307bd01",
			  ],
			  "timestamp": "2021-01-01T12:00:00.000Z",
			}
		`);
		});
	});

	describe("#vote", () => {
		it("should verify", async () => {
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

			expect(result).toBeInstanceOf(SignedTransactionData);
			expect(result.toBroadcast()).toMatchInlineSnapshot(`
			Object {
			  "asset": Object {
			    "votes": Array [
			      Object {
			        "amount": "10000000000",
			        "delegateAddress": "lskw6h7zzen4f7n8k4ntwd9qtv62gexzv2rh7cb6h",
			      },
			      Object {
			        "amount": "-2000000000",
			        "delegateAddress": "lskk8upba9sj8zsktr8hb2vcgk3quvgmx8h27h4gr",
			      },
			    ],
			  },
			  "assetID": 1,
			  "fee": "1000000000",
			  "id": "56a3b96cfde4b40f1d8d935cbf895449126c55514039665cb11fbb48cf29a75e",
			  "moduleID": 5,
			  "nonce": "0",
			  "senderPublicKey": "39b49ead71b16c0b0330a6ba46c57183819936bfdf789dfd2452df4dc04f5a2a",
			  "signatures": Array [
			    "475e0adc2b94c4834e97c2d73fd21403579a7d3d447cffa5afa419ba5d36ece65cbaa3648d49a73a3f0ea44225c369394303f48b5a65a9fcfb71f99761ba2a0a",
			  ],
			  "timestamp": "2021-01-01T12:00:00.000Z",
			}
		`);
		});

		it("should fail to vote with a number that is not a multiple of 10", async () => {
			await expect(
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
			).rejects.toThrow(/not a multiple of 10/);
		});
	});

	describe("#multiSignature", () => {
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

		it.each(["mandatoryKeys", "optionalKeys"])(
			"should throw error when %s is not a string list",
			async (parameter) => {
				await expect(() =>
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
				).rejects.toThrow(`Expected [input.data.${parameter}] to be defined as a list of strings.`);
			},
		);

		it("should verify", async () => {
			nock.disableNetConnect();

			nock(/.+/)
				.get("/api/v2/accounts?address=lskp4agpmjwgw549xdrhgdt6dfwqrpvohgbkhyt8p")
				.reply(200, requireModule(`../test/fixtures/musig/lskp4agpmjwgw549xdrhgdt6dfwqrpvohgbkhyt8p.json`))
				.get("/api/v2/accounts?publicKey=ac574896c846b59477a9115b952563938c48d0096b84846c0b634a621e1774ed")
				.reply(200, requireModule(`../test/fixtures/musig/lskp4agpmjwgw549xdrhgdt6dfwqrpvohgbkhyt8p.json`))
				.get("/api/v2/accounts?address=lskn2de9mo9z3g9jvbpj4yjn84vrvjzcn5c5mon7a")
				.reply(200, requireModule(`../test/fixtures/musig/lskn2de9mo9z3g9jvbpj4yjn84vrvjzcn5c5mon7a.json`))
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

			expect(transaction1).toBeInstanceOf(SignedTransactionData);
			expect(transaction1).toMatchSnapshot();

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

			expect(transaction2).toBeInstanceOf(SignedTransactionData);
			expect(transaction2).toMatchSnapshot();

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

			expect(transaction3).toBeInstanceOf(SignedTransactionData);
			expect(transaction3).toMatchSnapshot();

			nock.enableNetConnect();
		});
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

		expect(result).toBeInstanceOf(SignedTransactionData);
		expect(result.toBroadcast()).toMatchInlineSnapshot(`
		Object {
		  "asset": Object {
		    "unlockObjects": Array [
		      Object {
		        "amount": "1000000000",
		        "delegateAddress": "lsknnwoty8tmzoc96rscwu7bw4kmcwvdatawerehw",
		        "unvoteHeight": 14216291,
		      },
		    ],
		  },
		  "assetID": 2,
		  "fee": "1000000000",
		  "id": "eaf0d5d1873de1db0daf6daedcc8bfaa0fd162ff4a361ead9cf97ff1a24713f5",
		  "moduleID": 5,
		  "nonce": "0",
		  "senderPublicKey": "39b49ead71b16c0b0330a6ba46c57183819936bfdf789dfd2452df4dc04f5a2a",
		  "signatures": Array [
		    "41b93881b43c67f4da6680df6550266e468658ba6aa749012226d47ae3ea5eb91ffd77251132fe479b036797b375c6a701421dd1ad9c15c964992415fe5c3e04",
		  ],
		  "timestamp": "2021-01-01T12:00:00.000Z",
		}
	`);
	});
});
