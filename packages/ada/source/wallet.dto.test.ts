import Fixture from "../test/fixtures/client/wallet.json";
import { createService, requireModule } from "../test/mocking.js";
import { WalletData } from "./wallet.dto.js";

let subject;

beforeAll(async () => {
	subject = (await createService(WalletData)).fill(Fixture);
});

describe("WalletData", () => {
	it("#address", () => {
		assert.is(subject.address()).toEqual("98c83431e94407bc0889e09953461fe5cecfdf18");
	});

	it("#publicKey", () => {
		assert.is(() => subject.publicKey()).toThrow(/not implemented/);
	});

	it("#balance", () => {
		assert.is(subject.balance().available.toString()).toEqual("2000000000");
		assert.is(subject.balance().fees.toString()).toEqual("0");
	});

	it("#nonce", () => {
		assert.is(() => subject.nonce()).toThrow(/not implemented/);
	});

	it("#secondPublicKey", () => {
		assert.is(() => subject.secondPublicKey()).toThrow(/not implemented/);
	});

	it("#username", () => {
		assert.is(() => subject.username()).toThrow(/not implemented/);
	});

	it("#rank", () => {
		assert.is(() => subject.rank()).toThrow(/not implemented/);
	});

	it("#votes", () => {
		assert.is(() => subject.votes()).toThrow(/not implemented/);
	});

	it("#multiSignature", () => {
		assert.is(() => subject.multiSignature()).toThrow(/not implemented/);
	});

	it("#isMultiSignature", () => {
		assert.is(subject.isMultiSignature(), false);
	});

	it("#isDelegate", () => {
		assert.is(subject.isDelegate(), false);
	});

	it("#isSecondSignature", () => {
		assert.is(subject.isSecondSignature(), false);
	});

	it("#isResignedDelegate", () => {
		assert.is(subject.isResignedDelegate(), false);
	});
});
