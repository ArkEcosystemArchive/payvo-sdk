import { ValidatorSchema } from "@payvo/sdk-support";

export const schema = ValidatorSchema.object({
	network: ValidatorSchema.string().valid("ark.mainnet", "ark.devnet", "bind.mainnet", "bind.testnet"),
	httpClient: ValidatorSchema.object(),
});
