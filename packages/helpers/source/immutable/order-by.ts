import { orderBy as baseOrderBy } from "../order-by";
import { Iteratee } from "../types";

export const orderBy = <T>(values: T[], iteratees: Iteratee | Iteratee[], orders: string | string[]): T[] =>
	baseOrderBy([...values], iteratees, orders);
