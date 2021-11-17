import { orderBy as baseOrderBy } from "../order-by.js";
import { Iteratee } from "../types.js";

export const orderBy = <T>(values: T[], iteratees: Iteratee | Iteratee[], orders: string | string[]): T[] =>
	baseOrderBy([...values], iteratees, orders);
