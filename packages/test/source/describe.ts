import { Context, suite, Test } from "uvu";

import { assert } from "./assert.js";
import { eachSuite } from "./each.js";
import { Mockery } from "./mockery.js";

type ContextFunction = () => Context;
type ContextPromise = () => Promise<Context>;

const runSuite = (suite: Test, callback: Function): void => {
	callback({
		afterAll: suite.after,
		afterEach: suite.after.each,
		assert,
		beforeAll: suite.before,
		beforeEach: suite.before.each,
		each: eachSuite(suite),
		it: suite,
		mock: Mockery.mock,
		only: suite.only,
		skip: suite.skip,
		spy: Mockery.spy,
		stub: Mockery.stub,
		test: suite,
	});

	suite.run();
};

export const describe = (title: string, callback: Function): void => runSuite(suite(title), callback);

export const describeWithContext = async (
	title: string,
	context: Context | ContextFunction | ContextPromise,
	callback: Function,
): Promise<void> => runSuite(suite(title, typeof context === "function" ? await context() : context), callback);
