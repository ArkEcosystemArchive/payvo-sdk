import { Collections, IoC, Services, Test } from "@payvo/sdk";
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
	test("#transactions", async () => {
		nock("https://proxy.nanos.cc/")
			.post("/proxy")
			.reply(200, loader.json(`test/fixtures/client/transactions.json`));

		const result = await subject.transactions({
			identifiers: [
				{ type: "address", value: "nano_3t6k35gi95xu6tergt6p69ck76ogmitsa8mnijtpxm9fkcm736xtoncuohr3" },
			],
		});

		assert.is(result instanceof Collections.ConfirmedTransactionDataCollection);

		const transaction = result.items()[0];

		assert.is(transaction.id(), "85D0745BCE0390DDAE8B8CEA31139BEBD2F2041BB689F5518B65431337EC6532");
		assert.is(transaction.blockId(), "85D0745BCE0390DDAE8B8CEA31139BEBD2F2041BB689F5518B65431337EC6532");
		assert.is(transaction.timestamp()!.toISOString(), "2021-05-14T04:59:40.000Z");
		assert.is(transaction.sender(), "nano_37cyeqb7fwafs499i9k94sthkse1iq3k59efaknb5rpdbysgq8sb9fq46qd8");
		assert.is(transaction.recipient(), "nano_3t6k35gi95xu6tergt6p69ck76ogmitsa8mnijtpxm9fkcm736xtoncuohr3");
		assert.is(transaction.amount().toString(), "336536650000000000000000000000000");
	});

	test("#wallet", async () => {
		nock("https://proxy.nanos.cc/").post("/proxy").reply(200, loader.json(`test/fixtures/client/wallet.json`));

		const result = await subject.wallet({
			type: "address",
			value: "nano_3t6k35gi95xu6tergt6p69ck76ogmitsa8mnijtpxm9fkcm736xtoncuohr3",
		});

		assert.is(result instanceof WalletData);
		assert.is(result.toObject()).toMatchSnapshot();
	});
});
