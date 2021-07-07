import { ValidatorSchema } from "@payvo/helpers";

export const schema = ValidatorSchema.object({
	network: ValidatorSchema.string().valid("xrp.mainnet", "xrp.testnet"),
	httpClient: ValidatorSchema.object(),
});
