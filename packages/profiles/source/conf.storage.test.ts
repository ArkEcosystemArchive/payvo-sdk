import { UUID } from "@payvo/sdk-cryptography";
import { describe } from "@payvo/sdk-test";

import { ConfStorage as ConfigStorage } from "./conf.storage";

describe("ConfStorage", async ({ assert, it, beforeEach }) => {
	beforeEach((context) => {
		context.subject = new ConfigStorage();
		context.key = UUID.random();
	});

	it("#all should succeed", async (context) => {
		assert.object(await context.subject.all(), {});

		await context.subject.set(context.key, "value");

		assert.object(await context.subject.all(), { [context.key]: "value" });

		await context.subject.flush();

		assert.object(await context.subject.all(), {});
	});

	it("#get should succeed", async (context) => {
		await context.subject.set(context.key, "value");

		assert.is(await context.subject.get(context.key), "value");
	});

	it("#set should succeed", async (context) => {
		assert.undefined(await context.subject.set(context.key, "value"));
	});

	it("#has should succeed", async (context) => {
		assert.false(await context.subject.has(context.key));

		await context.subject.set(context.key, "value");

		assert.true(await context.subject.has(context.key));
	});

	it("#forget should succeed", async (context) => {
		assert.false(await context.subject.has(context.key));

		await context.subject.set(context.key, "value");

		assert.true(await context.subject.has(context.key));

		await context.subject.forget(context.key);

		assert.false(await context.subject.has(context.key));
	});

	it("#flush should succeed", async (context) => {
		assert.false(await context.subject.has(context.key));

		await context.subject.set(context.key, "value");

		assert.true(await context.subject.has(context.key));

		await context.subject.flush();

		assert.false(await context.subject.has(context.key));
	});

	it("#count should succeed", async (context) => {
		assert.is(await context.subject.count(), 0);

		await context.subject.set(context.key, "value");

		assert.is(await context.subject.count(), 1);

		await context.subject.forget(context.key);

		assert.is(await context.subject.count(), 0);
	});

	it("#snapshot should succeed", async (context) => {
		assert.undefined(await context.subject.snapshot());
	});

	it("#restore should succeed", async (context) => {
		assert.undefined(await context.subject.restore());
	});
});
