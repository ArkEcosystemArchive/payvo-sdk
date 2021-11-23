import { bgRed, bold, white } from "kleur";
import { Context, test } from "uvu";

export const runHook = (callback: Function) => async (context: Context) => {
	try {
		await callback(context);
	} catch (error) {
		console.log(bold(bgRed(white(error.stack))));
	}
};

export const afterAll = async (callback_: Function) => test.after(runHook(callback_));
export const afterEach = async (callback_: Function) => test.after.each(runHook(callback_));

export const beforeAll = async (callback_: Function) => test.before(runHook(callback_));
export const beforeEach = async (callback_: Function) => test.before.each(runHook(callback_));
