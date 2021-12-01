export type NumberLike = string | number | bigint | BigNumber;

export class BigNumber {
	public static readonly ZERO: BigNumber = new BigNumber(0);
	public static readonly ONE: BigNumber = new BigNumber(1);

	readonly #bigIntDecimals = 30;

	readonly #value: bigint;
	readonly #decimals: number | undefined;

	private constructor(value: NumberLike, decimals?: number) {
		if (value instanceof BigNumber) {
			this.#decimals = value.decimals();
		}

		if (decimals !== undefined) {
			this.#decimals = decimals;
		}

		this.#value = this.#toBigDecimal(value);
	}

	#toBigDecimal(value: NumberLike): bigint {
		const [integers, decimals = ""] = value.toString().split(".");

		return BigInt(integers + decimals.padEnd(this.#bigIntDecimals, "0"));
	}

	#fromBigDecimal(value: bigint, decimalDigits?: number): string {
		if (value === BigInt(0)) {
			return "0";
		}

		let integers = String(value).slice(0, -this.#bigIntDecimals);
		let decimals = String(value).slice(-this.#bigIntDecimals);

		if (decimalDigits !== undefined) {
			decimals = decimals.slice(0, decimalDigits);
		}

		if (integers === "") {
			integers = "0";
		}

		return this.#removeTrailingDot(integers + "." + this.#removeTrailingZeroes(decimals));
	}

	#removeTrailingZeroes(value: string): string {
		return value.replace(/\.?0+$/, "");
	}

	#removeTrailingDot(value: string): string {
		return value.replace(/\.$/, "");
	}

	public static make(value: NumberLike, decimals?: number): BigNumber {
		return new BigNumber(value, decimals);
	}

	public decimalPlaces(decimals: number): BigNumber {
		return BigNumber.make(this.#fromBigDecimal(this.#value), decimals);
	}

	public plus(value: NumberLike): BigNumber {
		return BigNumber.make(this.#fromBigDecimal(this.#value + this.#toBigDecimal(value)), this.#decimals);
	}

	public minus(value: NumberLike): BigNumber {
		return BigNumber.make(this.#fromBigDecimal(this.#value - this.#toBigDecimal(value)), this.#decimals);
	}

	public divide(value: NumberLike): BigNumber {
		return BigNumber.make(this.#fromBigDecimal(
			this.#value * BigInt("1" + "0".repeat(this.#bigIntDecimals)) / this.#toBigDecimal(value)
		), this.#decimals);
	}

	public times(value: NumberLike): BigNumber {
		return BigNumber.make(this.#fromBigDecimal(
			this.#value * (this.#toBigDecimal(value) / BigInt("1" + "0".repeat(this.#bigIntDecimals)))
		), this.#decimals);
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

	public isPositive(): boolean {
		return this.#value > 0;
	}

	public isNegative(): boolean {
		return this.#value < 0;
	}

	public isZero(): boolean {
		return this.#value === BigInt(0);
	}

	public comparedTo(value: NumberLike): number {
		return 0; // @TODO implement
		// return this.#value.comparedTo(this.#toBigDecimal(value));
	}

	public isEqualTo(value: NumberLike): boolean {
		return this.#value === this.#toBigDecimal(value);
	}

	public isGreaterThan(value: NumberLike): boolean {
		return this.#value > this.#toBigDecimal(value);
	}

	public isGreaterThanOrEqualTo(value: NumberLike): boolean {
		return this.#value >= this.#toBigDecimal(value);
	}

	public isLessThan(value: NumberLike): boolean {
		return this.#value < this.#toBigDecimal(value);
	}

	public isLessThanOrEqualTo(value: NumberLike): boolean {
		return this.#value <= this.#toBigDecimal(value);
	}

	public denominated(decimals?: number): BigNumber {
		decimals ??= this.#decimals;

		return BigNumber.make(this.#fromBigDecimal(this.#value), decimals).divide(BigNumber.powerOfTen(decimals ?? 0));
	}

	public toSatoshi(decimals?: number): BigNumber {
		decimals ??= this.#decimals;

		return BigNumber.make(this.#fromBigDecimal(this.#value), decimals).times(BigNumber.powerOfTen(decimals ?? 0));
	}

	public toHuman(decimals?: number): number {
		return +this.denominated(decimals).toString();
	}

	public toFixed(decimals?: number): string {
		return "0"; // @TODO implement
	}

	public toNumber(): number {
		return Number(this.toString());
	}

	public valueOf(): string {
		return this.#fromBigDecimal(this.#value, this.#decimals);
	}

	public toString(): string {
		return this.#fromBigDecimal(this.#value, this.#decimals);
	}

	public decimals(): number | undefined {
		return this.#decimals;
	}
}
