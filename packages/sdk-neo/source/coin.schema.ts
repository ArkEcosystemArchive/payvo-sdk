import { ValidatorSchema } from "@payvo/helpers";

export const schema = ValidatorSchema.object({
	network: ValidatorSchema.string().valid("neo.mainnet", "neo.testnet"),
	httpClient: ValidatorSchema.object(),
});
