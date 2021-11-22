import { assert, describe } from "@payvo/sdk-test";
import { Services } from "@payvo/sdk";

import { createService } from "../test/mocking";

let subject;

describe("ark.mainnet", ({ afterEach, beforeAll, test }) => {
	beforeAll(async () => {
		subject = await createService(Services.AbstractLinkService, "ark.mainnet");
	});

	test("should generate a link for a block", async () => {
		assert.is(subject.block("id"), "https://explorer.ark.io/block/id");
	});

	test("should generate a link for a transaction", async () => {
		assert.is(subject.transaction("id"), "https://explorer.ark.io/transaction/id");
	});

	test("should generate a link for a wallet", async () => {
		assert.is(subject.wallet("id"), "https://explorer.ark.io/wallets/id");
	});
});

describe("ark.devnet", ({ afterEach, beforeAll, test }) => {
	beforeAll(async () => {
		subject = await createService(Services.AbstractLinkService, "ark.devnet");
	});

	test("should generate a link for a block", async () => {
		assert.is(subject.block("id"), "https://dexplorer.ark.io/block/id");
	});

	test("should generate a link for a transaction", async () => {
		assert.is(subject.transaction("id"), "https://dexplorer.ark.io/transaction/id");
	});

	test("should generate a link for a wallet", async () => {
		assert.is(subject.wallet("id"), "https://dexplorer.ark.io/wallets/id");
	});
});

describe("bind.mainnet", ({ afterEach, beforeAll, test }) => {
	beforeAll(async () => {
		subject = await createService(Services.AbstractLinkService, "bind.mainnet");
	});

	test("should generate a link for a block", async () => {
		assert.is(subject.block("id"), "https://bindscan.io/block/id");
	});

	test("should generate a link for a transaction", async () => {
		assert.is(subject.transaction("id"), "https://bindscan.io/transaction/id");
	});

	test("should generate a link for a wallet", async () => {
		assert.is(subject.wallet("id"), "https://bindscan.io/wallets/id");
	});
});

describe("bind.testnet", ({ afterEach, beforeAll, test }) => {
	beforeAll(async () => {
		subject = await createService(Services.AbstractLinkService, "bind.testnet");
	});

	test("should generate a link for a block", async () => {
		assert.is(subject.block("id"), "https://testnet.bindscan.io/block/id");
	});

	test("should generate a link for a transaction", async () => {
		assert.is(subject.transaction("id"), "https://testnet.bindscan.io/transaction/id");
	});

	test("should generate a link for a wallet", async () => {
		assert.is(subject.wallet("id"), "https://testnet.bindscan.io/wallets/id");
	});
});

describe("xqr.mainnet", ({ afterEach, beforeAll, test }) => {
	beforeAll(async () => {
		subject = await createService(Services.AbstractLinkService, "xqr.mainnet");
	});

	test("should generate a link for a block", async () => {
		assert.is(subject.block("id"), "https://explorer.sh/qredit/block/id");
	});

	test("should generate a link for a transaction", async () => {
		assert.is(subject.transaction("id"), "https://explorer.sh/qredit/transaction/id");
	});

	test("should generate a link for a wallet", async () => {
		assert.is(subject.wallet("id"), "https://explorer.sh/qredit/wallet/id");
	});
});

describe("xqr.testnet", ({ afterEach, beforeAll, test }) => {
	beforeAll(async () => {
		subject = await createService(Services.AbstractLinkService, "xqr.testnet");
	});

	test("should generate a link for a block", async () => {
		assert.is(subject.block("id"), "https://explorer.sh/qredit-testnet/block/id");
	});

	test("should generate a link for a transaction", async () => {
		assert.is(subject.transaction("id"), "https://explorer.sh/qredit-testnet/transaction/id");
	});

	test("should generate a link for a wallet", async () => {
		assert.is(subject.wallet("id"), "https://explorer.sh/qredit-testnet/wallet/id");
	});
});

describe("bpl.mainnet", ({ afterEach, beforeAll, test }) => {
	beforeAll(async () => {
		subject = await createService(Services.AbstractLinkService, "bpl.mainnet");
	});

	test("should generate a link for a block", async () => {
		assert.is(subject.block("id"), "https://explorer.blockpool.io/#/block/id");
	});

	test("should generate a link for a transaction", async () => {
		assert.is(subject.transaction("id"), "https://explorer.blockpool.io/#/transaction/id");
	});

	test("should generate a link for a wallet", async () => {
		assert.is(subject.wallet("id"), "https://explorer.blockpool.io/#/wallets/id");
	});
});
