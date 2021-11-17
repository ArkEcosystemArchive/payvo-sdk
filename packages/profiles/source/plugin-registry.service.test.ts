import "jest-extended";
import "reflect-metadata";

import nock from "nock";

import { bootContainer } from "../test/mocking.js";
import { PluginRegistry } from "./plugin-registry.service.js";

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

let subject: PluginRegistry;

beforeAll(() => {
	nock.disableNetConnect();

	bootContainer();
});

beforeEach(() => {
	subject = new PluginRegistry();
});

afterEach(() => nock.cleanAll());

describe("PluginRegistry", () => {
	it("should list all plugins", async () => {
		createNetworkMocks();

		const result = await subject.all();

		expect(result).toHaveLength(2);
		expect(result[1].toObject()).toMatchInlineSnapshot(`
		Object {
		  "alias": "ARK Explorer",
		  "archiveUrl": "https://registry.npmjs.org/@payvo/ark-explorer-wallet-plugin/-/ark-explorer-wallet-plugin-1.0.0.tgz",
		  "author": Object {
		    "name": "Lúcio Rubens",
		  },
		  "categories": Array [
		    "utility",
		  ],
		  "date": "2021-07-30T12:57:01.317Z",
		  "description": "Use the ARK Mainnet and Devnet Explorers directly within the Pavyo wallet",
		  "id": "@payvo/ark-explorer-wallet-plugin",
		  "images": undefined,
		  "logo": "https://raw.githubusercontent.com/PayvoHQ/wallet-plugins/master/ark-explorer/images/logo.png",
		  "minimumVersion": "1.0.0",
		  "name": "@payvo/ark-explorer-wallet-plugin",
		  "permissions": Array [
		    "LAUNCH",
		  ],
		  "size": 22025,
		  "sourceProvider": Object {
		    "name": "github",
		    "url": "https://github.com/PayvoHQ/wallet-plugins",
		  },
		  "urls": undefined,
		  "version": "1.0.0",
		}
	`);
	});

	it("should get the size of the given plugin", async () => {
		createNetworkMocks();

		nock("https://registry.npmjs.com")
			.get("/@dated/delegate-calculator-plugin")
			.reply(200, require("../test/fixtures/plugins/npm.json"));

		const plugin = (await subject.all())[0];

		await expect(subject.size(plugin)).resolves.toMatchInlineSnapshot(`22025`);
	});

	it("should get the download count of the given plugin", async () => {
		createNetworkMocks();

		nock("https://api.npmjs.org")
			.get(`/downloads/range/2005-01-01:${new Date().getFullYear() + 1}-01-01/@dated/delegate-calculator-plugin`)
			.reply(200, require("../test/fixtures/plugins/downloads.json"));

		await expect(subject.downloads((await subject.all())[0])).resolves.toBe(446);
	});
});
