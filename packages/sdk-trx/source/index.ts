import { manifest } from "./manifest";
import { DataTransferObjects } from "./coin.dtos";

export const TRX = {
	dataTransferObjects: DataTransferObjects, // @TODO: consistent casing to avoid alias
	manifest,
};
