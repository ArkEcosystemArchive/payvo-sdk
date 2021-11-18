import { readFileSync } from "node:fs";
import { resolve } from "node:path";

export const loader = {
	json: (path: string): Record<string, any> => JSON.parse(readFileSync(resolve(path)).toString()),
};
