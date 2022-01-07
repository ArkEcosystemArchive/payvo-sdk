import * as fastSort from "./fast-sort.js";

import { isFunction } from "./is-function.js";
import { isString } from "./is-string.js";
import { map } from "./map.js";
import { FunctionReturning, Iteratee } from "./types.js";

export const orderBy = <T>(values: T[], iteratees: Iteratee | Iteratee[], orders: string | string[]): T[] => {
	if (isString(iteratees)) {
		iteratees = [iteratees] as string[];
	} else if (isFunction(iteratees)) {
		iteratees = [iteratees] as FunctionReturning[];
	}

	if (isString(orders)) {
		orders = [orders];
	}

	return fastSort
		.sort(values)
		.by(map(iteratees as any, (_: string, index: number) => ({ [orders[index]]: iteratees[index] })));
};
