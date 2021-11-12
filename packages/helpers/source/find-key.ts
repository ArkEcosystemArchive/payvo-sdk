import { filterObject } from "./filter-object";
import { FunctionReturning } from "./types";

export const findKey = <T>(iterable: T, iteratee: FunctionReturning): string =>
	Object.keys(filterObject(iterable, iteratee))[0];
