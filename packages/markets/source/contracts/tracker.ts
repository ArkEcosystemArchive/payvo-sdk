import {
	CurrentPriceOptions,
	DailyAverageOptions,
	HistoricalData,
	HistoricalPriceOptions,
	HistoricalVolumeOptions,
} from "./historical.js";
import { MarketDataCollection } from "./market.js";

export interface PriceTracker {
	verifyToken(token: string): Promise<boolean>;

	marketData(token: string): Promise<MarketDataCollection>;

	historicalPrice(options: HistoricalPriceOptions): Promise<HistoricalData>;

	historicalVolume(options: HistoricalVolumeOptions): Promise<HistoricalData>;

	dailyAverage(options: DailyAverageOptions): Promise<number>;

	currentPrice(options: CurrentPriceOptions): Promise<number>;
}
