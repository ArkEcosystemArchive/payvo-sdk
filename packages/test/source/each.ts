import { Callback, Context, Test, test } from "uvu";

export const each = (name: string, callback: Callback<any>, datasets: unknown[]) => {
	for (const dataset of datasets) {
		test(name, async (context: Context) => callback({ context, dataset }));
	}
}


export const eachSuite = (test: Test) => {
	return (name: string, callback: Callback<any>, datasets: unknown[]) => {
		for (const dataset of datasets) {
			test(name, async (context: Context) => callback({ context, dataset }));
		}
	}
}
