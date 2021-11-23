import { bgRed, bold, white } from "kleur";
import { Context, suite, Test } from "uvu";

import { assert } from "./assert.js";
import { eachSuite } from "./each.js";
import { Mockery } from "./mockery.js";

type ContextFunction = () => Context;
type ContextPromise = () => Promise<Context>;

const runHook = (callback: Function) => async (context: Context) => {
	try {
		await callback(context);
	} catch (error) {
		console.log(bold(bgRed(white(error.stack))));
	}
};

const runSuite = (suite: Test, callback: Function): void => {
	callback({
		afterAll: async (callback_: Function) => suite.after(runHook(callback_)),
		afterEach: async (callback_: Function) => suite.after.each(runHook(callback_)),
		assert,
		beforeAll: async (callback_: Function) => suite.before(runHook(callback_)),
		beforeEach: async (callback_: Function) => suite.before.each(runHook(callback_)),
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
