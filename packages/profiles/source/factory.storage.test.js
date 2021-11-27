import { describe } from "@payvo/sdk-test";

import { ConfStorage as ConfigStorage } from "./conf.storage";
import { StorageFactory } from "./factory.storage";
import { LocalStorage } from "./local.storage";
import { NullStorage } from "./null.storage";

describe("StorageFactory", ({ it, assert }) => {
	it("StorageFactory#conf", () => {
		assert.instance(StorageFactory.make("conf"), ConfigStorage);
	});

	it("StorageFactory#null", () => {
		assert.instance(StorageFactory.make("null"), NullStorage);
	});

	it("StorageFactory#indexeddb", () => {
		assert.instance(StorageFactory.make("indexeddb"), LocalStorage);
	});

	it("StorageFactory#websql", () => {
		assert.instance(StorageFactory.make("websql"), LocalStorage);
	});

	it("StorageFactory#localstorage", () => {
		assert.instance(StorageFactory.make("localstorage"), LocalStorage);
	});
});
