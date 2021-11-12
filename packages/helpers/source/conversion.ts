export const convertBuffer = (value: Buffer): string => value.toString("hex");
export const convertBufferList = (values: Buffer[]): string[] => values.map(convertBuffer);

export const convertString = (value: string): Buffer => Buffer.from(value, "hex");
export const convertStringList = (values: string[]): Buffer[] => values.map(convertString);
