import "reflect-metadata";

import { bootContainer } from "../test/mocking.js";
import { PasswordManager } from "./password.js";

beforeAll(() => bootContainer());

describe("PasswordManager", () => {
	it("should set and get password", () => {
		const subject = new PasswordManager();

		assert.is(() => subject.get()).toThrow("Failed to find a password for the given profile.");

		subject.set("password");

		assert.is(subject.get(), "password");
	});

	it("#exists", () => {
		const subject = new PasswordManager();

		assert.is(() => subject.get()).toThrow("Failed to find a password for the given profile.");

		assert.is(subject.exists(), false);
		subject.set("password");

		assert.is(subject.exists(), true);
	});

	it("#forget", () => {
		const subject = new PasswordManager();

		assert.is(() => subject.get()).toThrow("Failed to find a password for the given profile.");

		subject.set("password");
		assert.is(subject.exists(), true);
		subject.forget();

		assert.is(subject.exists(), false);
	});
});
