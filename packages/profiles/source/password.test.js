import { assert, describe, mockery, loader, test } from "@payvo/sdk-test";
import "reflect-metadata";

import { bootContainer } from "../test/mocking";
import { PasswordManager } from "./password";

test.before(() => bootContainer());

describe("PasswordManager", ({ afterEach, beforeEach, test }) => {
	test("should set and get password", () => {
		const subject = new PasswordManager();

		assert.throws(() => subject.get(), "Failed to find a password for the given profile.");

		subject.set("password");

		assert.is(subject.get(), "password");
	});

	test("#exists", () => {
		const subject = new PasswordManager();

		assert.throws(() => subject.get(), "Failed to find a password for the given profile.");

		assert.false(subject.exists());
		subject.set("password");

		assert.true(subject.exists());
	});

	test("#forget", () => {
		const subject = new PasswordManager();

		assert.throws(() => subject.get(), "Failed to find a password for the given profile.");

		subject.set("password");
		assert.true(subject.exists());
		subject.forget();

		assert.false(subject.exists());
	});
});

test.run();
