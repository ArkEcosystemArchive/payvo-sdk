import { Buffer as BufferSafe } from "buffer/";
import { Buffer as BufferNative } from "node:buffer";

export const isBuffer = (value: unknown): boolean => BufferNative.isBuffer(value) || BufferSafe.isBuffer(value);
