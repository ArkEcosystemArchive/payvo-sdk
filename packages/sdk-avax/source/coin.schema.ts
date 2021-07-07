import { ValidatorSchema } from "@payvo/helpers";

export const schema = ValidatorSchema.object({
	network: ValidatorSchema.string().valid("avax.mainnet", "avax.testnet"),
	httpClient: ValidatorSchema.object(),
});
