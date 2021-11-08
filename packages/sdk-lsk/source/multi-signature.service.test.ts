import "jest-extended";

import { jest } from "@jest/globals";
import { DateTime } from "@payvo/intl";
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
		container.singleton(IoC.BindingType.LedgerService, LedgerService);
		container.singleton(IoC.BindingType.PublicKeyService, PublicKeyService);
		container.singleton(BindingType.AssetSerializer, AssetSerializer);
		container.singleton(BindingType.TransactionSerializer, TransactionSerializer);
	});

	jest.spyOn(DateTime, "make").mockReturnValue(DateTime.make("2021-01-01 12:00:00"));
});

describe("MultiSignatureService", () => {
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

	beforeAll(async () => {
		nock(/.+/)
			.get("/api/v2/accounts")
			.query({ address: "lskp4agpmjwgw549xdrhgdt6dfwqrpvohgbkhyt8p" })
			.reply(200, requireModule(`../test/fixtures/musig/lskp4agpmjwgw549xdrhgdt6dfwqrpvohgbkhyt8p.json`))
			.get("/api/v2/accounts")
			.query({ publicKey: "ac574896c846b59477a9115b952563938c48d0096b84846c0b634a621e1774ed" })
			.reply(200, requireModule(`../test/fixtures/musig/lskp4agpmjwgw549xdrhgdt6dfwqrpvohgbkhyt8p.json`))
			.persist();
	});

	it("should add signature", async () => {
		const transaction1 = await subject.transfer({
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
				amount: 1,
				to: wallet1.address,
			},
		});

		expect(transaction1).toBeInstanceOf(SignedTransactionData);
		expect(transaction1).toMatchSnapshot();

		expect(musig.isMultiSignatureReady(transaction1)).toBeFalse();
		expect(musig.needsSignatures(transaction1)).toBeTrue();
		expect(musig.needsAllSignatures(transaction1)).toBeTrue();
		expect(musig.remainingSignatureCount(transaction1)).toBe(1);
		expect(musig.needsWalletSignature(transaction1, wallet1.publicKey)).toBeFalse();
		expect(musig.needsWalletSignature(transaction1, wallet2.publicKey)).toBeTrue();

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

		expect(musig.isMultiSignatureReady(transaction2)).toBeTrue();
		expect(musig.needsSignatures(transaction2)).toBeFalse();
		expect(musig.needsAllSignatures(transaction2)).toBeFalse();
		expect(musig.remainingSignatureCount(transaction2)).toBe(0);
		expect(musig.needsWalletSignature(transaction2, wallet1.publicKey)).toBeFalse();
		expect(musig.needsWalletSignature(transaction2, wallet2.publicKey)).toBeFalse();
	});

	describe("#broadcast", () => {
		let transaction;

		beforeEach(async () => {
			transaction = await musig.addSignature(
				(
					await subject.transfer({
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
							amount: 1,
							to: wallet1.address,
						},
					})
				).data(),
				new Signatories.Signatory(
					new Signatories.MnemonicSignatory({
						signingKey: wallet2.signingKey,
						address: wallet2.address,
						publicKey: wallet2.publicKey,
						privateKey: identity.privateKey,
					}),
				),
			);
		});

		it("should broadcast a transaction", async () => {
			nock(/.+/)
				.post("/", (body) => body.method === "store")
				.reply(200, {
					result: { id: transaction.id() },
				});

			await expect(musig.broadcast(transaction.data())).resolves.toEqual({
				accepted: [transaction.id()],
				errors: {},
				rejected: [],
			});
		});

		it("should handle error", async () => {
			nock(/.+/)
				.post("/", (body) => body.method === "store")
				.reply(400, {
					message: "Unable to broadcast transaction.",
				});

			await expect(musig.broadcast(transaction.data())).resolves.toEqual({
				accepted: [],
				errors: {
					[transaction.id()]: "Unable to broadcast transaction.",
				},
				rejected: [transaction.id()],
			});
		});
	});

	test("#needsFinalSignature", async () => {
		expect(
			musig.needsFinalSignature(
				await subject.transfer({
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
						amount: 1,
						to: wallet1.address,
					},
				}),
			),
		).toBeFalse();
	});

	test("#allWithPendingState", async () => {
		nock(/.+/)
			.post("/", {
				jsonrpc: "2.0",
				id: /.+/,
				method: "list",
				params: {
					publicKey: identity.publicKey,
					state: "pending",
				},
			})
			.reply(200, {
				result: [
					{ data: {}, multiSignature: {} },
					{ data: {}, multiSignature: {} },
				],
			});

		await expect(musig.allWithPendingState(identity.publicKey)).resolves.toHaveLength(2);
	});

	test("#allWithReadyState", async () => {
		nock(/.+/)
			.post("/", {
				jsonrpc: "2.0",
				id: /.+/,
				method: "list",
				params: {
					publicKey: identity.publicKey,
					state: "ready",
				},
			})
			.reply(200, {
				result: [
					{ data: {}, multiSignature: {} },
					{ data: {}, multiSignature: {} },
				],
			});

		await expect(musig.allWithReadyState(identity.publicKey)).resolves.toHaveLength(2);
	});

	test("#findById", async () => {
		nock(/.+/)
			.post("/", {
				jsonrpc: "2.0",
				id: /.+/,
				method: "show",
				params: {
					id: "384b0438-36c0-4437-a35b-a8135cbba17d",
				},
			})
			.reply(200, { result: { data: {}, multiSignature: {} } });

		await expect(musig.findById("384b0438-36c0-4437-a35b-a8135cbba17d")).resolves.toEqual({
			multiSignature: {},
		});
	});

	test("#forgetById", async () => {
		const deleteNock = nock(/.+/)
			.post("/", {
				jsonrpc: "2.0",
				id: /.+/,
				method: "delete",
				params: {
					id: "384b0438-36c0-4437-a35b-a8135cbba17d",
				},
			})
			.reply(200, {});

		expect(deleteNock.isDone()).toBeFalse();

		await musig.forgetById("384b0438-36c0-4437-a35b-a8135cbba17d");

		expect(deleteNock.isDone()).toBeTrue();
	});
});
