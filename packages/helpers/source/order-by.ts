import fast from "fast-sort";

import { FunctionReturning, Iteratee } from "./types.js";
import { isFunction } from "./is-function.js";
import { isString } from "./is-string.js";
import { map } from "./map.js";

export const orderBy = <T>(values: T[], iteratees: Iteratee | Iteratee[], orders: string | string[]): T[] => {
    if (isString(iteratees)) {
        iteratees = [iteratees] as string[];
    } else if (isFunction(iteratees)) {
        iteratees = [iteratees] as FunctionReturning[];
    }

    if (isString(orders)) {
        orders = [orders];
    }

    return fast
        .sort(values)
        .by(map(iteratees as any, (_: string, index: number) => ({ [orders[index]]: iteratees[index] })));
};
