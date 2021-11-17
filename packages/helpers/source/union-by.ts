import { flatten } from "./flatten.js";
import { uniqBy } from "./uniq-by.js";

export const unionBy = <T>(...args: any[]): T[] => {
	const iteratee = args.pop();

	return uniqBy(flatten(args), iteratee);
};
