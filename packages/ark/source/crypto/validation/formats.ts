import { Ajv } from "ajv";

import { maxVendorFieldLength } from "../utils.js";

const vendorField = (ajv: Ajv) => {
	ajv.addFormat("vendorField", (data) => {
		try {
			return Buffer.from(data, "utf8").length <= maxVendorFieldLength();
		} catch {
			return false;
		}
	});
};

export const formats = [vendorField];
