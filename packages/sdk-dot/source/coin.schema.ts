import { ValidatorSchema } from "@payvo/sdk-support";

export const schema = ValidatorSchema.object({
	network: ValidatorSchema.string().valid("dot.mainnet", "ksm.mainnet"),
	httpClient: ValidatorSchema.object(),
});
