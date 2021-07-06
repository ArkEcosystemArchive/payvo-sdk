import { Coins } from "@payvo/sdk";
import { ARK } from "@payvo/sdk-ark";
import { Request } from "@payvo/sdk-http-got";
import Joi from "joi";

const coins: Record<string, Coins.Coin> = {};

export const makeCoin = async (input: Record<string, string>): Promise<Coins.Coin> => {
	const cacheKey = `${input.coin}.${input.network}`;

	if (coins[cacheKey]) {
		delete input.coin;
		delete input.network;
		delete input.transformer;

		return coins[cacheKey];
	}

	coins[cacheKey] = Coins.CoinFactory.make({ ARK }[input.coin]!, {
		network: input.network,
		httpClient: new Request(),
	});

	await coins[cacheKey].__construct();

	delete input.coin;
	delete input.network;
	delete input.transformer;

	return coins[cacheKey];
};

export const useLogger = (): Console => console;

export const baseSchema = {
	coin: Joi.string().required(),
	network: Joi.string().required(),
};
