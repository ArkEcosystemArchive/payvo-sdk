import { assert, describe } from "@payvo/sdk-test";
import { Services } from "@payvo/sdk";

import { createService } from "../test/mocking";

let subject;

describe("ark.mainnet", (suite) => {
	suite.before(async () => {
		subject = await createService(Services.AbstractLinkService, "ark.mainnet");
	});

	suite("should generate a link for a block", async () => {
		assert.is(subject.block("id"), "https://explorer.ark.io/block/id");
	});

	suite("should generate a link for a transaction", async () => {
		assert.is(subject.transaction("id"), "https://explorer.ark.io/transaction/id");
	});

	suite("should generate a link for a wallet", async () => {
		assert.is(subject.wallet("id"), "https://explorer.ark.io/wallets/id");
	});
});

describe("ark.devnet", (suite) => {
	suite.before(async () => {
		subject = await createService(Services.AbstractLinkService, "ark.devnet");
	});

	suite("should generate a link for a block", async () => {
		assert.is(subject.block("id"), "https://dexplorer.ark.io/block/id");
	});

	suite("should generate a link for a transaction", async () => {
		assert.is(subject.transaction("id"), "https://dexplorer.ark.io/transaction/id");
	});

	suite("should generate a link for a wallet", async () => {
		assert.is(subject.wallet("id"), "https://dexplorer.ark.io/wallets/id");
	});
});

describe("bind.mainnet", (suite) => {
	suite.before(async () => {
		subject = await createService(Services.AbstractLinkService, "bind.mainnet");
	});

	suite("should generate a link for a block", async () => {
		assert.is(subject.block("id"), "https://bindscan.io/block/id");
	});

	suite("should generate a link for a transaction", async () => {
		assert.is(subject.transaction("id"), "https://bindscan.io/transaction/id");
	});

	suite("should generate a link for a wallet", async () => {
		assert.is(subject.wallet("id"), "https://bindscan.io/wallets/id");
	});
});

describe("bind.testnet", (suite) => {
	suite.before(async () => {
		subject = await createService(Services.AbstractLinkService, "bind.testnet");
	});

	suite("should generate a link for a block", async () => {
		assert.is(subject.block("id"), "https://testnet.bindscan.io/block/id");
	});

	suite("should generate a link for a transaction", async () => {
		assert.is(subject.transaction("id"), "https://testnet.bindscan.io/transaction/id");
	});

	suite("should generate a link for a wallet", async () => {
		assert.is(subject.wallet("id"), "https://testnet.bindscan.io/wallets/id");
	});
});

describe("xqr.mainnet", (suite) => {
	suite.before(async () => {
		subject = await createService(Services.AbstractLinkService, "xqr.mainnet");
	});

	suite("should generate a link for a block", async () => {
		assert.is(subject.block("id"), "https://explorer.sh/qredit/block/id");
	});

	suite("should generate a link for a transaction", async () => {
		assert.is(subject.transaction("id"), "https://explorer.sh/qredit/transaction/id");
	});

	suite("should generate a link for a wallet", async () => {
		assert.is(subject.wallet("id"), "https://explorer.sh/qredit/wallet/id");
	});
});

describe("xqr.testnet", (suite) => {
	suite.before(async () => {
		subject = await createService(Services.AbstractLinkService, "xqr.testnet");
	});

	suite("should generate a link for a block", async () => {
		assert.is(subject.block("id"), "https://explorer.sh/qredit-testnet/block/id");
	});

	suite("should generate a link for a transaction", async () => {
		assert.is(subject.transaction("id"), "https://explorer.sh/qredit-testnet/transaction/id");
	});

	suite("should generate a link for a wallet", async () => {
		assert.is(subject.wallet("id"), "https://explorer.sh/qredit-testnet/wallet/id");
	});
});

describe("bpl.mainnet", (suite) => {
	suite.before(async () => {
		subject = await createService(Services.AbstractLinkService, "bpl.mainnet");
	});

	suite("should generate a link for a block", async () => {
		assert.is(subject.block("id"), "https://explorer.blockpool.io/#/block/id");
	});

	suite("should generate a link for a transaction", async () => {
		assert.is(subject.transaction("id"), "https://explorer.blockpool.io/#/transaction/id");
	});

	suite("should generate a link for a wallet", async () => {
		assert.is(subject.wallet("id"), "https://explorer.blockpool.io/#/wallets/id");
	});
});
