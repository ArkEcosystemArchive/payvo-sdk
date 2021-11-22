import { format } from "string-kit";
import { Callback, Context, Test, test } from "uvu";

const formatName = (name: string, ...dataset): string => format(name, dataset);

export const each = (name: string, callback: Callback<any>, datasets: unknown[]) => {
	for (const dataset of datasets) {
		test(formatName(name), async (context: Context) => callback({ context, dataset }));
	}
};

export const eachSuite = (test: Test) => {
	return (name: string, callback: Callback<any>, datasets: unknown[]) => {
		for (const dataset of datasets) {
			console.log()
			test(formatName(name), async (context: Context) => callback({ context, dataset }));
		}
	}
};
