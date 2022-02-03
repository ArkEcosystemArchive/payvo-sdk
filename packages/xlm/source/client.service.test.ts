import { describe, loader } from "@payvo/sdk-test";
import { IoC, Services, Signatories } from "@payvo/sdk";
import { DateTime } from "@payvo/sdk-intl";
import { BigNumber } from "@payvo/sdk-helpers";

import { identity } from "../test/fixtures/identity";
import { createService } from "../test/mocking";
import { ClientService } from "./client.service.js";
import { KeyPairService } from "./key-pair.service.js";
import { TransactionService } from "./transaction.service.js";
import { SignedTransactionData } from "./signed-transaction.dto.js";
import { ConfirmedTransactionData } from "./confirmed-transaction.dto.js";
import { WalletData } from "./wallet.dto.js";

describe("ClientService", async ({ beforeAll, it, assert, nock }) => {
	beforeAll(async (context) => {
		context.subject = await createService(ClientService, undefined, (container) => {
			container.constant(IoC.BindingType.Container, container);
			container.constant(IoC.BindingType.DataTransferObjects, {
				SignedTransactionData,
				ConfirmedTransactionData,
				WalletData,
			});
			container.singleton(IoC.BindingType.DataTransferObjectService, Services.AbstractDataTransferObjectService);
		});
	});

	it("#transaction", async (context) => {
		nock.fake("https://horizon-testnet.stellar.org")
			.get("/transactions/264226cb06af3b86299031884175155e67a02e0a8ad0b3ab3a88b409a8c09d5c")
			.query(true)
			.reply(200, loader.json(`test/fixtures/client/transaction.json`))
			.get("/transactions/264226cb06af3b86299031884175155e67a02e0a8ad0b3ab3a88b409a8c09d5c/operations")
			.query(true)
			.reply(200, loader.json(`test/fixtures/client/transaction-operations.json`));

		const result = await context.subject.transaction(
			"264226cb06af3b86299031884175155e67a02e0a8ad0b3ab3a88b409a8c09d5c",
		);

		assert.instance(result, ConfirmedTransactionData);
		assert.is(result.id(), "264226cb06af3b86299031884175155e67a02e0a8ad0b3ab3a88b409a8c09d5c");
		assert.is(result.type(), "transfer");
		assert.instance(result.timestamp(), DateTime);
		assert.is(result.sender(), "GAHXEI3BVFOBDHWLC4TJKCGTLY6VMTKMRRWWPKNPPULUC7E3PD63ENKO");
		assert.is(result.recipient(), "GB2V4J7WTTKLIN5O3QPUAQCOLLIIULJM3FHHAQ7GEQ5EH53BXXQ47HU3");
		assert.equal(result.amount(), BigNumber.make("10000000"));
		assert.equal(result.fee(), BigNumber.make("1000000000"));
		assert.undefined(result.memo());
	});

	it("#transactions", async (context) => {
		nock.fake("https://horizon-testnet.stellar.org")
			.get("/accounts/GAHXEI3BVFOBDHWLC4TJKCGTLY6VMTKMRRWWPKNPPULUC7E3PD63ENKO/payments")
			.query(true)
			.reply(200, loader.json(`test/fixtures/client/transactions.json`));

		const response = await context.subject.transactions({
			identifiers: [{ type: "address", value: "GAHXEI3BVFOBDHWLC4TJKCGTLY6VMTKMRRWWPKNPPULUC7E3PD63ENKO" }],
		});

		assert.instance(response.items()[0], ConfirmedTransactionData);
		assert.is(response.items()[0].id(), "7cea6abe90654578b42ee696e823187d89d91daa157a1077b542ee7c77413ce3");
		assert.is(response.items()[0].type(), "transfer");
		assert.instance(response.items()[0].timestamp(), DateTime);
		assert.is(response.items()[0].sender(), "GAGLYFZJMN5HEULSTH5CIGPOPAVUYPG5YSWIYDJMAPIECYEBPM2TA3QR");
		assert.is(response.items()[0].recipient(), "GBYUUJHG6F4EPJGNLERINATVQLNDOFRUD7SGJZ26YZLG5PAYLG7XUSGF");
		assert.equal(response.items()[0].amount(), BigNumber.make("10000000000000"));
		assert.undefined(response.items()[0].memo());
	});

	it("#wallet", async (context) => {
		nock.fake("https://horizon-testnet.stellar.org")
			.get("/accounts/GD42RQNXTRIW6YR3E2HXV5T2AI27LBRHOERV2JIYNFMXOBA234SWLQQB")
			.query(true)
			.reply(200, loader.json(`test/fixtures/client/wallet.json`));

		const result = await context.subject.wallet({
			type: "address",
			value: "GD42RQNXTRIW6YR3E2HXV5T2AI27LBRHOERV2JIYNFMXOBA234SWLQQB",
		});

		assert.instance(result, WalletData);
		assert.is(result.address(), "GD42RQNXTRIW6YR3E2HXV5T2AI27LBRHOERV2JIYNFMXOBA234SWLQQB");
		assert.is(result.publicKey(), "GD42RQNXTRIW6YR3E2HXV5T2AI27LBRHOERV2JIYNFMXOBA234SWLQQB");
		assert.equal(result.balance().available, BigNumber.make("100000000000000"));
		assert.equal(result.nonce(), BigNumber.make("7275146318446606"));
	});

	it("broadcast should pass", async (context) => {
		nock.fake("https://horizon-testnet.stellar.org")
			.get("/accounts/GCGYSPQBSQCJKNDXDISBSXAM3THK7MACUVZGEMXF6XRZCPGAWCUGXVNC")
			.query(true)
			.reply(200, loader.json(`test/fixtures/client/wallet.json`))
			.persist();

		nock.fake("https://horizon-testnet.stellar.org")
			.post("/transactions")
			.reply(200, loader.json(`test/fixtures/client/broadcast.json`));

		const transactionService = createService(TransactionService, undefined, (container) => {
			container.constant(IoC.BindingType.Container, container);
			container.constant(IoC.BindingType.DataTransferObjects, {
				SignedTransactionData,
				ConfirmedTransactionData,
				WalletData,
			});
			container.singleton(IoC.BindingType.DataTransferObjectService, Services.AbstractDataTransferObjectService);
			container.singleton(IoC.BindingType.ClientService, ClientService);
			container.singleton(IoC.BindingType.KeyPairService, KeyPairService);
		});

		const result = await context.subject.broadcast([
			await transactionService.transfer({
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
			}),
		]);

		assert.equal(result, {
			accepted: ["54600f7b16c2c061ff2d3c96fad6e719039eba94618346717d7dc912c40466e0"],
			rejected: [],
			errors: {},
		});
	});

	it("broadcast should fail", async (context) => {
		nock.fake("https://horizon-testnet.stellar.org")
			.get("/accounts/GCGYSPQBSQCJKNDXDISBSXAM3THK7MACUVZGEMXF6XRZCPGAWCUGXVNC")
			.query(true)
			.reply(200, loader.json(`test/fixtures/client/wallet.json`))
			.persist();

		nock.fake("https://horizon-testnet.stellar.org")
			.post("/transactions")
			.reply(400, loader.json(`test/fixtures/client/broadcast-failure.json`));

		const transactionService = createService(TransactionService, undefined, (container) => {
			container.constant(IoC.BindingType.Container, container);
			container.constant(IoC.BindingType.DataTransferObjects, {
				SignedTransactionData,
				ConfirmedTransactionData,
				WalletData,
			});
			container.singleton(IoC.BindingType.DataTransferObjectService, Services.AbstractDataTransferObjectService);
			container.singleton(IoC.BindingType.ClientService, ClientService);
			container.singleton(IoC.BindingType.KeyPairService, KeyPairService);
		});

		const result = await context.subject.broadcast([
			await transactionService.transfer({
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
			}),
		]);

		assert.equal(result.accepted, []);
		assert.string(result.rejected[0]);
		assert.is(result.errors[result.rejected[0]], '["op_underfunded"]');
	});
});
