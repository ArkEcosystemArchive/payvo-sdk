import { filterObject } from "./filter-object.js";
import { FunctionReturning } from "./types.js";

export const findKey = <T>(iterable: T, iteratee: FunctionReturning): string =>
	Object.keys(filterObject(iterable, iteratee))[0];
