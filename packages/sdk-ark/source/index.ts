import { manifest } from "./manifest";
import { ServiceProvider } from "./coin.provider";
import { DataTransferObjects } from "./coin.dtos";

export const ARK = {
	dataTransferObjects: DataTransferObjects, // @TODO: consistent casing to avoid alias
	manifest,
	ServiceProvider,
};
