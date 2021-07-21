import "jest-extended";

import { DateTime } from "@payvo/intl";
import { IoC, Services, Signatories } from "@payvo/sdk";
import nock from "nock";

import { identity } from "../test/fixtures/identity";
import { createService } from "../test/mocking";
import { DataTransferObjects } from "./coin.dtos";
import { AddressService } from "./address.service";
import { ClientService } from "./client-three.service";
import { KeyPairService } from "./key-pair.service";
import { LedgerService } from "./ledger.service";
import { PublicKeyService } from "./public-key.service";
import { TransactionService } from "./transaction-three.service";
import { MultiSignatureService } from "./multi-signature.service";
import { SignedTransactionData } from "./signed-transaction.dto";
import { TransactionSerializer } from "./transaction.serializer";
import { BindingType } from "./coin.contract";
import { AssetSerializer } from "./asset.serializer";

let subject: TransactionService;
let musig: MultiSignatureService;

beforeAll(async () => {
	subject = createService(TransactionService, "lsk.testnet", (container) => {
		container.constant(IoC.BindingType.Container, container);
		container.singleton(IoC.BindingType.AddressService, AddressService);
		container.singleton(IoC.BindingType.ClientService, ClientService);
		container.constant(IoC.BindingType.DataTransferObjects, DataTransferObjects);
		container.singleton(IoC.BindingType.DataTransferObjectService, Services.AbstractDataTransferObjectService);
		container.singleton(IoC.BindingType.KeyPairService, KeyPairService);
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
		container.constant(IoC.BindingType.DataTransferObjects, DataTransferObjects);
		container.singleton(IoC.BindingType.DataTransferObjectService, Services.AbstractDataTransferObjectService);
		container.singleton(IoC.BindingType.KeyPairService, KeyPairService);
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
					amount: 1,
					to: identity.address,
				},
			});

			expect(result).toBeInstanceOf(SignedTransactionData);
			expect(result.toBroadcast()).toMatchInlineSnapshot(`
			Object {
			  "asset": Object {
			    "amount": "100000000",
			    "data": "",
			    "recipientAddress": "lskw6h7zzen4f7n8k4ntwd9qtv62gexzv2rh7cb6h",
			  },
			  "assetID": 0,
			  "fee": "1000000000",
			  "id": "c74791e86463b0379500feacfddb0f9a3f60307cfa53e428aa430fb9db9f9b82",
			  "moduleID": 2,
			  "nonce": "0",
			  "senderPublicKey": "39b49ead71b16c0b0330a6ba46c57183819936bfdf789dfd2452df4dc04f5a2a",
			  "signatures": Array [
			    "dff0300f5c115138693d43d6e92bfecdab4d8a514aff88b5986a67e35e3bd50ed049f3ff7732c9cf02d6dd1ea0332f74bf71db24e06985c4096e94a98a1c300c",
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
							amount: 10,
						},
					],
					unvotes: [],
				},
			});

			expect(result).toBeInstanceOf(SignedTransactionData);
			expect(result.toBroadcast()).toMatchInlineSnapshot(`
			Object {
			  "asset": Object {
			    "votes": Array [
			      Object {
			        "amount": "1000000000",
			        "delegateAddress": "lskw6h7zzen4f7n8k4ntwd9qtv62gexzv2rh7cb6h",
			      },
			    ],
			  },
			  "assetID": 1,
			  "fee": "1000000000",
			  "id": "7635e30a3ab8692a4c484654359b556f42256a35f367b19f12076351a6a28f55",
			  "moduleID": 5,
			  "nonce": "0",
			  "senderPublicKey": "39b49ead71b16c0b0330a6ba46c57183819936bfdf789dfd2452df4dc04f5a2a",
			  "signatures": Array [
			    "d46bd9dcd71a58468a7d0cfef8cfd6581707fd216f0fa2d26c88f0ed6dc4af2b66d3ce95714e60414dcb815a8a4574011fcf80bddf6e90c6d62a873eab654302",
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

	test("#multiSignature", async () => {
		nock.disableNetConnect();

		nock(/.+/)
			.get("/api/v2/accounts?address=lskp4agpmjwgw549xdrhgdt6dfwqrpvohgbkhyt8p")
			.reply(200, require(`${__dirname}/../test/fixtures/musig/lskp4agpmjwgw549xdrhgdt6dfwqrpvohgbkhyt8p.json`))
			.get("/api/v2/accounts?publicKey=ac574896c846b59477a9115b952563938c48d0096b84846c0b634a621e1774ed")
			.reply(200, require(`${__dirname}/../test/fixtures/musig/lskp4agpmjwgw549xdrhgdt6dfwqrpvohgbkhyt8p.json`))
			.get("/api/v2/accounts?address=lskn2de9mo9z3g9jvbpj4yjn84vrvjzcn5c5mon7a")
			.reply(200, require(`${__dirname}/../test/fixtures/musig/lskn2de9mo9z3g9jvbpj4yjn84vrvjzcn5c5mon7a.json`))
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
