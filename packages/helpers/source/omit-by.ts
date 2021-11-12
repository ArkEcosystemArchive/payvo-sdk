import { filter } from "./filter";
import { FunctionReturning } from "./types";

export const omitBy = <T>(iterable: T, iteratee: FunctionReturning): T =>
	filter(iterable, (value) => !iteratee(value)) as T;
