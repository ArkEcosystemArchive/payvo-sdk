import { ValidatorSchema } from "@payvo/helpers";

export const schema = ValidatorSchema.object({
	network: ValidatorSchema.string().valid("zil.mainnet", "zil.testnet"),
	httpClient: ValidatorSchema.object(),
});
