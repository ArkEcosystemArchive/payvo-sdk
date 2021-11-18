import { DateTime } from "@payvo/sdk-intl";

import Fixture from "../test/fixtures/client/transaction.json";
import { createService } from "../test/mocking";
import { ConfirmedTransactionData } from "./confirmed-transaction.dto";

let subject;

test.before.each(async () => {
	subject = await createService(ConfirmedTransactionData);
	subject.configure(Fixture.data);
});

describe("ConfirmedTransactionData", () => {
	test("should succeed", async () => {
		assert.instance(subject, ConfirmedTransactionData);
		assert.is(subject.id(), "21c0cdf1d1e191823540841dd926944e7bc4ee37a7227ec9609ad9715227a02d");
		assert.is(subject.type(), "transfer");
		assert.instance(subject.timestamp(), DateTime);
		assert.is(subject.confirmations().toNumber(), 123456);

		assert.is(subject.sender(), "1Ct7Aivo3jBhabLW8MRkzf28M1QHuqDWCg");
		assert.is(subject.senders()).toMatchSnapshot();

		assert.is(subject.recipient(), "1DVGtxX1ox92cQ5uMrXBL8snE3Agkt9zPr");
		assert.is(subject.recipients()).toMatchSnapshot();

		assert.is(subject.amount().toNumber(), 62550000);
		assert.is(subject.fee().toNumber(), 50000);

		assert.is(subject.inputs()).toMatchSnapshot();
		assert.is(subject.outputs()).toMatchSnapshot();
	});
});
