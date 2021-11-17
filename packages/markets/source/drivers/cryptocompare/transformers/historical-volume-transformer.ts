import { DateTime } from "@payvo/sdk-intl";

import { HistoricalData, HistoricalTransformer } from "../../../contracts.js";

/**
 *  Implements a transformer for historical volume data.
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
    public constructor(private readonly data: Record<string, any>) { }

    /**
     * Transforms the given data into a normalised format.
     *
     * @param {Record<string, any>} options
     * @returns {HistoricalData}
     * @memberof HistoricalVolumeTransformer
     */
    public transform(options: Record<string, any>): HistoricalData {
        const datasets = this.data.map((value) => value.volumeto);

        return {
            labels: this.data.map((value) => DateTime.make(value.time * 1000).format(options.dateFormat)),
            datasets,
            min: Math.min(...datasets),
            max: Math.max(...datasets),
        };
    }
}
