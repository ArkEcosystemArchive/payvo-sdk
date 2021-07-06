import { ValidatorSchema } from "@payvo/sdk-support";

export const schema = ValidatorSchema.object({
	network: ValidatorSchema.string().valid("luna.mainnet", "luna.testnet"),
	httpClient: ValidatorSchema.object(),
});
