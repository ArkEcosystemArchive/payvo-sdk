import "jest-extended";

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
import { DateTime } from "@payvo/intl";

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
			  "fee": "314000",
			  "id": "e2f2bcbcbc7d7d192f6d3300247bd87a72f696d854b89c46182d5f782a92c03d",
			  "moduleID": 2,
			  "nonce": "0",
			  "senderPublicKey": "39b49ead71b16c0b0330a6ba46c57183819936bfdf789dfd2452df4dc04f5a2a",
			  "signatures": Array [
			    "da11bab7ee2de8263020b350bc8d4d7d66ce95986d54fb1da039c8a37b8d1c623f35d4265c8583677ea9bdd4c1a3ba5af9d0f3ce72da4ad771990a19c7206908",
			  ],
			  "timestamp": "2021-01-01T12:00:00.000Z",
			}
		`);
		});
	});

	describe("#delegateRegistration", () => {
		it("should verify", async () => {
			const result = await subject.delegateRegistration({
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
			  "fee": "314000",
			  "id": "f00d7e1cc8981d171a5b761b290954548551bfeb76ed19c7f43e73b662ce8cff",
			  "moduleID": 5,
			  "nonce": "0",
			  "senderPublicKey": "39b49ead71b16c0b0330a6ba46c57183819936bfdf789dfd2452df4dc04f5a2a",
			  "signatures": Array [
			    "4e9aef82fc355a3cfbbcfce2e74e92038e0a1e5ec129ffae7e74f41c53119c6bcc21d7c4dc9ac0a87477f39bda6ae38d4b80d4602beb94c6c56686ed7705010f",
			  ],
			  "timestamp": "2021-01-01T12:00:00.000Z",
			}
		`);
		});
	});

	describe("#vote", () => {
		it("should verify", async () => {
			const result = await subject.vote({
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
			  "fee": "314000",
			  "id": "3edaddccbbf4731d161c466df5ea48af336d7ff70a3e7153e90fdf8f72bb788a",
			  "moduleID": 5,
			  "nonce": "0",
			  "senderPublicKey": "39b49ead71b16c0b0330a6ba46c57183819936bfdf789dfd2452df4dc04f5a2a",
			  "signatures": Array [
			    "c092a7d5a9297e8d33fc327e9fd1130edf2c8aebc20a2994f648a32ecdc1ecaa28b87f278abebad7b34c51030e2e217725456b321ae4b358de99b4dbf65fe80d",
			  ],
			  "timestamp": "2021-01-01T12:00:00.000Z",
			}
		`);
		});

		it("should fail to vote with a number that is not a multiple of 10", async () => {
			await expect(
				subject.vote({
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
