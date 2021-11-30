import { promisify } from "es6-promisify";

export const sleep = promisify(setTimeout);
