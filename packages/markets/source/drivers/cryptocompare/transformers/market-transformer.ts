import { MarketDataCollection } from "../../../contracts/index.js";

/**
 * Implements a transformer for historical market data.
 *
 * @export
 * @class MarketTransformer
 * @implements {MarketTransformer}
 */
export class MarketTransformer implements MarketTransformer {
	/**
	 * Creates an instance of MarketTransformer.
	 *
	 * @param {Record<string, any>} data
	 * @memberof MarketTransformer
	 */
	public constructor(private readonly data: Record<string, any>) {}

	/**
	 * Transforms the given data into a normalised format.
	 *
	 * @param {Record<string, any>} options
	 * @returns {MarketDataCollection}
	 * @memberof MarketTransformer
	 */
	public transform(options: Record<string, any>): MarketDataCollection {
		const result = {};

		for (const value of Object.values(this.data) as any) {
			result[value.TOSYMBOL] = {
				currency: value.TOSYMBOL,
				price: value.PRICE,
				marketCap: value.MKTCAP,
				volume: value.TOTALVOLUME24HTO,
				date: new Date(value.LASTUPDATE * 1000),
				change24h: value.CHANGEPCT24HOUR,
			};
		}

		return result;
	}
}
