import "jest-extended";

import { IoC, Services, Signatories } from "@payvo/sdk";

import { identity } from "../test/fixtures/identity";
import { createService } from "../test/mocking";
import { DataTransferObjects } from "./coin.dtos";
import { AddressService } from "./address.service";
import { ClientService } from "./client-three.service";
import { KeyPairService } from "./key-pair.service";
import { LedgerService } from "./ledger.service";
import { PublicKeyService } from "./public-key.service";
import { TransactionService } from "./transaction-three.service";
import { SignedTransactionData } from "./signed-transaction.dto";

let subject: TransactionService;

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
	});
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
		});

		// {"moduleID":2,"assetID":0,"senderPublicKey":"951ea6fd174ad81a20a3276f7f99bda35a28241d5760c9d45d1ae78b2f1a8dd1","nonce":"2n","fee":"207000n","signatures":["eebb923a6aa8ec4db630a708c4e269876e6a8440831f0b5f011cbf968089e5a189966028e031d7ce5ca2605ba80c35cc01deccee0826fd0e77d156b2cd013500"],"asset":{"recipientAddress":"fe4a135a02dd658903dd9db4963e91eb19194dc5","amount":"100000000n","data":""},"id":"892599e5fc288cc17fcd9a60e835437093b73349a905e63487a78e9439c50653"}

		// {"moduleID":2,"assetID":0,"senderPublicKey":"951ea6fd174ad81a20a3276f7f99bda35a28241d5760c9d45d1ae78b2f1a8dd1","nonce":"2n","fee":"207000n","signatures":["2faca873a0156e6d902d33e5f9b82a7f19b2d472786d1db7fac44ceb6dff8bc2d0b06b3ce307d0b157e13d50b9988fa7a2e6d36ef08154e181533f334bc2630d",""],"asset":{"recipientAddress":"fe4a135a02dd658903dd9db4963e91eb19194dc5","amount":"100000000n","data":""},"id":"7ed94d567b577a7aa483e25bed968a0adf0350bcd041866d62a97a363491b18e"}

		// {"moduleID":2,"assetID":0,"senderPublicKey":"951ea6fd174ad81a20a3276f7f99bda35a28241d5760c9d45d1ae78b2f1a8dd1","nonce":"2n","fee":"207000n","signatures":["2faca873a0156e6d902d33e5f9b82a7f19b2d472786d1db7fac44ceb6dff8bc2d0b06b3ce307d0b157e13d50b9988fa7a2e6d36ef08154e181533f334bc2630d","eebb923a6aa8ec4db630a708c4e269876e6a8440831f0b5f011cbf968089e5a189966028e031d7ce5ca2605ba80c35cc01deccee0826fd0e77d156b2cd013500"],"asset":{"recipientAddress":"fe4a135a02dd658903dd9db4963e91eb19194dc5","amount":"100000000n","data":""},"id":"3305b30c2b1664e559954f13f1581fb5e682aae35c6e6a7bb5c7b58c53a241b7"}

		it.only("should sign with a multi-signature", async () => {
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

			const transaction1 = await subject.transfer({
				signatory: new Signatories.Signatory(
					new Signatories.MnemonicSignatory({
						signingKey: wallet1.signingKey,
						address: wallet1.address,
						publicKey: wallet1.publicKey,
						privateKey: identity.privateKey,
					}),
				),
				data: {
					amount: 1,
					to: wallet1.address,
				},
			});

			const transaction2 = await subject.multiSign(transaction1, {
				signatory: new Signatories.Signatory(
					new Signatories.MnemonicSignatory({
						signingKey: wallet2.signingKey,
						address: wallet2.address,
						publicKey: wallet2.publicKey,
						privateKey: identity.privateKey,
					}),
				),
			});

			console.log(transaction2);
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

	describe.skip("#multiSign", () => {
		it("should verify", async () => {
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

			const transaction2 = await subject.multiSign(transaction1, {
				signatory: new Signatories.Signatory(
					new Signatories.MnemonicSignatory({
						signingKey: wallet2.signingKey,
						address: wallet2.address,
						publicKey: wallet2.publicKey,
						privateKey: identity.privateKey,
					}),
				),
			});

			expect(transaction2).toBeInstanceOf(SignedTransactionData);

			const transaction3 = await subject.multiSign(transaction2, {
				signatory: new Signatories.Signatory(
					new Signatories.MnemonicSignatory({
						signingKey: wallet1.signingKey,
						address: wallet1.address,
						publicKey: wallet1.publicKey,
						privateKey: identity.privateKey,
					}),
				),
			});

			expect(transaction3).toBeInstanceOf(SignedTransactionData);
		});
	});
});
