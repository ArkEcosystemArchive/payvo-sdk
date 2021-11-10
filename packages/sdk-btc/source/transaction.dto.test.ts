import "jest-extended";

import { DateTime } from "@payvo/intl";

import Fixture from "../test/fixtures/client/transaction.json";
import { createService, requireModule } from "../test/mocking";
import { ConfirmedTransactionData } from "./confirmed-transaction.dto";

let subject: ConfirmedTransactionData;

beforeEach(async () => {
	subject = await createService(ConfirmedTransactionData);
	subject.configure(Fixture.data);
});

describe("ConfirmedTransactionData", () => {
	it("should succeed", async () => {
		expect(subject).toBeInstanceOf(ConfirmedTransactionData);
		expect(subject.id()).toBe("21c0cdf1d1e191823540841dd926944e7bc4ee37a7227ec9609ad9715227a02d");
		expect(subject.type()).toBe("transfer");
		expect(subject.timestamp()).toBeInstanceOf(DateTime);
		expect(subject.confirmations().toNumber()).toEqual(123456);

		expect(subject.sender()).toBe("1Ct7Aivo3jBhabLW8MRkzf28M1QHuqDWCg");
		expect(subject.senders()).toMatchSnapshot();

		expect(subject.recipient()).toBe("1DVGtxX1ox92cQ5uMrXBL8snE3Agkt9zPr");
		expect(subject.recipients()).toMatchSnapshot();

		expect(subject.amount().toNumber()).toEqual(62550000);
		expect(subject.fee().toNumber()).toEqual(50000);

		expect(subject.inputs()).toMatchSnapshot();
		expect(subject.outputs()).toMatchSnapshot();
	});
});
