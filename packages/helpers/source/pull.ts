import { filter } from "./filter.js";

export const pull = <T>(iterable: T[], ...args: any[]): T[] => filter(iterable, (item) => !args.includes(item)) as T[];
