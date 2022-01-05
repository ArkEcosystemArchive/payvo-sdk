import { compoundWords } from "./compound-words.js";

export const snakeCase = (value: string): string | undefined =>
	compoundWords(value, (result: string, word: string, index: number) => result + (index ? "_" : "") + word);
