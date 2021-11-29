import { Storage } from "./env.models.js";
import { LocalStorage } from "./local.storage";
import { MemoryStorage } from "./memory.storage";
import { NullStorage } from "./null.storage";

export class StorageFactory {
	public static make(driver: string): Storage {
		return {
			memory: () => new MemoryStorage(),
			null: () => new NullStorage(),
			indexeddb: () => new LocalStorage("indexeddb"),
			websql: () => new LocalStorage("websql"),
			localstorage: () => new LocalStorage("localstorage"),
		}[driver]!();
	}
}
