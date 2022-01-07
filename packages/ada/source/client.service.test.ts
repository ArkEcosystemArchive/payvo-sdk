import { describe } from "@payvo/sdk-test";
import { DTO, IoC, Services } from "@payvo/sdk";
import { BigNumber } from "@payvo/sdk-helpers";

import { createService } from "../test/mocking";
import { SignedTransactionData } from "./signed-transaction.dto.js";
import { WalletData } from "./wallet.dto.js";
import { ClientService } from "./client.service.js";
import { TransactionService } from "./transaction.service.js";
import { ConfirmedTransactionData } from "./confirmed-transaction.dto.js";

describe("ClientService", async ({ assert, beforeAll, it, nock, loader }) => {
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

	it("#wallet should succeed", async (context) => {
		nock.fake(/.+/)
			.post("/")
			.reply(200, loader.json(`test/fixtures/client/transactions-0.json`))
			.post("/")
			.reply(200, loader.json(`test/fixtures/client/transactions-20.json`))
			.post("/")
			.reply(200, loader.json(`test/fixtures/client/utxos-aggregate.json`));

		const result = await context.subject.wallet({
			type: "address",
			value: "aec30330deaecdd7503195a0d730256faef87027022b1bdda7ca0a61bca0a55e4d575af5a93bdf4905a3702fadedf451ea584791d233ade90965d608bac57304",
		});

		assert.instance(result, WalletData);
		assert.is(
			result.address(),
			"aec30330deaecdd7503195a0d730256faef87027022b1bdda7ca0a61bca0a55e4d575af5a93bdf4905a3702fadedf451ea584791d233ade90965d608bac57304",
		);
		assert.object(result.balance());
	});

	it("#transactions should succeed", async (context) => {
		nock.fake(/.+/)
			.post("/")
			.reply(200, loader.json(`test/fixtures/client/transactions-0.json`))
			.post("/")
			.reply(200, loader.json(`test/fixtures/client/transactions-20.json`))
			.post("/")
			.reply(200, loader.json(`test/fixtures/client/transactions.json`));

		const result = await context.subject.transactions({
			senderPublicKey:
				"aec30330deaecdd7503195a0d730256faef87027022b1bdda7ca0a61bca0a55e4d575af5a93bdf4905a3702fadedf451ea584791d233ade90965d608bac57304",
		});
		assert.length(result.items(), 5);
		assert.instance(result.items()[0], ConfirmedTransactionData);
	});

	it("#transactions should fail if the sender public key is missing", async (context) => {
		await assert.rejects(
			() =>
				context.subject.transactions({
					identifiers: [
						{
							type: "extendedPublicKey",
							value: "aec30330deaecdd7503195a0d730256faef87027022b1bdda7ca0a61bca0a55e4d575af5a93bdf4905a3702fadedf451ea584791d233ade90965d608bac57304",
						},
					],
				}),
			"Method ClientService#transactions expects the argument [senderPublicKey] but it was not given",
		);

		await assert.rejects(
			() => context.subject.transactions({}),
			"Method ClientService#transactions expects the argument [senderPublicKey] but it was not given",
		);
	});

	it("#transaction should succeed", async (context) => {
		nock.fake(/.+/).post(/.*/).reply(200, loader.json(`test/fixtures/client/transaction.json`));

		const result = await context.subject.transaction(
			"35b40547f04963d3b41478fc27038948d74718802c486d9125f1884d8c83a31d",
		);
		assert.instance(result, ConfirmedTransactionData);
		assert.is(result.id(), "35b40547f04963d3b41478fc27038948d74718802c486d9125f1884d8c83a31d");

		assert.undefined(result.blockId());

		assert.is(result.timestamp()?.toISOString(), "2021-02-05T15:04:16.000Z");

		assert.is(result.confirmations().toString(), "0");

		assert.is(
			result.sender(),
			"addr_test1qrhvwtn8sa3duzkm93v5kjjxlv5lvg67j530wyeumngu23lk8ttq8f3gag0h89aepvx3xf69g0l9pf80tqv7cve0l33s4s8xvh",
		);

		assert.is(
			result.recipient(),
			"addr_test1qzct2hsralem3fqn8fupu90v3jkelpg4rfp4zqx06zgevpachk6az8jcydma5a6vgsuw5c37v0c8j6rlclpqajn2vxsq3rz4th",
		);

		const actual = result.recipients();
		assert.is(
			actual[0].address,
			"addr_test1qzct2hsralem3fqn8fupu90v3jkelpg4rfp4zqx06zgevpachk6az8jcydma5a6vgsuw5c37v0c8j6rlclpqajn2vxsq3rz4th",
		);
		assert.is(actual[0].amount.toString(), "25000000");
		assert.is(
			actual[1].address,
			"addr_test1qzfjfm724nv9qz6nfyagmj0j2uppr35gzv5qee8s7489wxlk8ttq8f3gag0h89aepvx3xf69g0l9pf80tqv7cve0l33scc4thv",
		);
		assert.is(actual[1].amount.toString(), "4831199");

		const inputs = result.inputs();
		assert.length(inputs, 1);
		assert.instance(inputs[0], DTO.UnspentTransactionData);
		assert.is(inputs[0].id(), "6bf76f4380da8a389ae0a7ecccf1922b74ae11d773ba8b1b761d84a1b4474a4f");
		assert.equal(inputs[0].amount(), BigNumber.make(30000000));
		assert.is(
			inputs[0].address(),
			"addr_test1qrhvwtn8sa3duzkm93v5kjjxlv5lvg67j530wyeumngu23lk8ttq8f3gag0h89aepvx3xf69g0l9pf80tqv7cve0l33s4s8xvh",
		);

		const outputs = result.outputs();
		assert.length(outputs, 2);
		assert.instance(outputs[0], DTO.UnspentTransactionData);
		assert.is(outputs[0].amount().toString(), "25000000");
		assert.is(
			outputs[0].address(),
			"addr_test1qzct2hsralem3fqn8fupu90v3jkelpg4rfp4zqx06zgevpachk6az8jcydma5a6vgsuw5c37v0c8j6rlclpqajn2vxsq3rz4th",
		);
		assert.instance(outputs[1], DTO.UnspentTransactionData);
		assert.is(outputs[1].amount().toString(), "4831199");
		assert.is(
			outputs[1].address(),
			"addr_test1qzfjfm724nv9qz6nfyagmj0j2uppr35gzv5qee8s7489wxlk8ttq8f3gag0h89aepvx3xf69g0l9pf80tqv7cve0l33scc4thv",
		);

		assert.is(result.amount().toString(), "25000000");

		assert.is(result.fee().toString(), "168801");
	});

	it("should handle broadcast accepted", async (context) => {
		nock.fake(/.+/)
			.post("/")
			.reply(200, loader.json(`test/fixtures/transaction/transactions-page-1.json`))
			.post("/")
			.reply(200, loader.json(`test/fixtures/transaction/transactions-page-2.json`))
			.post("/")
			.reply(200, loader.json(`test/fixtures/transaction/utxos.json`))
			.post("/")
			.reply(200, loader.json(`test/fixtures/transaction/expiration.json`))
			.post("/")
			.reply(201, loader.json(`test/fixtures/transaction/submit-tx.json`));

		const txService = createService(TransactionService, undefined, (container) => {
			container.constant(IoC.BindingType.Container, container);
			container.constant(IoC.BindingType.DataTransferObjects, {
				SignedTransactionData,
				ConfirmedTransactionData,
				WalletData,
			});
			container.singleton(IoC.BindingType.DataTransferObjectService, Services.AbstractDataTransferObjectService);
			container.singleton(IoC.BindingType.ClientService, ClientService);
		});

		const transfer = await createService(SignedTransactionData);
		transfer.configure(
			"3e3817fd0c35bc36674f3874c2953fa3e35877cbcdb44a08bdc6083dbd39d572",
			{
				amount: "1000000",
				fee: "168273",
				timestamp: "1970-01-01T00:00:00.000Z",
				sender: "publicKey",
				recipient:
					"addr_test1qpz03ezdyda8ag724zp3n5fqulay02dp7j9mweyeylcaapsxu2hyfhlkwuxupa9d5085eunq2qywy7hvmvej456flknscw3xw7",
			},
			"83a40081825820844def3c505ec24317f8f539a001989951c37a9dea5764e87e60654a86358a4d0001828258390044f8e44d237a7ea3caa88319d120e7fa47a9a1f48bb7649927f1de8606e2ae44dff6770dc0f4ada3cf4cf2605008e27aecdb332ad349fda71a000f4240825839009324efcaacd8500b53493a8dc9f2570211c68813280ce4f0f54e571bf63ad603a628ea1f7397b90b0d13274543fe50a4ef5819ec332ffc631a3b74159e021a00029151031a016c301ea10081825820f9162b91126212b71500e89dc7da31111dfc1466a9f24f48a34e7ea529d2d3385840df186965621768ce54cbe83493e8c5e3feba56f24c15f9033802254e566afc1eadb15af83068dc76cdb243fc7b3d58dd9849bf9d7a83fa2a1b7499f96a723c01f6",
		);

		const transactions = [transfer];
		const result = await context.subject.broadcast(transactions);
		assert.equal(result, {
			accepted: ["3e3817fd0c35bc36674f3874c2953fa3e35877cbcdb44a08bdc6083dbd39d572"],
			rejected: [],
			errors: {},
		});
	});

	it("should handle broadcast rejected", async (context) => {
		nock.fake(/.+/).post("/").reply(201, loader.json(`test/fixtures/transaction/submit-tx-failed.json`));

		const transactions = [
			createService(SignedTransactionData).configure(
				"35e95e8851fb6cc2fadb988d0a6e514386ac7a82a0d40baca34d345740e9657f",
				{
					sender: "addr_test1qpz03ezdyda8ag724zp3n5fqulay02dp7j9mweyeylcaapsxu2hyfhlkwuxupa9d5085eunq2qywy7hvmvej456flknscw3xw7",
					recipient:
						"addr_test1qpz03ezdyda8ag724zp3n5fqulay02dp7j9mweyeylcaapsxu2hyfhlkwuxupa9d5085eunq2qywy7hvmvej456flknscw3xw7",
					amount: "1000000",
					fee: "168273",
				},
				"83a4008182582022e6ff48fc1ed9d8ed87eb416b1c45e93b5945a3dc31d7d14ccdeb93174251f40001828258390044f8e44d237a7ea3caa88319d120e7fa47a9a1f48bb7649927f1de8606e2ae44dff6770dc0f4ada3cf4cf2605008e27aecdb332ad349fda71a000f42408258390044f8e44d237a7ea3caa88319d120e7fa47a9a1f48bb7649927f1de8606e2ae44dff6770dc0f4ada3cf4cf2605008e27aecdb332ad349fda71a3888e035021a00029151031a0121e3e0a10081825820cf779aa32f35083707808532471cb64ee41426c9bbd46134dac2ac5b2a0ec0e95840fecc6f5e8fbe05a00c60998476a9102463311ffeea5b890b3bbbb0a3c933a420ff50d9a951b11ca36a491eef32d164abf21fde26d53421ce68aff2d17372a20cf6",
			),
		];
		const result = await context.subject.broadcast(transactions);
		assert.equal(result, {
			accepted: [],
			rejected: ["35e95e8851fb6cc2fadb988d0a6e514386ac7a82a0d40baca34d345740e9657f"],
			errors: {
				"35e95e8851fb6cc2fadb988d0a6e514386ac7a82a0d40baca34d345740e9657f":
					"HTTP request returned status code 400: Response code 400 (Bad Request)",
			},
		});
	});
});
