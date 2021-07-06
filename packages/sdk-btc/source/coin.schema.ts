import { ValidatorSchema } from "@payvo/sdk-support";

export const schema = ValidatorSchema.object({
	network: ValidatorSchema.string().valid("btc.livenet", "btc.testnet"),
	httpClient: ValidatorSchema.object(),
});
