import { assert, describe, mockery, loader, test } from "@payvo/sdk-test";
import "reflect-metadata";

import nock from "nock";

import { bootContainer } from "../test/mocking";
import { PluginRegistry } from "./plugin-registry.service";

const createNetworkMocks = () => {
	nock("https://raw.githubusercontent.com")
		.get("/PayvoHQ/wallet-plugins/master/whitelist.json")
		.once()
		.reply(200, require("../test/fixtures/plugins/whitelist.json"));

	nock("https://registry.npmjs.com")
		.get("/-/v1/search")
		.query(true)
		.once()
		.reply(200, require("../test/fixtures/plugins/index.json"))
		.get("/-/v1/search")
		.query(true)
		.once()
		.reply(200, {});

	const plugins = require("../test/fixtures/plugins/index.json").objects;

	for (const { package: plugin } of plugins) {
		if (plugin.links?.repository === undefined) {
			continue;
		}

		nock("https://registry.npmjs.com")
			.get(`/${plugin.name}`)
			.reply(200, require("../test/fixtures/plugins/npm.json"));
	}
};

let subject;

test.before(() => {
	nock.disableNetConnect();

	bootContainer();
});

test.before.each(() => {
	subject = new PluginRegistry();
});

test.after.each(() => nock.cleanAll());

describe("PluginRegistry", () => {
	test("should list all plugins", async () => {
		createNetworkMocks();

		const result = await subject.all();

		assert.length(result, 2);
		assert.object(result[1].toObject());
	});

	test("should get the size of the given plugin", async () => {
		createNetworkMocks();

		nock("https://registry.npmjs.com")
			.get("/@dated/delegate-calculator-plugin")
			.reply(200, require("../test/fixtures/plugins/npm.json"));

		const plugin = (await subject.all())[0];

		await assert.is(subject.size(plugin), 22025);
	});

	test("should get the download count of the given plugin", async () => {
		createNetworkMocks();

		nock("https://api.npmjs.org")
			.get(`/downloads/range/2005-01-01:${new Date().getFullYear() + 1}-01-01/@dated/delegate-calculator-plugin`)
			.reply(200, require("../test/fixtures/plugins/downloads.json"));

		assert.is(await subject.downloads((await subject.all())[0]), 446);
	});
});

test.run();
