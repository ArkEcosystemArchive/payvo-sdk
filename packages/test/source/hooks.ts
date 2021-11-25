import { bgRed, bold, white } from "kleur";
import { Context } from "uvu";

export const runHook = (callback: Function) => async (context: Context) => {
	try {
		await callback(context);
	} catch (error) {
		console.log(bold(bgRed(white(error.stack))));
	}
};
