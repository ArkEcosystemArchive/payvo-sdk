import { z } from "zod";

export const zod = {
	number: () => z.preprocess((val) => Number(val), z.number()),
	object: z.object,
	regex: (regex: RegExp) => z.preprocess((val) => String(val), z.string().regex(regex)),
	string: () => z.preprocess((val) => String(val), z.string()),
}
