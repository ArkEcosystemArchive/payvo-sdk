import { ValidatorSchema } from "@payvo/helpers";

export const schema = ValidatorSchema.object({
	network: ValidatorSchema.string().valid("dot.mainnet", "ksm.mainnet"),
	httpClient: ValidatorSchema.object(),
});
