import { FunctionReturning } from "./types.js";
import { isArray } from "./is-array.js";
import { reduceRightArray } from "./reduce-right-array.js";
import { reduceRightObject } from "./reduce-right-object.js";

export const reduceRight = <T, V>(
	iterable: T | T[],
	iteratee: FunctionReturning,
	initialValue: V,
): V | V[] | undefined =>
	isArray(iterable)
		? reduceRightArray(iterable, iteratee, initialValue)
		: reduceRightObject(iterable, iteratee, initialValue);
