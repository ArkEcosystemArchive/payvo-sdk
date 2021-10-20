import { manifest } from "./manifest";
import { DataTransferObjects } from "./coin.dtos";

export const ETH = {
	dataTransferObjects: DataTransferObjects, // @TODO: consistent casing to avoid alias
	manifest,
};
