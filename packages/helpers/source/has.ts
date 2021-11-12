import { has as base } from "dot-prop";
import { isObject } from "./is-object";
import { isString } from "./is-string";

export const has = <T>(object: T, path: string | string[]): boolean => {
	if (!isObject(object) || !isString(path)) {
		return false;
	}

	return base(object, path);
};
