import Fixture from "../test/fixtures/client/wallet.json";
import { createService } from "../test/mocking";
import { WalletData } from "./wallet.dto";

let subject;

test.before(async () => {
	subject = (await createService(WalletData)).fill(Fixture);
});

describe("WalletData", () => {
	test("#address", () => {
		assert.is(subject.address(), "98c83431e94407bc0889e09953461fe5cecfdf18");
	});

	test("#publicKey", () => {
		assert.is(() => subject.publicKey()).toThrow(/not implemented/);
	});

	test("#balance", () => {
		assert.is(subject.balance().available.toString(), "2000000000");
		assert.is(subject.balance().fees.toString(), "0");
	});

	test("#nonce", () => {
		assert.is(() => subject.nonce()).toThrow(/not implemented/);
	});

	test("#secondPublicKey", () => {
		assert.is(() => subject.secondPublicKey()).toThrow(/not implemented/);
	});

	test("#username", () => {
		assert.is(() => subject.username()).toThrow(/not implemented/);
	});

	test("#rank", () => {
		assert.is(() => subject.rank()).toThrow(/not implemented/);
	});

	test("#votes", () => {
		assert.is(() => subject.votes()).toThrow(/not implemented/);
	});

	test("#multiSignature", () => {
		assert.is(() => subject.multiSignature()).toThrow(/not implemented/);
	});

	test("#isMultiSignature", () => {
		assert.is(subject.isMultiSignature(), false);
	});

	test("#isDelegate", () => {
		assert.is(subject.isDelegate(), false);
	});

	test("#isSecondSignature", () => {
		assert.is(subject.isSecondSignature(), false);
	});

	test("#isResignedDelegate", () => {
		assert.is(subject.isResignedDelegate(), false);
	});
});
