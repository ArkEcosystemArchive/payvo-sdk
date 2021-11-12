import { DateTime } from "@payvo/sdk-intl";

import {
	DailyAverageOptions,
	HistoricalData,
	HistoricalPriceOptions,
	HistoricalTransformer,
	HistoricalVolumeOptions,
	MarketDataCollection,
	PriceTracker,
} from "../../../contracts";

/**
 * Implements a transformer for historical volume data.
 *
 * @export
 * @class HistoricalVolumeTransformer
 * @implements {HistoricalTransformer}
 */
export class HistoricalVolumeTransformer implements HistoricalTransformer {
	/**
	 * Creates an instance of HistoricalVolumeTransformer.
	 *
	 * @param {Record<string, any>} data
	 * @memberof HistoricalVolumeTransformer
	 */
	public constructor(private readonly data: Record<string, any>) {}

	/**
	 * Transforms the given data into a normalised format.
	 *
	 * @param {Record<string, any>} options
	 * @returns {HistoricalData}
	 * @memberof HistoricalVolumeTransformer
	 */
	public transform(options: Record<string, any>): HistoricalData {
		const datasets = {};

		for (let i = 0; i < this.data.total_volumes.length; i += 24) {
			datasets[this.data.total_volumes[i][0]] = this.data.total_volumes[i][1];
		}

		const datasetValues: number[] = Object.values(datasets);

		return {
			labels: Object.keys(datasets).map((time) => DateTime.make(time).format(options.dateFormat)),
			datasets: datasetValues,
			min: Math.min(...datasetValues),
			max: Math.max(...datasetValues),
		};
	}
}
