import "reflect-metadata";

import { describeEach } from "@payvo/sdk-test";

import { bootContainer, makeCoin } from "../test/mocking";
import { ParallelDelegateSyncer, SerialDelegateSyncer } from "./delegate-syncer.service";

describeEach(
	"DelegateSyncer(%s)",
	({ assert, beforeAll, beforeEach, dataset, it, nock, loader }) => {
		beforeAll(() => {
			bootContainer({ flush: true });
		});

		beforeEach(async (context) => {
			nock.cleanAll();

			nock.fake(/.+/)
				.get("/api/node/configuration")
				.reply(200, loader.json("test/fixtures/client/configuration.json"))
				.get("/api/node/configuration/crypto")
				.reply(200, loader.json("test/fixtures/client/cryptoConfiguration.json"))
				.get("/api/node/syncing")
				.reply(200, loader.json("test/fixtures/client/syncing.json"))
				.get("/api/peers")
				.reply(200, loader.json("test/fixtures/client/peers.json"))
				.get("/api/delegates")
				.reply(200, loader.json("test/fixtures/client/delegates-1.json"))
				.get("/api/delegates?page=2")
				.reply(200, loader.json("test/fixtures/client/delegates-2.json"));

			const coin = await makeCoin("ARK", "ark.devnet");

			if (dataset === "serial") {
				context.subject = new SerialDelegateSyncer(coin.client());
			} else {
				context.subject = new ParallelDelegateSyncer(coin.client());
			}
		});

		it("should sync", async (context) => {
			assert.length(await context.subject.sync(), 200);
		});

		it("should sync single page", async (context) => {
			nock.cleanAll();
			nock.fake(/.+/)
				.get("/api/delegates")
				.reply(200, loader.json("test/fixtures/client/delegates-single-page.json"))
				.persist();

			assert.length(await context.subject.sync(), 10);
		});
	},
	["serial", "parallel"],
);
