import { BigNumber } from "@payvo/sdk-helpers";
import { CURRENCIES, Money, Numeral } from "@payvo/sdk-intl";

interface CurrencyFormatOptions {
	locale: string;
}

const DEFAULT_DECIMALS = 8;

export class Currency {
	public static format(value: number, ticker: string, options?: CurrencyFormatOptions): string {
		const decimals = CURRENCIES[ticker]?.decimals ?? DEFAULT_DECIMALS;

		if (decimals <= 2) {
			return Money.make(
				BigNumber.make(value).times(Math.pow(10, decimals)).decimalPlaces(0).toNumber(),
				ticker,
			).format();
		}

		const numeral = Numeral.make(options?.locale, {
			currencyDisplay: "name",
			maximumFractionDigits: decimals,
			minimumFractionDigits: 0,
		});

		// Intl.NumberFormat throws error for some tickers like DARK
		// so format as BTC then replace
		return numeral.formatAsCurrency(value, "BTC").replace("BTC", ticker.toUpperCase());
	}
}
