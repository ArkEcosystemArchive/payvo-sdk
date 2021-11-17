import { FunctionReturning } from "./types.js";
import { isArray } from "./is-array.js";
import { mapArray } from "./map-array.js";
import { mapObject } from "./map-object.js";

export const map = <T, R>(iterable: T | T[], iteratee: FunctionReturning): R | R[] =>
	isArray(iterable) ? mapArray(iterable, iteratee) : mapObject(iterable, iteratee);
