import { Context, suite, Test } from "uvu";
import { z as zod } from "zod";

import { assert } from "./assert.js";
import { each } from "./each.js";
import { runHook } from "./hooks.js";
import { loader } from "./loader.js";
import { Mockery } from "./mockery.js";
import { nock } from "./nock.js";

type ContextFunction = () => Context;
type ContextPromise = () => Promise<Context>;

const runSuite = (suite: Test, callback: Function): void => {
	suite.before(() => nock.disableNetConnect());

	suite.after(() => nock.enableNetConnect());
	suite.after.each(() => nock.cleanAll());

	callback({
		afterAll: async (callback_: Function) => suite.after(runHook(callback_)),
		afterEach: async (callback_: Function) => suite.after.each(runHook(callback_)),
		assert,
		beforeAll: async (callback_: Function) => suite.before(runHook(callback_)),
		beforeEach: async (callback_: Function) => suite.before.each(runHook(callback_)),
		each: each(suite),
		it: suite,
		loader,
		nock,
		only: suite.only,
		skip: suite.skip,
		stub: Mockery.stub,
		zod,
	});

	suite.run();
};

export const describe = (title: string, callback: Function): void => runSuite(suite(title), callback);

export const describeWithContext = async (
	title: string,
	context: Context | ContextFunction | ContextPromise,
	callback: Function,
): Promise<void> => runSuite(suite(title, typeof context === "function" ? await context() : context), callback);
