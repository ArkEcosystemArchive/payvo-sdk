import { createRequire } from "module";

export const requireModule = (path: string): any => {
	// @ts-ignore
	return require(path);
};
