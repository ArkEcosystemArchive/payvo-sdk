import { IoC, Services, Test } from "@payvo/sdk";
import { BigNumber } from "@payvo/sdk-helpers";
import nock from "nock";

import { identity } from "../test/fixtures/identity";
import { createService, mockWallet, requireModule } from "../test/mocking";
import { SignedTransactionData } from "./signed-transaction.dto";
import { WalletData } from "./wallet.dto";
import { ClientService } from "./client.service";
import { ConfirmedTransactionData } from "./confirmed-transaction.dto";
import { BindingType } from "./constants";

const fixtures = `../test/fixtures/client`;

let subject: ClientService;

test.before(async () => {
	nock.disableNetConnect();

	subject = await createService(ClientService, undefined, (container) => {
		container.constant(BindingType.Zilliqa, mockWallet());
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
			.post("/")
			.reply(200, requireModule(`${fixtures}/transaction.json`));

		const result = await subject.transaction("b2e78cb571fcee734fb6e3e34a16d735e3a3550c09100b79d017dd364b8770cb");

		assert.is(result instanceof ConfirmedTransactionData);
		assert.is(result.id(), "b2e78cb571fcee734fb6e3e34a16d735e3a3550c09100b79d017dd364b8770cb");
		assert.is(result.isConfirmed(), true);
		assert.is(result.sender(), "0xE77555ff2103cAF9b8Ed5AC46277A50504bbC0EE");
		assert.is(result.recipient(), "0xA54E49719267E8312510D7b78598ceF16ff127CE");
		assert.is(result.amount(), BigNumber.make(1));
		assert.is(result.fee(), BigNumber.make("0.1"));
	});

	test("#wallet", async () => {
		nock(/.+/)
			.post("/")
			.reply(200, requireModule(`${fixtures}/wallet.json`));

		const result = await subject.wallet({
			type: "address",
			value: identity.address,
		});

		assert.is(result instanceof WalletData);
		assert.is(result.address(), identity.address);
		assert.is(result.balance().available, BigNumber.make(499890000000));
		assert.is(result.nonce(), BigNumber.make(1));
	});

	describe("#broadcast", () => {
		test("should pass", async () => {
			nock(/.+/)
				.post("/")
				.reply(200, requireModule(`${fixtures}/broadcast-minimum-gas-price.json`))
				.post("/")
				.reply(200, requireModule(`${fixtures}/broadcast-create.json`))
				.post("/")
				.reply(200, requireModule(`${fixtures}/broadcast-success.json`));

			const signedData = {
				sender: "",
				recipient: "",
				amount: "",
				fee: "2000000000",
			};

			const broadcastData = JSON.stringify(requireModule(`${fixtures}/broadcast-request-payload.json`));
			const transaction = createService(SignedTransactionData).configure("id", signedData, broadcastData);
			const result = await subject.broadcast([transaction]);

			assert.is(result, {
				accepted: ["id"],
				rejected: [],
				errors: {},
			});
		});

		test("should fail", async () => {
			nock(/.+/)
				.post("/")
				.reply(200, requireModule(`${fixtures}/broadcast-minimum-gas-price.json`))
				.post("/")
				.reply(200, requireModule(`${fixtures}/broadcast-failure.json`));

			const signedData = {
				sender: "",
				recipient: "",
				amount: "",
				fee: "2000000000", // keeping it high here to test lib code
			};

			const broadcastData = JSON.stringify(requireModule(`${fixtures}/broadcast-request-payload.json`));
			const transaction = createService(SignedTransactionData).configure("id", signedData, broadcastData);
			const result = await subject.broadcast([transaction]);

			assert.is(result, {
				accepted: [],
				rejected: ["id"],
				errors: {
					id: "GasPrice 1 lower than minimum allowable 2000000000",
				},
			});
		});
	});
});
