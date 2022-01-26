import { IoC, Services, Signatories } from "@payvo/sdk";
import { describe } from "@payvo/sdk-test";

import { identity } from "../test/fixtures/identity.js";
import { createService } from "../test/mocking.js";
import { AddressService } from "./address.service.js";
import { ClientService } from "./client.service.js";
import { ConfirmedTransactionData } from "./confirmed-transaction.dto.js";
import { FeeService } from "./fee.service.js";
import { KeyPairService } from "./key-pair.service.js";
import { LedgerService } from "./ledger.service.js";
import { MultiSignatureService } from "./multi-signature.service.js";
import { MultiSignatureSigner } from "./multi-signature.signer.js";
import { PublicKeyService } from "./public-key.service.js";
import { SignedTransactionData } from "./signed-transaction.dto.js";
import { TransactionService } from "./transaction.service.js";
import { WalletData } from "./wallet.dto.js";

describe("FeeService", async ({ assert, nock, it, loader }) => {
	const normaliseFees = (transaction) => ({
		avg: transaction.avg,
		isDynamic: transaction.isDynamic,
		max: transaction.max,
		min: transaction.min,
		static: transaction.static,
	});

	it("should get the fees for ARK", async () => {
		nock.fake(/.+/)
			.get("/api/node/fees")
			.reply(200, loader.json(`test/fixtures/client/feesByNode.json`))
			.get("/api/transactions/fees")
			.reply(200, loader.json(`test/fixtures/client/feesByType.json`));

		const result = await (await createService(FeeService, "ark.devnet")).all();

		assert.containKeys(result, [
			"transfer",
			"secondSignature",
			"delegateRegistration",
			"vote",
			"multiSignature",
			"ipfs",
			"multiPayment",
			"delegateResignation",
		]);

		assert.snapshot("fees_ark_transfer", normaliseFees(result.transfer));
		assert.snapshot("fees_ark_second_signature", normaliseFees(result.secondSignature));
		assert.snapshot("fees_ark_delegate_registration", normaliseFees(result.delegateRegistration));
		assert.snapshot("fees_ark_vote", normaliseFees(result.vote));
		assert.snapshot("fees_ark_multi_signature", normaliseFees(result.multiSignature));
		assert.snapshot("fees_ark_ipfs", normaliseFees(result.ipfs));
		assert.snapshot("fees_ark_multi_payment", normaliseFees(result.multiPayment));
		assert.snapshot("fees_ark_delegate_resignation", normaliseFees(result.delegateResignation));
	});

	it("should get the fees for BIND", async () => {
		nock.fake(/.+/)
			.get("/api/node/fees")
			.reply(200, loader.json(`test/fixtures/client/feesByNode-bind.json`))
			.get("/api/transactions/fees")
			.reply(200, loader.json(`test/fixtures/client/feesByType-bind.json`));

		const result = await (await createService(FeeService, "bind.testnet")).all();

		assert.containKeys(result, [
			"transfer",
			"secondSignature",
			"delegateRegistration",
			"vote",
			"multiSignature",
			"ipfs",
			"multiPayment",
			"delegateResignation",
		]);

		assert.snapshot("fees_bind_transfer", normaliseFees(result.transfer));
		assert.snapshot("fees_bind_second_signature", normaliseFees(result.secondSignature));
		assert.snapshot("fees_bind_delegate_registration", normaliseFees(result.delegateRegistration));
		assert.snapshot("fees_bind_vote", normaliseFees(result.vote));
		assert.snapshot("fees_bind_multi_signature", normaliseFees(result.multiSignature));
		assert.snapshot("fees_bind_ipfs", normaliseFees(result.ipfs));
		assert.snapshot("fees_bind_multi_payment", normaliseFees(result.multiPayment));
		assert.snapshot("fees_bind_delegate_resignation", normaliseFees(result.delegateResignation));
	});

	it("should calculate the fees for ARK multi-signature registrations", async () => {
		nock.fake(/.+/)
			.get(`/api/wallets/${identity.address}`)
			.reply(200, { data: { nonce: "1" } })
			.get("/api/node/fees")
			.reply(200, loader.json(`test/fixtures/client/feesByNode.json`))
			.get("/api/transactions/fees")
			.reply(200, loader.json(`test/fixtures/client/feesByType.json`))
			.persist();

		const a = await (
			await createService(FeeService, "ark.devnet")
		).calculate(
			await (
				await createService(TransactionService, "ark.devnet", (container) => {
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
					container.factory(MultiSignatureSigner);
				})
			).multiSignature({
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
				signatory: new Signatories.Signatory(
					new Signatories.MnemonicSignatory({
						address: identity.address,
						privateKey: "privateKey",
						publicKey: "publicKey",
						signingKey: identity.mnemonic,
					}),
				),
			}),
		);

		const b = await (await createService(FeeService, "ark.devnet")).calculate({ type: 1, data: () => ({}) });

		assert.is(a.toHuman(), 50); // Signatures + Base 5
		assert.is(b.toHuman(), 0);
	});
});
