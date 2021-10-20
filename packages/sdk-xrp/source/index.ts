import { manifest } from "./manifest";
import { DataTransferObjects } from "./coin.dtos";

export const XRP = {
	dataTransferObjects: DataTransferObjects, // @TODO: consistent casing to avoid alias
	manifest,
};
