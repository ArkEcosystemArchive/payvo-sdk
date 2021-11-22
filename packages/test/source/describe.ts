import { suite } from "uvu";

import { assert } from "./assert.js";

export const describe = (title: string, callback: Function): void => {
	const instance = suite(title);

	callback({
		afterAll: instance.after,
		afterEach: instance.after.each,
		assert,
		beforeAll: instance.before,
		beforeEach: instance.before.each,
		it: instance,
		only: instance.only,
		skip: instance.skip,
		test: instance,
	});

	instance.run();
};
