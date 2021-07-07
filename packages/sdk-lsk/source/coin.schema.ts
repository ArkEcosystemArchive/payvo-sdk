import { ValidatorSchema } from "@payvo/helpers";

export const schema = ValidatorSchema.object({
	network: ValidatorSchema.string().valid("lsk.mainnet", "lsk.testnet"),
	httpClient: ValidatorSchema.object(),
});
