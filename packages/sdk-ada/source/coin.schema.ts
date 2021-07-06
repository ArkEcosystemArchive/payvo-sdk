import { ValidatorSchema } from "@payvo/sdk-support";

export const schema = ValidatorSchema.object({
	network: ValidatorSchema.string().valid("ada.mainnet", "ada.testnet"),
	httpClient: ValidatorSchema.object(),
});
