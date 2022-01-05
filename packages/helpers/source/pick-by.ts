import { filter } from "./filter.js";
import { FunctionReturning } from "./types.js";

export const pickBy = <T>(iterable: T, iteratee: FunctionReturning): T =>
	filter(iterable as any, (value) => iteratee(value));
