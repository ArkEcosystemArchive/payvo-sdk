import { cloneDeep } from "./clone-deep";

describe("#cloneDeep", () => {
	test("should work with objects", () => {
		const object = { a: 1 };

		assert.is(cloneDeep(object), object);
	});

	test("should work with class instances", () => {
		class Wallet {
			constructor(readonly address) {}

			public isDelegate() {
				return true;
			}
		}

		const original = new Wallet("address");

		assert.is(original, original);
		assert.is(original.isDelegate(), true);
		assert.is(original.address, "address");

		const clone = cloneDeep(original);

		assert.is(clone, original);
		assert.is(clone.isDelegate(), true);
		assert.is(clone.address, "address");
	});
});
