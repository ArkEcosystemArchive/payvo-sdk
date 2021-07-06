import { ValidatorSchema } from "@payvo/sdk-support";

export const schema = ValidatorSchema.object({
	network: ValidatorSchema.string().valid("xlm.mainnet", "xlm.testnet"),
	httpClient: ValidatorSchema.object(),
});
