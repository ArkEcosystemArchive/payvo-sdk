import { assert, loader, test } from "@payvo/sdk-test";
import { IoC, Services, Signatories } from "@payvo/sdk";
import {nock} from "@payvo/sdk-test";

import { createService } from "../test/mocking";
import { identity } from "../test/fixtures/identity";
import { FeeService } from "./fee.service";
import { AddressService } from "./address.service";
import { ClientService } from "./client.service";
import { KeyPairService } from "./key-pair.service";
import { LedgerService } from "./ledger.service";
import { PublicKeyService } from "./public-key.service";
import { MultiSignatureService } from "./multi-signature.service";
import { BindingType } from "./coin.contract";
import { TransactionService } from "./transaction.service";
import { MultiSignatureSigner } from "./multi-signature.signer";
import { SignedTransactionData } from "./signed-transaction.dto";
import { ConfirmedTransactionData } from "./confirmed-transaction.dto";
import { WalletData } from "./wallet.dto";

const matchSnapshot = (name, transaction) =>
	assert.snapshot(name, {
		min: transaction.min,
		avg: transaction.avg,
		max: transaction.max,
		static: transaction.static,
		isDynamic: transaction.isDynamic,
	});

test.after.each(() => nock.cleanAll());

test.before(() => nock.disableNetConnect());

test("should get the fees for ARK", async () => {
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
		"htlcLock",
		"htlcClaim",
		"htlcRefund",
	]);

	matchSnapshot("fees_ark_transfer", result.transfer);
	matchSnapshot("fees_ark_second_signature", result.secondSignature);
	matchSnapshot("fees_ark_delegate_registration", result.delegateRegistration);
	matchSnapshot("fees_ark_vote", result.vote);
	matchSnapshot("fees_ark_multi_signature", result.multiSignature);
	matchSnapshot("fees_ark_ipfs", result.ipfs);
	matchSnapshot("fees_ark_multi_payment", result.multiPayment);
	matchSnapshot("fees_ark_delegate_resignation", result.delegateResignation);
	matchSnapshot("fees_ark_htlc_lock", result.htlcLock);
	matchSnapshot("fees_ark_htlc_claim", result.htlcClaim);
	matchSnapshot("fees_ark_htlc_refund", result.htlcRefund);
});

test("should get the fees for BIND", async () => {
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
		"htlcLock",
		"htlcClaim",
		"htlcRefund",
	]);

	matchSnapshot("fees_bind_transfer", result.transfer);
	matchSnapshot("fees_bind_second_signature", result.secondSignature);
	matchSnapshot("fees_bind_delegate_registration", result.delegateRegistration);
	matchSnapshot("fees_bind_vote", result.vote);
	matchSnapshot("fees_bind_multi_signature", result.multiSignature);
	matchSnapshot("fees_bind_ipfs", result.ipfs);
	matchSnapshot("fees_bind_multi_payment", result.multiPayment);
	matchSnapshot("fees_bind_delegate_resignation", result.delegateResignation);
	matchSnapshot("fees_bind_htlc_lock", result.htlcLock);
	matchSnapshot("fees_bind_htlc_claim", result.htlcClaim);
	matchSnapshot("fees_bind_htlc_refund", result.htlcRefund);
});

test("should calculate the fees for ARK multi-signature registrations", async () => {
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

test.run();
