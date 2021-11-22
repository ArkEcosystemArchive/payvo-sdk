import { Context, suite, Test } from "uvu";

import { assert } from "./assert.js";

type ContextFunction = () => Context;

const runSuite = (suite: Test, callback: Function): void => {
	callback({
		afterAll: suite.after,
		afterEach: suite.after.each,
		assert,
		beforeAll: suite.before,
		beforeEach: suite.before.each,
		it: suite,
		only: suite.only,
		skip: suite.skip,
		test: suite,
	});

	suite.run();
}

export const describe = (title: string, callback: Function): void => runSuite(suite(title), callback);

export const describeWithContext = (title: string, context: Context | ContextFunction, callback: Function): void =>
	runSuite(suite(title, typeof context === "function" ? context() : context), callback)
