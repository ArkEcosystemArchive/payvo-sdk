import { ValidatorSchema } from "@payvo/sdk-support";

export const schema = ValidatorSchema.object({
	network: ValidatorSchema.string().valid("sol.mainnet", "sol.testnet"),
	httpClient: ValidatorSchema.object(),
});
