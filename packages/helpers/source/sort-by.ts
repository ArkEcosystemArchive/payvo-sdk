import fast from "fast-sort";

export const sortBy = <T>(
	values: T[],
	iteratees?:
		| fast.ISortByFunction<T>
		| keyof T
		| (fast.ISortByFunction<T> | keyof T)[]
		| fast.ISortBy<T>[]
		| undefined,
): T[] => fast.sort(values).asc(iteratees);
