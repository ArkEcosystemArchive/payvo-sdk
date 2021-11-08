
import { BigNumber } from "@payvo/helpers";

import Fixture from "../test/fixtures/client/wallet.json";
import { WalletData } from "./wallet.dto";
import { createService, require } from "../test/mocking";

let subject;

beforeAll(async () => {
	subject = (await createService(WalletData)).fill(Fixture.data);
});

describe("WalletData", () => {
	it("#address", () => {
		expect(subject.address()).toEqual("my48EN4kDnGEpRZMBfiDS65wdfwfgCGZRz");
	});

	it("#publicKey", () => {
		expect(subject.publicKey()).toEqual("76a914c05f53de525d80151e209a729cf1c7909c88f88e88ac");
	});

	it("#balance", () => {
		expect(subject.balance().available).toEqual(BigNumber.make(3000001));
	});

	it("#nonce", () => {
		expect(subject.nonce()).toEqual(BigNumber.make(0));
	});

	it("#secondPublicKey", () => {
		expect(subject.secondPublicKey()).toBeUndefined();
	});

	it("#username", () => {
		expect(subject.username()).toBeUndefined();
	});

	it("#rank", () => {
		expect(subject.rank()).toBeUndefined();
	});

	it("#votes", () => {
		expect(subject.votes()).toBeUndefined();
	});

	it("#multiSignature", () => {
		expect(() => subject.multiSignature()).toThrow(/does not have/);
	});

	it("#isMultiSignature", () => {
		expect(subject.isMultiSignature()).toBeFalse();
	});

	it("#isDelegate", () => {
		expect(subject.isDelegate()).toBeFalse();
	});

	it("#isSecondSignature", () => {
		expect(subject.isSecondSignature()).toBeFalse();
	});

	it("#isResignedDelegate", () => {
		expect(subject.isResignedDelegate()).toBeFalse();
	});
});
