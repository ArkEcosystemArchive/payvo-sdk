import "jest-extended";

import { IoC, Services, Signatories } from "@payvo/sdk";
import nock from "nock";

import { createService, require } from "../test/mocking";
import { identity } from "../test/fixtures/identity";
import { FeeService } from "./fee.service";
import { DataTransferObjects } from "./coin.dtos";
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

let subject: FeeService;

beforeAll(async () => {
	nock.disableNetConnect();
});

beforeEach(async () => {
	subject = await createService(FeeService, "lsk.testnet", (container) => {
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
});

describe("FeeService", () => {
	describe("#all", () => {
		it("should succeed", async () => {
			const result = await subject.all();

			expect(result).toContainAllKeys([
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

			expect(result.transfer.min.toString()).toBe("10000000");
			expect(result.transfer.avg.toString()).toBe("10000000");
			expect(result.transfer.max.toString()).toBe("10000000");
			expect(result.transfer.static.toString()).toBe("10000000");
		});
	});

	describe("#calculate", () => {
		test("multiSignature", async () => {
			nock(/.+/)
				.get("/api/v2/fees")
				.reply(200, await require(`../test/fixtures/client/fees.json`))
				.get("/api/v2/accounts?address=lskp4agpmjwgw549xdrhgdt6dfwqrpvohgbkhyt8p")
				.reply(200, await require(`../test/fixtures/musig/lskp4agpmjwgw549xdrhgdt6dfwqrpvohgbkhyt8p.json`))
				.get("/api/v2/accounts?publicKey=ac574896c846b59477a9115b952563938c48d0096b84846c0b634a621e1774ed")
				.reply(200, await require(`../test/fixtures/musig/lskp4agpmjwgw549xdrhgdt6dfwqrpvohgbkhyt8p.json`))
				.get("/api/v2/accounts?address=lskn2de9mo9z3g9jvbpj4yjn84vrvjzcn5c5mon7a")
				.reply(200, await require(`../test/fixtures/musig/lskn2de9mo9z3g9jvbpj4yjn84vrvjzcn5c5mon7a.json`))
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

			const transaction = await (
				await createService(TransactionService, "lsk.testnet", (container) => {
					container.constant(IoC.BindingType.Container, container);
					container.singleton(IoC.BindingType.AddressService, AddressService);
					container.singleton(IoC.BindingType.ClientService, ClientService);
					container.singleton(IoC.BindingType.FeeService, FeeService);
					container.constant(IoC.BindingType.DataTransferObjects, DataTransferObjects);
					container.singleton(
						IoC.BindingType.DataTransferObjectService,
						Services.AbstractDataTransferObjectService,
					);
					container.singleton(IoC.BindingType.KeyPairService, KeyPairService);
					container.singleton(IoC.BindingType.LedgerService, LedgerService);
					container.singleton(IoC.BindingType.PublicKeyService, PublicKeyService);
					container.singleton(IoC.BindingType.MultiSignatureService, MultiSignatureService);
					container.singleton(BindingType.AssetSerializer, AssetSerializer);
					container.singleton(BindingType.TransactionSerializer, TransactionSerializer);
				})
			).multiSignature({
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

			expect(slow.toHuman()).toBeNumber();
			expect(slow.toHuman()).toBe(0.00314);
			expect(average.toHuman()).toBeNumber();
			expect(average.toHuman()).toBe(0.00314);
			expect(fast.toHuman()).toBeNumber();
			expect(fast.toHuman()).toBe(0.00314);
		});

		test("multiSignature with 5 participants", async () => {
			nock(/.+/)
				.get("/api/v2/fees")
				.reply(200, await require(`../test/fixtures/client/fees.json`))
				.get("/api/v2/accounts?address=lskp4agpmjwgw549xdrhgdt6dfwqrpvohgbkhyt8p")
				.reply(200, await require(`../test/fixtures/musig/lskp4agpmjwgw549xdrhgdt6dfwqrpvohgbkhyt8p.json`))
				.get("/api/v2/accounts?publicKey=ac574896c846b59477a9115b952563938c48d0096b84846c0b634a621e1774ed")
				.reply(200, await require(`../test/fixtures/musig/lskp4agpmjwgw549xdrhgdt6dfwqrpvohgbkhyt8p.json`))
				.get("/api/v2/accounts?address=lskn2de9mo9z3g9jvbpj4yjn84vrvjzcn5c5mon7a")
				.reply(200, await require(`../test/fixtures/musig/lskn2de9mo9z3g9jvbpj4yjn84vrvjzcn5c5mon7a.json`))
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

			const transaction = await (
				await createService(TransactionService, "lsk.testnet", (container) => {
					container.constant(IoC.BindingType.Container, container);
					container.singleton(IoC.BindingType.AddressService, AddressService);
					container.singleton(IoC.BindingType.ClientService, ClientService);
					container.singleton(IoC.BindingType.FeeService, FeeService);
					container.constant(IoC.BindingType.DataTransferObjects, DataTransferObjects);
					container.singleton(
						IoC.BindingType.DataTransferObjectService,
						Services.AbstractDataTransferObjectService,
					);
					container.singleton(IoC.BindingType.KeyPairService, KeyPairService);
					container.singleton(IoC.BindingType.LedgerService, LedgerService);
					container.singleton(IoC.BindingType.PublicKeyService, PublicKeyService);
					container.singleton(IoC.BindingType.MultiSignatureService, MultiSignatureService);
					container.singleton(BindingType.AssetSerializer, AssetSerializer);
					container.singleton(BindingType.TransactionSerializer, TransactionSerializer);
				})
			).multiSignature({
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

			expect(slow.toHuman()).toBeNumber();
			expect(slow.toHuman()).toBe(0.00615);
			expect(average.toHuman()).toBeNumber();
			expect(average.toHuman()).toBe(0.00615);
			expect(fast.toHuman()).toBeNumber();
			expect(fast.toHuman()).toBe(0.00615);
		});

		test("vote", async () => {
			nock(/.+/)
				.get("/api/v2/fees")
				.reply(200, await require(`../test/fixtures/client/fees.json`))
				.persist();

			const transaction = await (
				await createService(TransactionService, "lsk.testnet", (container) => {
					container.constant(IoC.BindingType.Container, container);
					container.singleton(IoC.BindingType.AddressService, AddressService);
					container.singleton(IoC.BindingType.ClientService, ClientService);
					container.singleton(IoC.BindingType.FeeService, FeeService);
					container.constant(IoC.BindingType.DataTransferObjects, DataTransferObjects);
					container.singleton(
						IoC.BindingType.DataTransferObjectService,
						Services.AbstractDataTransferObjectService,
					);
					container.singleton(IoC.BindingType.KeyPairService, KeyPairService);
					container.singleton(IoC.BindingType.LedgerService, LedgerService);
					container.singleton(IoC.BindingType.PublicKeyService, PublicKeyService);
					container.singleton(IoC.BindingType.MultiSignatureService, MultiSignatureService);
					container.singleton(BindingType.AssetSerializer, AssetSerializer);
					container.singleton(BindingType.TransactionSerializer, TransactionSerializer);
				})
			).vote({
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

			expect(slow.toHuman()).toBeNumber();
			expect(slow.toHuman()).toBe(0.00142);
			expect(average.toHuman()).toBeNumber();
			expect(average.toHuman()).toBe(0.00142);
			expect(fast.toHuman()).toBeNumber();
			expect(fast.toHuman()).toBe(0.00142);
		});

		test("unlockToken", async () => {
			nock(/.+/)
				.get("/api/v2/fees")
				.reply(200, await require(`../test/fixtures/client/fees.json`))
				.persist();

			const transaction = await (
				await createService(TransactionService, "lsk.testnet", (container) => {
					container.constant(IoC.BindingType.Container, container);
					container.singleton(IoC.BindingType.AddressService, AddressService);
					container.singleton(IoC.BindingType.ClientService, ClientService);
					container.singleton(IoC.BindingType.FeeService, FeeService);
					container.constant(IoC.BindingType.DataTransferObjects, DataTransferObjects);
					container.singleton(
						IoC.BindingType.DataTransferObjectService,
						Services.AbstractDataTransferObjectService,
					);
					container.singleton(IoC.BindingType.KeyPairService, KeyPairService);
					container.singleton(IoC.BindingType.LedgerService, LedgerService);
					container.singleton(IoC.BindingType.PublicKeyService, PublicKeyService);
					container.singleton(IoC.BindingType.MultiSignatureService, MultiSignatureService);
					container.singleton(BindingType.AssetSerializer, AssetSerializer);
					container.singleton(BindingType.TransactionSerializer, TransactionSerializer);
				})
			).unlockToken({
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
							delegateAddress: "lskp4agpmjwgw549xdrhgdt6dfwqrpvohgbkhyt8p",
							amount: `${10e8}`,
							unvoteHeight: 14548929,
						},
					],
				},
			});

			const slow = await subject.calculate(transaction, { priority: "slow" });
			const average = await subject.calculate(transaction, { priority: "average" });
			const fast = await subject.calculate(transaction, { priority: "fast" });

			expect(slow.toHuman()).toBeNumber();
			expect(slow.toHuman()).toBe(0.00142);
			expect(average.toHuman()).toBeNumber();
			expect(average.toHuman()).toBe(0.00142);
			expect(fast.toHuman()).toBeNumber();
			expect(fast.toHuman()).toBe(0.00142);
		});
	});
});
