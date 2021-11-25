import { Buffer as Native } from "node:buffer";
import { Buffer as Safe } from "buffer/";

export const convertBuffer = (value: Native | Safe): string => value.toString("hex");
export const convertBufferList = (values: Native[] | Safe[]): string[] => values.map(convertBuffer);

export const convertString = (value: string): Safe => Safe.from(value, "hex");
export const convertStringList = (values: string[]): Safe[] => values.map(convertString);
