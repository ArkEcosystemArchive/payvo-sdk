import { IoC, Services, Test } from "@payvo/sdk";
import nock from "nock";

import { createService } from "../test/mocking";
import { ClientService } from "./client.service";
import { SignedTransactionData } from "./signed-transaction.dto";
import { ConfirmedTransactionData } from "./confirmed-transaction.dto";
import { WalletData } from "./wallet.dto";

let subject: ClientService;

test.before(async () => {
	nock.disableNetConnect();

	subject = await createService(ClientService, undefined, (container) => {
		container.constant(IoC.BindingType.Container, container);
		container.constant(IoC.BindingType.DataTransferObjects, {
			SignedTransactionData,
			ConfirmedTransactionData,
			WalletData,
		});
		container.singleton(IoC.BindingType.DataTransferObjectService, Services.AbstractDataTransferObjectService);
	});
});

test.after.each(() => nock.cleanAll());

test.before(async () => {
	nock.disableNetConnect();
});

describe("ClientService", () => {
	test("#transaction", async () => {
		nock(/.+/)
			.get("/v1.0/transaction/c2e6e2c75357b7d69d735d5ce7d7e9a77291477d0a11ba158b5cf39317398f66")
			.reply(200, loader.json(`test/fixtures/client/transaction.json`));

		const result = await subject.transaction("c2e6e2c75357b7d69d735d5ce7d7e9a77291477d0a11ba158b5cf39317398f66");

		assert.is(result instanceof ConfirmedTransactionData);
	});

	test("#transactions", async () => {
		nock(/.+/)
			.get("/v1.0/address/erd17uy64y9zw8zd4xz5d2deqmxfxkk3zfuj0jh24k0s5jqhet3pz0esng60j7/transactions")
			.reply(200, loader.json(`test/fixtures/client/transactions.json`));

		const result = await subject.transactions({
			identifiers: [{ type: "address", value: "erd17uy64y9zw8zd4xz5d2deqmxfxkk3zfuj0jh24k0s5jqhet3pz0esng60j7" }],
		});

		assert.is(result, "object");
		assert.is(result.items()[0] instanceof ConfirmedTransactionData);
	});

	test("#wallet", async () => {
		nock(/.+/)
			.get("/v1.0/address/erd17uy64y9zw8zd4xz5d2deqmxfxkk3zfuj0jh24k0s5jqhet3pz0esng60j7")
			.reply(200, loader.json(`test/fixtures/client/wallet.json`));

		const result = await subject.wallet({
			type: "address",
			value: "erd17uy64y9zw8zd4xz5d2deqmxfxkk3zfuj0jh24k0s5jqhet3pz0esng60j7",
		});

		assert.is(result instanceof WalletData);
	});
});