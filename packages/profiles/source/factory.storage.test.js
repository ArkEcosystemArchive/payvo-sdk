import { assert, describe, mockery, loader, test } from "@payvo/sdk-test";
import { ConfStorage } from "./conf.storage";

import { StorageFactory } from "./factory.storage";
import { LocalStorage } from "./local.storage";
import { NullStorage } from "./null.storage";

test("StorageFactory#conf", () => {
	assert.instance(StorageFactory.make("conf"), ConfStorage);
});

test("StorageFactory#null", () => {
	assert.instance(StorageFactory.make("null"), NullStorage);
});

test("StorageFactory#indexeddb", () => {
	assert.instance(StorageFactory.make("indexeddb"), LocalStorage);
});

test("StorageFactory#websql", () => {
	assert.instance(StorageFactory.make("websql"), LocalStorage);
});

test("StorageFactory#localstorage", () => {
	assert.instance(StorageFactory.make("localstorage"), LocalStorage);
});

test.run();
