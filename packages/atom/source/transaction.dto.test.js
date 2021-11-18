import { DateTime } from "@payvo/sdk-intl";
import { BigNumber } from "@payvo/sdk-helpers";

import Fixture from "../test/fixtures/client/transaction.json";
import { createService } from "../test/mocking";
import { ConfirmedTransactionData } from "./confirmed-transaction.dto";

let subject: ConfirmedTransactionData;

test.before.each(async () => {
	subject = await createService(ConfirmedTransactionData);
	subject.configure(Fixture);
});

describe("ConfirmedTransactionData", () => {
	test("should succeed", async () => {
		assert.is(subject instanceof ConfirmedTransactionData);
		assert.is(subject.id(), "B0DB35EADB3655E954A785B1ED0402222EF8C7061B22E52720AB1CE027ADBD11");
		assert.is(subject.type(), "transfer");
		assert.is(subject.timestamp() instanceof DateTime);
		assert.is(subject.confirmations(), BigNumber.ZERO);
		assert.is(subject.sender(), "cosmos1de7pk372jkp9vrul0gv5j6r3l9mt3wa6m4h6h0");
		assert.is(subject.recipient(), "cosmos14ddvyl5t0hzmknceuv3zzu5szuum4rkygpq5ln");
		assert.is(subject.amount(), BigNumber.make(10680));
		assert.is(subject.fee(), BigNumber.make(36875));
		assert.is(subject.memo(), "Hello World");
	});
});
