import fastSort, { ISortBy, ISortByFunction } from "fast-sort";

export const sortBy = <T>(
	values: T[],
	iteratees?: ISortByFunction<T> | keyof T | (ISortByFunction<T> | keyof T)[] | ISortBy<T>[] | undefined,
): T[] => fastSort.sort(values).asc(iteratees);
