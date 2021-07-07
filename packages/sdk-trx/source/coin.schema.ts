import { ValidatorSchema } from "@payvo/helpers";

export const schema = ValidatorSchema.object({
	network: ValidatorSchema.string().valid("trx.mainnet", "trx.testnet"),
	httpClient: ValidatorSchema.object(),
});
