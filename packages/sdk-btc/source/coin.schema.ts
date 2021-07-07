import { ValidatorSchema } from "@payvo/helpers";

export const schema = ValidatorSchema.object({
	network: ValidatorSchema.string().valid("btc.livenet", "btc.testnet"),
	httpClient: ValidatorSchema.object(),
});
