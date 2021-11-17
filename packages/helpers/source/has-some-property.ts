import { hasProperty } from "./has-property.js";
import { some } from "./some.js";

export const hasSomeProperty = <T>(object: T, props: string[]): boolean =>
	some(props, (prop: string) => hasProperty(object, prop));
