import fast from "fast-sort";

import { sortByDesc as baseSortByDesc } from "../sort-by-desc";

export const sortByDesc = <T>(
	values: T[],
	iteratees?:
		| fast.ISortByFunction<T>
		| keyof T
		| (fast.ISortByFunction<T> | keyof T)[]
		| fast.ISortBy<T>[]
		| undefined,
): T[] => baseSortByDesc([...values], iteratees);
