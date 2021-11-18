import { Services } from "@payvo/sdk";

import { createService, requireModule } from "../test/mocking";

let subject: Services.AbstractLinkService;

describe("ark.mainnet", () => {
	test.before(async () => {
		subject = await createService(Services.AbstractLinkService, "ark.mainnet");
	});

	test("should generate a link for a block", async () => {
		assert.is(subject.block("id")).toMatchInlineSnapshot(`"https://explorer.ark.io/block/id"`);
	});

	test("should generate a link for a transaction", async () => {
		assert.is(subject.transaction("id")).toMatchInlineSnapshot(`"https://explorer.ark.io/transaction/id"`);
	});

	test("should generate a link for a wallet", async () => {
		assert.is(subject.wallet("id")).toMatchInlineSnapshot(`"https://explorer.ark.io/wallets/id"`);
	});
});

describe("ark.devnet", () => {
	test.before(async () => {
		subject = await createService(Services.AbstractLinkService, "ark.devnet");
	});

	test("should generate a link for a block", async () => {
		assert.is(subject.block("id")).toMatchInlineSnapshot(`"https://dexplorer.ark.io/block/id"`);
	});

	test("should generate a link for a transaction", async () => {
		assert.is(subject.transaction("id")).toMatchInlineSnapshot(`"https://dexplorer.ark.io/transaction/id"`);
	});

	test("should generate a link for a wallet", async () => {
		assert.is(subject.wallet("id")).toMatchInlineSnapshot(`"https://dexplorer.ark.io/wallets/id"`);
	});
});

describe("bind.mainnet", () => {
	test.before(async () => {
		subject = await createService(Services.AbstractLinkService, "bind.mainnet");
	});

	test("should generate a link for a block", async () => {
		assert.is(subject.block("id")).toMatchInlineSnapshot(`"https://bindscan.io/block/id"`);
	});

	test("should generate a link for a transaction", async () => {
		assert.is(subject.transaction("id")).toMatchInlineSnapshot(`"https://bindscan.io/transaction/id"`);
	});

	test("should generate a link for a wallet", async () => {
		assert.is(subject.wallet("id")).toMatchInlineSnapshot(`"https://bindscan.io/wallets/id"`);
	});
});

describe("bind.testnet", () => {
	test.before(async () => {
		subject = await createService(Services.AbstractLinkService, "bind.testnet");
	});

	test("should generate a link for a block", async () => {
		assert.is(subject.block("id")).toMatchInlineSnapshot(`"https://testnet.bindscan.io/block/id"`);
	});

	test("should generate a link for a transaction", async () => {
		assert.is(subject.transaction("id")).toMatchInlineSnapshot(`"https://testnet.bindscan.io/transaction/id"`);
	});

	test("should generate a link for a wallet", async () => {
		assert.is(subject.wallet("id")).toMatchInlineSnapshot(`"https://testnet.bindscan.io/wallets/id"`);
	});
});

describe("xqr.mainnet", () => {
	test.before(async () => {
		subject = await createService(Services.AbstractLinkService, "xqr.mainnet");
	});

	test("should generate a link for a block", async () => {
		assert.is(subject.block("id")).toMatchInlineSnapshot(`"https://explorer.sh/qredit/block/id"`);
	});

	test("should generate a link for a transaction", async () => {
		assert.is(subject.transaction("id")).toMatchInlineSnapshot(`"https://explorer.sh/qredit/transaction/id"`);
	});

	test("should generate a link for a wallet", async () => {
		assert.is(subject.wallet("id")).toMatchInlineSnapshot(`"https://explorer.sh/qredit/wallet/id"`);
	});
});

describe("xqr.testnet", () => {
	test.before(async () => {
		subject = await createService(Services.AbstractLinkService, "xqr.testnet");
	});

	test("should generate a link for a block", async () => {
		assert.is(subject.block("id")).toMatchInlineSnapshot(`"https://explorer.sh/qredit-testnet/block/id"`);
	});

	test("should generate a link for a transaction", async () => {
		assert
			.is(subject.transaction("id"))
			.toMatchInlineSnapshot(`"https://explorer.sh/qredit-testnet/transaction/id"`);
	});

	test("should generate a link for a wallet", async () => {
		assert.is(subject.wallet("id")).toMatchInlineSnapshot(`"https://explorer.sh/qredit-testnet/wallet/id"`);
	});
});

describe("bpl.mainnet", () => {
	test.before(async () => {
		subject = await createService(Services.AbstractLinkService, "bpl.mainnet");
	});

	test("should generate a link for a block", async () => {
		assert.is(subject.block("id")).toMatchInlineSnapshot(`"https://explorer.blockpool.io/#/block/id"`);
	});

	test("should generate a link for a transaction", async () => {
		assert.is(subject.transaction("id")).toMatchInlineSnapshot(`"https://explorer.blockpool.io/#/transaction/id"`);
	});

	test("should generate a link for a wallet", async () => {
		assert.is(subject.wallet("id")).toMatchInlineSnapshot(`"https://explorer.blockpool.io/#/wallets/id"`);
	});
});
