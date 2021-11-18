import "reflect-metadata";

import { bootContainer } from "../test/mocking";
import { PasswordManager } from "./password";

test.before(() => bootContainer());

describe("PasswordManager", () => {
	test("should set and get password", () => {
		const subject = new PasswordManager();

		assert.is(() => subject.get()).toThrow("Failed to find a password for the given profile.");

		subject.set("password");

		assert.is(subject.get(), "password");
	});

	test("#exists", () => {
		const subject = new PasswordManager();

		assert.is(() => subject.get()).toThrow("Failed to find a password for the given profile.");

		assert.is(subject.exists(), false);
		subject.set("password");

		assert.is(subject.exists(), true);
	});

	test("#forget", () => {
		const subject = new PasswordManager();

		assert.is(() => subject.get()).toThrow("Failed to find a password for the given profile.");

		subject.set("password");
		assert.is(subject.exists(), true);
		subject.forget();

		assert.is(subject.exists(), false);
	});
});
