import { ValidatorSchema } from "@payvo/sdk-support";

export const schema = ValidatorSchema.object({
	network: ValidatorSchema.string().valid("atom.mainnet", "atom.testnet"),
	httpClient: ValidatorSchema.object(),
});
