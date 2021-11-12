import { get as base } from "dot-prop";
import { isObject } from "./is-object";
import { isString } from "./is-string";

export const get = <T, V>(object: T, path: string | string[], defaultValue?: V): V => {
	if (!isObject(object) || !isString(path)) {
		return defaultValue as V;
	}

	return base(object, path, defaultValue) as V;
};
