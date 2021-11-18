import { ConfStorage } from "./conf.storage";

import { StorageFactory } from "./factory.storage";
import { LocalStorage } from "./local.storage";
import { NullStorage } from "./null.storage";

test("StorageFactory#conf", () => {
	assert.is(StorageFactory.make("conf") instanceof ConfStorage);
});

test("StorageFactory#null", () => {
	assert.is(StorageFactory.make("null") instanceof NullStorage);
});

test("StorageFactory#indexeddb", () => {
	assert.is(StorageFactory.make("indexeddb") instanceof LocalStorage);
});

test("StorageFactory#websql", () => {
	assert.is(StorageFactory.make("websql") instanceof LocalStorage);
});

test("StorageFactory#localstorage", () => {
	assert.is(StorageFactory.make("localstorage") instanceof LocalStorage);
});
