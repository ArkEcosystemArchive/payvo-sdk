import { ValidatorSchema } from "@payvo/helpers";

export const schema = ValidatorSchema.object({
	network: ValidatorSchema.string().valid("luna.mainnet", "luna.testnet"),
	httpClient: ValidatorSchema.object(),
});
