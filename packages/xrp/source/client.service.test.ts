import { describe, loader } from "@payvo/sdk-test";
import { IoC, Services } from "@payvo/sdk";
import { DateTime } from "@payvo/sdk-intl";
import { BigNumber } from "@payvo/sdk-helpers";

import { createService } from "../test/mocking";
import { SignedTransactionData } from "./signed-transaction.dto.js";
import { WalletData } from "./wallet.dto.js";
import { ClientService } from "./client.service.js";
import { ConfirmedTransactionData } from "./confirmed-transaction.dto.js";

describe("ClientService", async ({ beforeAll, afterEach, it, assert, nock }) => {
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

	afterEach(() => nock.cleanAll());

	it("#transaction should succeed", async (context) => {
		nock.fake(/.+/).post("/").reply(200, loader.json(`test/fixtures/client/transaction.json`));

		const result = await context.subject.transaction(
			"F4AB442A6D4CBB935D66E1DA7309A5FC71C7143ED4049053EC14E3875B0CF9BF",
		);

		assert.instance(result, ConfirmedTransactionData);
		assert.is(result.id(), "F4AB442A6D4CBB935D66E1DA7309A5FC71C7143ED4049053EC14E3875B0CF9BF");
		assert.is(result.type(), "transfer");
		assert.instance(result.timestamp(), DateTime);
		assert.equal(result.confirmations(), BigNumber.ZERO);
		assert.is(result.sender(), "r9cZA1mLK5R5Am25ArfXFmqgNwjZgnfk59");
		assert.is(result.recipient(), "r3PDtZSa5LiYp1Ysn1vMuMzB59RzV3W9QH");
		assert.equal(result.amount(), BigNumber.make(1000));
		assert.equal(result.fee(), BigNumber.make(10000000));
		assert.undefined(result.memo());
	});

	it("#transactions should succeed", async (context) => {
		nock.fake(/.+/).post("/").reply(200, loader.json(`test/fixtures/client/transactions.json`));

		const result = await context.subject.transactions({
			identifiers: [{ type: "address", value: "r9cZA1mLK5R5Am25ArfXFmqgNwjZgnfk59" }],
			limit: 10,
		});

		assert.instance(result.items()[0], ConfirmedTransactionData);
		assert.is(result.items()[0].id(), "08EF5BDA2825D7A28099219621CDBECCDECB828FEA202DEB6C7ACD5222D36C2C");
		assert.is(result.items()[0].type(), "transfer");
		assert.instance(result.items()[0].timestamp(), DateTime);
		assert.equal(result.items()[0].confirmations(), BigNumber.ZERO);
		assert.is(result.items()[0].sender(), "rLNaPoKeeBjZe2qs6x52yVPZpZ8td4dc6w");
		assert.is(result.items()[0].recipient(), "raLPjTYeGezfdb6crXZzcC8RkLBEwbBHJ5");
		assert.equal(result.items()[0].amount(), BigNumber.make("455643030000000"));
		assert.equal(result.items()[0].fee(), BigNumber.make(40000000));
	});

	it("#wallet should succeed", async (context) => {
		nock.fake(/.+/).post("/").reply(200, loader.json(`test/fixtures/client/wallet.json`));

		const result = await context.subject.wallet({
			type: "address",
			value: "r9cZA1mLK5R5Am25ArfXFmqgNwjZgnfk59",
		});

		assert.instance(result, WalletData);
		assert.is(result.address(), "r9cZA1mLK5R5Am25ArfXFmqgNwjZgnfk59");
		assert.undefined(result.publicKey());
		assert.equal(result.balance().available, BigNumber.make("1331561268500000000"));
	});

	const transactionPayload = createService(SignedTransactionData).configure(
		"id",
		"12000322000000002400000017201B0086955468400000000000000C732102F89EAEC7667B30F33D0687BBA86C3FE2A08CCA40A9186C5BDE2DAA6FA97A37D87446304402207660BDEF67105CE1EBA9AD35DC7156BAB43FF1D47633199EE257D70B6B9AAFBF02207F5517BC8AEF2ADC1325897ECDBA8C673838048BCA62F4E98B252F19BE88796D770A726970706C652E636F6D81144FBFF73DA4ECF9B701940F27341FA8020C313443",
		"12000322000000002400000017201B0086955468400000000000000C732102F89EAEC7667B30F33D0687BBA86C3FE2A08CCA40A9186C5BDE2DAA6FA97A37D87446304402207660BDEF67105CE1EBA9AD35DC7156BAB43FF1D47633199EE257D70B6B9AAFBF02207F5517BC8AEF2ADC1325897ECDBA8C673838048BCA62F4E98B252F19BE88796D770A726970706C652E636F6D81144FBFF73DA4ECF9B701940F27341FA8020C313443",
	);

	it("broadcast should pass", async (context) => {
		nock.fake(/.+/).post("/").reply(200, loader.json(`test/fixtures/client/broadcast.json`));

		const result = await context.subject.broadcast([transactionPayload]);

		assert.equal(result, {
			accepted: ["2B6928A583A9D14D359E471EB8D8F961CBC1A054EF86845A39790A7912147CD2"],
			rejected: [],
			errors: {},
		});
	});

	it("broadcast should fail", async (context) => {
		nock.fake(/.+/).post("/").reply(200, loader.json(`test/fixtures/client/broadcast-failure.json`));

		const result = await context.subject.broadcast([transactionPayload]);

		assert.equal(result, {
			accepted: [],
			rejected: [transactionPayload.id()],
			errors: {
				[transactionPayload.id()]: "tecUNFUNDED_PAYMENT",
			},
		});
	});
});
