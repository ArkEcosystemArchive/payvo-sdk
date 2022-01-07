import { describe } from "@payvo/sdk-test";
import { DateTime } from "@payvo/sdk-intl";

import Fixture from "../test/fixtures/client/transaction.json";
import { createService } from "../test/mocking";
import { ConfirmedTransactionData } from "./confirmed-transaction.dto.js";

describe("ConfirmedTransactionData", async ({ beforeEach, it, assert }) => {
	beforeEach(async (context) => {
		context.subject = await createService(ConfirmedTransactionData);
		context.subject.configure(Fixture.data);
	});

	it("should succeed", async (context) => {
		assert.instance(context.subject, ConfirmedTransactionData);
		assert.is(context.subject.id(), "21c0cdf1d1e191823540841dd926944e7bc4ee37a7227ec9609ad9715227a02d");
		assert.is(context.subject.type(), "transfer");
		assert.instance(context.subject.timestamp(), DateTime);
		assert.is(context.subject.confirmations().toNumber(), 123456);

		assert.is(context.subject.sender(), "1Ct7Aivo3jBhabLW8MRkzf28M1QHuqDWCg");

		assert.is(context.subject.recipient(), "1DVGtxX1ox92cQ5uMrXBL8snE3Agkt9zPr");

		assert.is(context.subject.amount().toNumber(), 62550000);
		assert.is(context.subject.fee().toNumber(), 50000);
	});
});
