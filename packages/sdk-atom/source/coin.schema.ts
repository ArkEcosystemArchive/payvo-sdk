import { ValidatorSchema } from "@payvo/helpers";

export const schema = ValidatorSchema.object({
	network: ValidatorSchema.string().valid("atom.mainnet", "atom.testnet"),
	httpClient: ValidatorSchema.object(),
});
