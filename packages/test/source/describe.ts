import { Context, suite, Test } from "uvu";

import { assert } from "./assert.js";
import { eachSuite } from "./each.js";
import { Mockery } from "./mockery.js";

type ContextFunction = () => Context;
type ContextPromise = () => Promise<Context>;

const runSuite = (instance: Test, callback: Function): void => {
	callback({
		afterAll: instance.after,
		afterEach: instance.after.each,
		assert,
		beforeAll: instance.before,
		beforeEach: instance.before.each,
		each: eachSuite(instance),
		it: instance,
		mock: Mockery.mock,
		only: instance.only,
		skip: instance.skip,
		spy: Mockery.spy,
		stub: Mockery.stub,
		test: instance,
	});

	instance.run();
};

export const describe = (title: string, callback: Function): void => runSuite(suite(title), callback);

export const describeWithContext = async (
	title: string,
	context: Context | ContextFunction | ContextPromise,
	callback: Function,
): Promise<void> => runSuite(suite(title, typeof context === "function" ? await context() : context), callback);
