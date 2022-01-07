import { describe } from "@payvo/sdk-test";
import { DateTime } from "@payvo/sdk-intl";
import { BigNumber } from "@payvo/sdk-helpers";

import Fixture from "../test/fixtures/client/transaction.json";
import { createService } from "../test/mocking";
import { ConfirmedTransactionData } from "./confirmed-transaction.dto.js";

describe("ConfirmedTransactionData", async ({ beforeEach, assert, it, nock, loader }) => {
	beforeEach(async (context) => {
		context.subject = await createService(ConfirmedTransactionData);
		context.subject.configure(Fixture);
	});

	it("should succeed", async (context) => {
		assert.instance(context.subject, ConfirmedTransactionData);
		assert.is(context.subject.id(), "B0DB35EADB3655E954A785B1ED0402222EF8C7061B22E52720AB1CE027ADBD11");
		assert.is(context.subject.type(), "transfer");
		assert.instance(context.subject.timestamp(), DateTime);
		assert.is(context.subject.confirmations(), BigNumber.ZERO);
		assert.is(context.subject.sender(), "cosmos1de7pk372jkp9vrul0gv5j6r3l9mt3wa6m4h6h0");
		assert.is(context.subject.recipient(), "cosmos14ddvyl5t0hzmknceuv3zzu5szuum4rkygpq5ln");
		assert.equal(context.subject.amount(), BigNumber.make(10680));
		assert.equal(context.subject.fee(), BigNumber.make(36875));
		assert.is(context.subject.memo(), "Hello World");
	});
});
