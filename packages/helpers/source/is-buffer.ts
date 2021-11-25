import { Buffer } from "safe-buffer";

export const isBuffer = (value: unknown): boolean => Buffer.isBuffer(value);
