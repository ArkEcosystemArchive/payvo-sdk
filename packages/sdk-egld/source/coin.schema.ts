import { ValidatorSchema } from "@payvo/helpers";

export const schema = ValidatorSchema.object({
	network: ValidatorSchema.string().valid("egld.mainnet", "egld.testnet"),
	httpClient: ValidatorSchema.object(),
});
