import fast from "fast-sort";

import { sortBy as baseSortBy } from "../sort-by.js";

export const sortBy = <T>(
	values: T[],
	iteratees?:
		| fast.ISortByFunction<T>
		| keyof T
		| (fast.ISortByFunction<T> | keyof T)[]
		| fast.ISortBy<T>[]
		| undefined,
): T[] => baseSortBy([...values], iteratees);
