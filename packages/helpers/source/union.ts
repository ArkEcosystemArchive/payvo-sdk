import { flatten } from "./flatten.js";
import { uniq } from "./uniq.js";

export const union = <T>(...args: T[]): T[] => uniq(flatten(args));
