import { ValidatorSchema } from "@payvo/sdk-support";

export const schema = ValidatorSchema.object({
	network: ValidatorSchema.string().valid("zil.mainnet", "zil.testnet"),
	httpClient: ValidatorSchema.object(),
});
