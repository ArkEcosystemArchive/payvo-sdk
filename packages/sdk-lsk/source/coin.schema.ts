import { ValidatorSchema } from "@payvo/sdk-support";

export const schema = ValidatorSchema.object({
	network: ValidatorSchema.string().valid("lsk.mainnet", "lsk.testnet"),
	httpClient: ValidatorSchema.object(),
});
