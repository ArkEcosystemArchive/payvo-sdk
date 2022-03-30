import { describe } from "@payvo/sdk-test";
import { Services } from "@payvo/sdk";

import { createService } from "../test/mocking";

describe("LinkService", ({ assert, it, nock, loader }) => {
	it("should generate a link for a block on a [ark.mainnet] explorer", async () => {
		const subject = await createService(Services.AbstractLinkService, "ark.mainnet");

		assert.is(subject.block("id"), "https://explorer.ark.io/block/id");
	});

	it("should generate a link for a transaction on a [ark.mainnet] explorer", async () => {
		const subject = await createService(Services.AbstractLinkService, "ark.mainnet");

		assert.is(subject.transaction("id"), "https://explorer.ark.io/transaction/id");
	});

	it("should generate a link for a wallet on a [ark.mainnet] explorer", async () => {
		const subject = await createService(Services.AbstractLinkService, "ark.mainnet");

		assert.is(subject.wallet("id"), "https://explorer.ark.io/wallets/id");
	});

	it("should generate a link for a block on a [ark.devnet] explorer", async () => {
		const subject = await createService(Services.AbstractLinkService, "ark.devnet");

		assert.is(subject.block("id"), "https://dexplorer.ark.io/block/id");
	});

	it("should generate a link for a transaction on a [ark.devnet] explorer", async () => {
		const subject = await createService(Services.AbstractLinkService, "ark.devnet");

		assert.is(subject.transaction("id"), "https://dexplorer.ark.io/transaction/id");
	});

	it("should generate a link for a wallet on a [ark.devnet] explorer", async () => {
		const subject = await createService(Services.AbstractLinkService, "ark.devnet");

		assert.is(subject.wallet("id"), "https://dexplorer.ark.io/wallets/id");
	});

	it("should generate a link for a block on a [bind.mainnet] explorer", async () => {
		const subject = await createService(Services.AbstractLinkService, "bind.mainnet");

		assert.is(subject.block("id"), "https://bindscan.io/block/id");
	});

	it("should generate a link for a transaction on a [bind.mainnet] explorer", async () => {
		const subject = await createService(Services.AbstractLinkService, "bind.mainnet");

		assert.is(subject.transaction("id"), "https://bindscan.io/transaction/id");
	});

	it("should generate a link for a wallet on a [bind.mainnet] explorer", async () => {
		const subject = await createService(Services.AbstractLinkService, "bind.mainnet");

		assert.is(subject.wallet("id"), "https://bindscan.io/wallets/id");
	});

	it("should generate a link for a block on a [bind.testnet] explorer", async () => {
		const subject = await createService(Services.AbstractLinkService, "bind.testnet");

		assert.is(subject.block("id"), "https://testnet.bindscan.io/block/id");
	});

	it("should generate a link for a transaction on a [bind.testnet] explorer", async () => {
		const subject = await createService(Services.AbstractLinkService, "bind.testnet");

		assert.is(subject.transaction("id"), "https://testnet.bindscan.io/transaction/id");
	});

	it("should generate a link for a wallet on a [bind.testnet] explorer", async () => {
		const subject = await createService(Services.AbstractLinkService, "bind.testnet");

		assert.is(subject.wallet("id"), "https://testnet.bindscan.io/wallets/id");
	});

	it("should generate a link for a block on a [xqr.mainnet] explorer", async () => {
		const subject = await createService(Services.AbstractLinkService, "xqr.mainnet");

		assert.is(subject.block("id"), "https://explorer.sh/xqr/block/id");
	});

	it("should generate a link for a transaction on a [xqr.mainnet] explorer", async () => {
		const subject = await createService(Services.AbstractLinkService, "xqr.mainnet");

		assert.is(subject.transaction("id"), "https://explorer.sh/xqr/transaction/id");
	});

	it("should generate a link for a wallet on a [xqr.mainnet] explorer", async () => {
		const subject = await createService(Services.AbstractLinkService, "xqr.mainnet");

		assert.is(subject.wallet("id"), "https://explorer.sh/xqr/wallet/id");
	});

	it("should generate a link for a block on a [xqr.testnet] explorer", async () => {
		const subject = await createService(Services.AbstractLinkService, "xqr.testnet");

		assert.is(subject.block("id"), "https://explorer.sh/dxqr/block/id");
	});

	it("should generate a link for a transaction on a [xqr.testnet] explorer", async () => {
		const subject = await createService(Services.AbstractLinkService, "xqr.testnet");

		assert.is(subject.transaction("id"), "https://explorer.sh/dxqr/transaction/id");
	});

	it("should generate a link for a wallet on a [xqr.testnet] explorer", async () => {
		const subject = await createService(Services.AbstractLinkService, "xqr.testnet");

		assert.is(subject.wallet("id"), "https://explorer.sh/dxqr/wallet/id");
	});

	it("should generate a link for a block on a [bpl.mainnet] explorer", async () => {
		const subject = await createService(Services.AbstractLinkService, "bpl.mainnet");

		assert.is(subject.block("id"), "https://explorer.blockpool.io/#/block/id");
	});

	it("should generate a link for a transaction on a [bpl.mainnet] explorer", async () => {
		const subject = await createService(Services.AbstractLinkService, "bpl.mainnet");

		assert.is(subject.transaction("id"), "https://explorer.blockpool.io/#/transaction/id");
	});

	it("should generate a link for a wallet on a [bpl.mainnet] explorer", async () => {
		const subject = await createService(Services.AbstractLinkService, "bpl.mainnet");

		assert.is(subject.wallet("id"), "https://explorer.blockpool.io/#/wallets/id");
	});
});
