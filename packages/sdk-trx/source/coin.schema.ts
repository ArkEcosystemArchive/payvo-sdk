import { ValidatorSchema } from "@payvo/sdk-support";

export const schema = ValidatorSchema.object({
	network: ValidatorSchema.string().valid("trx.mainnet", "trx.testnet"),
	httpClient: ValidatorSchema.object(),
});
