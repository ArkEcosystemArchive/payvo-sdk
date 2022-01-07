import { ISortBy, ISortByFunction } from "fast-sort";

const fastSort = await import ("fast-sort").then(module => module.sort);

export const sortByDesc = <T>(
	values: T[],
	iteratees?: ISortByFunction<T> | keyof T | (ISortByFunction<T> | keyof T)[] | ISortBy<T>[] | undefined,
): T[] => fastSort(values).desc(iteratees);
