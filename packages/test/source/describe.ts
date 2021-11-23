import { bgRed, bold, white } from "kleur";
import { Context, suite, Test } from "uvu";

import { assert } from "./assert.js";
import { eachSuite } from "./each.js";
import { Mockery } from "./mockery.js";

type ContextFunction = () => Context;
type ContextPromise = () => Promise<Context>;

const runHook = (cb: Function) => async (context: Context) => {
	try {
		await cb(context);
	} catch (error) {
		console.log(bold(bgRed(white(error.stack))));
		throw error;
	}
};

const runSuite = (suite: Test, callback: Function): void => {
	callback({
		afterAll: async (cb: Function) => suite.after(runHook(cb)),
		afterEach: async (cb: Function) => suite.after.each(runHook(cb)),
		assert,
		beforeAll: async (cb: Function) => suite.before(runHook(cb)),
		beforeEach: async (cb: Function) => suite.before.each(runHook(cb)),
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
