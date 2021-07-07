import { ValidatorSchema } from "@payvo/helpers";

export const schema = ValidatorSchema.object({
	network: ValidatorSchema.string().valid("ada.mainnet", "ada.testnet"),
	httpClient: ValidatorSchema.object(),
});
