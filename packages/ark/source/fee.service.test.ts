import { IoC, Services, Signatories, Test } from "@payvo/sdk";
import nock from "nock";

import { createService, requireModule } from "../test/mocking.js";
import { identity } from "../test/fixtures/identity.js";
import { FeeService } from "./fee.service.js";
import { AddressService } from "./address.service.js";
import { ClientService } from "./client.service.js";
import { KeyPairService } from "./key-pair.service.js";
import { LedgerService } from "./ledger.service.js";
import { PublicKeyService } from "./public-key.service.js";
import { MultiSignatureService } from "./multi-signature.service.js";
import { BindingType } from "./coin.contract.js";
import { TransactionService } from "./transaction.service.js";
import { MultiSignatureSigner } from "./multi-signature.signer.js";
import { SignedTransactionData } from "./signed-transaction.dto.js";
import { ConfirmedTransactionData } from "./confirmed-transaction.dto.js";
import { WalletData } from "./wallet.dto.js";

const matchSnapshot = (transaction): void =>
	assert
		.is({
			min: transaction.min.toString(),
			avg: transaction.avg.toString(),
			max: transaction.max.toString(),
			static: transaction.static.toString(),
			isDynamic: transaction.isDynamic,
		})
		.toMatchSnapshot();

afterEach(() => nock.cleanAll());

beforeAll(() => nock.disableNetConnect());

describe("FeeService", () => {
	it("should get the fees for ARK", async () => {
		nock(/.+/)
			.get("/api/node/fees")
			.reply(200, requireModule(`../test/fixtures/client/feesByNode.json`))
			.get("/api/transactions/fees")
			.reply(200, requireModule(`../test/fixtures/client/feesByType.json`));

		const result = await (await createService(FeeService, "ark.devnet")).all();

		assert
			.is(result)
			.toContainAllKeys([
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

		matchSnapshot(result.transfer);
		matchSnapshot(result.secondSignature);
		matchSnapshot(result.delegateRegistration);
		matchSnapshot(result.vote);
		matchSnapshot(result.multiSignature);
		matchSnapshot(result.ipfs);
		matchSnapshot(result.multiPayment);
		matchSnapshot(result.delegateResignation);
		matchSnapshot(result.htlcLock);
		matchSnapshot(result.htlcClaim);
		matchSnapshot(result.htlcRefund);
	});

	it("should get the fees for BIND", async () => {
		nock(/.+/)
			.get("/api/node/fees")
			.reply(200, requireModule(`../test/fixtures/client/feesByNode-bind.json`))
			.get("/api/transactions/fees")
			.reply(200, requireModule(`../test/fixtures/client/feesByType-bind.json`));

		const result = await (await createService(FeeService, "bind.testnet")).all();

		assert
			.is(result)
			.toContainAllKeys([
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

		matchSnapshot(result.transfer);
		matchSnapshot(result.secondSignature);
		matchSnapshot(result.delegateRegistration);
		matchSnapshot(result.vote);
		matchSnapshot(result.multiSignature);
		matchSnapshot(result.ipfs);
		matchSnapshot(result.multiPayment);
		matchSnapshot(result.delegateResignation);
		matchSnapshot(result.htlcLock);
		matchSnapshot(result.htlcClaim);
		matchSnapshot(result.htlcRefund);
	});

	it("should calculate the fees for ARK multi-signature registrations", async () => {
		nock(/.+/)
			.get(`/api/wallets/${identity.address}`)
			.reply(200, { data: { nonce: "1" } })
			.get("/api/node/fees")
			.reply(200, requireModule(`../test/fixtures/client/feesByNode.json`))
			.get("/api/transactions/fees")
			.reply(200, requireModule(`../test/fixtures/client/feesByType.json`))
			.persist();

		const a = await (
			await createService(FeeService, "ark.devnet")
		).calculate(
			await (
				await createService(TransactionService, "ark.devnet", (container) => {
					container.constant(IoC.BindingType.Container, container);
					container.singleton(IoC.BindingType.AddressService, AddressService);
					container.singleton(IoC.BindingType.ClientService, ClientService);
					container.singleton(IoC.BindingType.FeeService, FeeService);
					container.constant(IoC.BindingType.DataTransferObjects, {
						SignedTransactionData,
						ConfirmedTransactionData,
						WalletData,
					});
					container.singleton(
						IoC.BindingType.DataTransferObjectService,
						Services.AbstractDataTransferObjectService,
					);
					container.singleton(IoC.BindingType.KeyPairService, KeyPairService);
					container.constant(IoC.BindingType.LedgerTransportFactory, async () => {});
					container.singleton(IoC.BindingType.LedgerService, LedgerService);
					container.singleton(IoC.BindingType.PublicKeyService, PublicKeyService);
					container.singleton(IoC.BindingType.MultiSignatureService, MultiSignatureService);
					container.singleton(BindingType.MultiSignatureSigner, MultiSignatureSigner);
				})
			).multiSignature({
				signatory: new Signatories.Signatory(
					new Signatories.MnemonicSignatory({
						signingKey: identity.mnemonic,
						address: identity.address,
						publicKey: "publicKey",
						privateKey: "privateKey",
					}),
				),
				data: {
					min: 2,
					publicKeys: [
						"030fde54605c5d53436217a2849d276376d0b0f12c71219cd62b0a4539e1e75acd", // 5
						"030fde54605c5d53436217a2849d276376d0b0f12c71219cd62b0a4539e1e75acd", // 10
						"030fde54605c5d53436217a2849d276376d0b0f12c71219cd62b0a4539e1e75acd", // 15
						"030fde54605c5d53436217a2849d276376d0b0f12c71219cd62b0a4539e1e75acd", // 20
						"030fde54605c5d53436217a2849d276376d0b0f12c71219cd62b0a4539e1e75acd", // 25
						"030fde54605c5d53436217a2849d276376d0b0f12c71219cd62b0a4539e1e75acd", // 30
						"030fde54605c5d53436217a2849d276376d0b0f12c71219cd62b0a4539e1e75acd", // 35
						"030fde54605c5d53436217a2849d276376d0b0f12c71219cd62b0a4539e1e75acd", // 40
						"030fde54605c5d53436217a2849d276376d0b0f12c71219cd62b0a4539e1e75acd", // 45
					],
				},
			}),
		);

		const b = await (await createService(FeeService, "ark.devnet")).calculate({ type: 1 });

		assert.is(a.toHuman(), 50); // Signatures + Base 5
		assert.is(b.toHuman(), 0);
	});
});
