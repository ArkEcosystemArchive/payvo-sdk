import { ValidatorSchema } from "@payvo/sdk-support";

export const schema = ValidatorSchema.object({
	network: ValidatorSchema.string().valid("nano.mainnet", "nano.testnet"),
	httpClient: ValidatorSchema.object(),
});
