import { assert, test } from "@payvo/sdk-test";
import { Collections, IoC, Services } from "@payvo/sdk";

import { createService } from "../test/mocking";
import { ClientService } from "./client.service";
import { SignedTransactionData } from "./signed-transaction.dto";
import { ConfirmedTransactionData } from "./confirmed-transaction.dto";
import { WalletData } from "./wallet.dto";

let subject;

test.before(async () => {
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

test("#transaction", async () => {
	const result = await subject.transaction("2qwe2tsgBZ5yqq6Qg2eTDPJ1tVVZZ9KoPLMDwurLTGTNpGMFr9");

	assert.instance(result, ConfirmedTransactionData);
});

test.skip("#transactions", async () => {
	const result = await subject.transactions({
		identifiers: [
			{
				type: "address",
				value: "X-fuji1my5kqjufcshudkzu4xdt5rlqk99j9nwseclkwq",
			},
		],
	});

	assert.instance(result, Collections.ConfirmedTransactionDataCollection);
});

test("#wallet", async () => {
	const result = await subject.wallet({
		type: "address",
		value: "X-fuji1my5kqjufcshudkzu4xdt5rlqk99j9nwseclkwq",
	});

	assert.instance(result, WalletData);
});

test("#delegates", async () => {
	assert.instance(await subject.delegates(), Collections.WalletDataCollection);
});

test.run();
