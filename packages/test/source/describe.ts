import { spy } from "sinon";
import { Context, suite, Test } from "uvu";
import { z as schema } from "zod";

import { assert } from "./assert.js";
import { each, formatName } from "./each.js";
import { runHook } from "./hooks.js";
import { loader } from "./loader.js";
import { Mockery } from "./mockery.js";
import { nock } from "./nock.js";

type ContextFunction = () => Context;

const runSuite = (suite: Test, callback: Function, dataset?: unknown): void => {
	suite.before(() => nock.disableNetConnect());

	suite.after(() => nock.enableNetConnect());
	suite.after.each(() => nock.cleanAll());

	callback({
		afterAll: async (callback_: Function) => suite.after(runHook(callback_)),
		afterEach: async (callback_: Function) => suite.after.each(runHook(callback_)),
		assert,
		beforeAll: async (callback_: Function) => suite.before(runHook(callback_)),
		beforeEach: async (callback_: Function) => suite.before.each(runHook(callback_)),
		dataset,
		each: each(suite),
		it: suite,
		loader,
		nock,
		only: suite.only,
		schema,
		skip: suite.skip,
		spy,
		stub: (target: object, method: string) => new Mockery(target, method),
		test: suite,
		zod,
	});

	suite.run();
};

export const describe = (title: string, callback: Function): void => runSuite(suite(title), callback);

export const describeWithContext = (title: string, context: Context | ContextFunction, callback: Function): void =>
	runSuite(suite(title, typeof context === "function" ? context() : context), callback);

export const describeEach = (title: string, callback: Function, datasets: unknown[]): void => {
	for (const dataset of datasets) {
		runSuite(suite(formatName(title, dataset)), callback);
	}
};
