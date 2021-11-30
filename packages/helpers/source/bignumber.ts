export type NumberLike = string | number | bigint | BigNumber;

export class BigNumber {
	public static readonly ZERO: bigint = BigInt(0);
	public static readonly ONE: bigint = BigInt(1);

	readonly #value: bigint;
	readonly #decimals: number = 0;

	private constructor(value: NumberLike, decimals?: number) {
		this.#value = this.#toBigNumber(value);

		if (decimals !== undefined) {
			let [pre, post] = String(value).split(".").concat("");

			this.#decimals = decimals;
			this.#value = BigInt(pre + post.padEnd(decimals, "0"));
		}
	}

	public static make(value: NumberLike, decimals?: number): BigNumber {
		return new BigNumber(value, decimals);
	}

	public decimalPlaces(decimals: number): BigNumber {
		return BigNumber.make(this.#value, decimals);
	}

	public plus(value: NumberLike): BigNumber {
		return BigNumber.make(this.#value + this.#toBigNumber(value), this.#decimals);
	}

	public minus(value: NumberLike): BigNumber {
		return BigNumber.make(this.#value - this.#toBigNumber(value), this.#decimals);
	}

	public divide(value: NumberLike): BigNumber {
		return BigNumber.make(this.#value / this.#toBigNumber(value), this.#decimals);
	}

	public times(value: NumberLike): BigNumber {
		return BigNumber.make(this.#value * this.#toBigNumber(value), this.#decimals);
	}

	public static sum(values: NumberLike[]): BigNumber {
		return values.reduce(
			(accumulator: BigNumber, currentValue: NumberLike) => accumulator.plus(currentValue),
			BigNumber.ZERO,
		);
	}

	public static powerOfTen(exponent: NumberLike): BigNumber {
		const power = BigNumber.make(exponent).toNumber();
		return BigNumber.make(`1${"0".repeat(power)}`);
	}

	public isNaN(): boolean {
		return Number.isNaN(this.#value);
	}

	public isPositive(): boolean {
		return this.#value > 0;
	}

	public isNegative(): boolean {
		return this.#value < 0;
	}

	public isFinite(): boolean {
		return Number.isFinite(this.#value);
	}

	public isZero(): boolean {
		return this.#value === BigInt(0);
	}

	public comparedTo(value: NumberLike): number {
		return 0;
		// return this.#value.comparedTo(this.#toBigNumber(value));
	}

	public isEqualTo(value: NumberLike): boolean {
		return this.#value === this.#toBigNumber(value);
	}

	public isGreaterThan(value: NumberLike): boolean {
		return this.#value > this.#toBigNumber(value);
	}

	public isGreaterThanOrEqualTo(value: NumberLike): boolean {
		return this.#value >= this.#toBigNumber(value);
	}

	public isLessThan(value: NumberLike): boolean {
		return this.#value < this.#toBigNumber(value);
	}

	public isLessThanOrEqualTo(value: NumberLike): boolean {
		return this.#value <= this.#toBigNumber(value);
	}

	public denominated(decimals?: number): BigNumber {
		decimals ??= this.#decimals;
		return BigNumber.make(this.#value, decimals).divide(BigNumber.powerOfTen(decimals || 0));
	}

	public toSatoshi(decimals?: number): BigNumber {
		decimals ??= this.#decimals;
		return BigNumber.make(this.#value, decimals).times(BigNumber.powerOfTen(decimals || 0));
	}

	public toHuman(decimals?: number): number {
		return +this.denominated(decimals).toString();
	}

	public toFixed(decimals?: number): string {
		if (decimals !== undefined) {
			const result: string = this.#value.toString().padStart(decimals + 1, "0");

			return [
				result.slice(0, -decimals),
				result.slice(-decimals).replace(/\.?0+$/, "")
			].join(".");
		}

		return this.#value.toString();
	}

	public toNumber(): number {
		return Number(this.toString());
	}

	public toString(): string {
		return this.toFixed(this.#decimals);
	}

	public valueOf(): string {
		return this.#value.toString();
	}

	#toBigNumber(value: NumberLike): bigint {
		if (value instanceof BigNumber) {
			return BigInt(value.valueOf());
		}

		return BigInt(value);
	}
}
