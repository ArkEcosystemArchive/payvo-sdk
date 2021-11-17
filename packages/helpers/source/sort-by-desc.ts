import fast from "fast-sort";

export const sortByDesc = <T>(
	values: T[],
	iteratees?:
		| fast.ISortByFunction<T>
		| keyof T
		| (fast.ISortByFunction<T> | keyof T)[]
		| fast.ISortBy<T>[]
		| undefined,
): T[] => fast.sort(values).desc(iteratees);
