import { ValidatorSchema } from "@payvo/helpers";

export const schema = ValidatorSchema.object({
	network: ValidatorSchema.string().valid("nano.mainnet", "nano.testnet"),
	httpClient: ValidatorSchema.object(),
});
