import { manifest } from "./manifest";
import { DataTransferObjects } from "./coin.dtos";

export const SOL = {
	dataTransferObjects: DataTransferObjects, // @TODO: consistent casing to avoid alias
	manifest,
};
