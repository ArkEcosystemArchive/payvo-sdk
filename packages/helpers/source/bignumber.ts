export type NumberLike = string | number | bigint | BigNumber;

interface BigNumberValue {
	integers: string;
	decimals?: string;
}

export class BigNumber {
	public static readonly ZERO: bigint = BigInt(0);
	public static readonly ONE: bigint = BigInt(1);

	#value: bigint;
	#valueOf: BigNumberValue;
	#decimals: number = 0;

	private constructor(value: NumberLike, decimals?: number) {
		if (value instanceof BigNumber) {
			this.#decimals = value.decimals();
		}

		if (decimals !== undefined) {
			this.#decimals = decimals;
		}

		this.#value = this.#toBigDecimal(value);
		this.#valueOf = this.#parseNumber(value);
	}

	public static make(value: NumberLike, decimals?: number): BigNumber {
		return new BigNumber(value, decimals);
	}

	public decimalPlaces(decimals: number): BigNumber {
		return BigNumber.make(this.toString(), decimals);
	}

	public plus(value: NumberLike): BigNumber {
		return BigNumber.make(this.#value + this.#toBigDecimal(value), this.#decimals);
	}

	public minus(value: NumberLike): BigNumber {
		return BigNumber.make(this.#value - this.#toBigDecimal(value), this.#decimals);
	}

	public divide(value: NumberLike): BigNumber {
		return BigNumber.make(this.#value / this.#toBigDecimal(value), this.#decimals);
	}

	public times(value: NumberLike): BigNumber {
		return BigNumber.make(this.#value * this.#toBigDecimal(value), this.#decimals);
	}

	public static sum(values: NumberLike[]): BigNumber {
		return values.reduce(
			(accumulator: BigNumber, currentValue: NumberLike) => accumulator.plus(currentValue),
			BigNumber.ZERO,
		);
	}

	public static powerOfTen(exponent: NumberLike): BigNumber {
		const power: number = BigNumber.make(exponent).toNumber();

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

			if (decimals === 0) {
				console.log(this.#value);
				console.log(this.#valueOf);
				return this.#valueOf.integers;
			}

			return result.slice(0, -decimals) + "." + result.slice(-decimals).replace(/\.?0+$/, "");
		}

		return this.#value.toString();
	}

	public toNumber(): number {
		return Number(this.toString());
	}

	public toString(): string {
		if (!this.#decimals) {
			return this.#valueOf.integers;
		}

		if (!this.#valueOf.decimals) {
			return this.#valueOf.integers;
		}

		return this.#valueOf.integers + "." + this.#valueOf.decimals;
	}

	public valueOf(): BigNumberValue {
		return this.#valueOf;
	}

	public decimals(): number {
		return this.#decimals;
	}

	#toBigDecimal(value: NumberLike): bigint {
		const { integers, decimals } = value instanceof BigNumber
			? value.valueOf()
			: this.#parseNumber(value);

		let decimalDigits: number = value instanceof BigNumber
			? value.decimals()
			: this.#decimals;

		if (!decimals || !decimalDigits) {
			return BigInt(integers);
		}

		return BigInt(integers + decimals.padEnd(decimalDigits, "0"));
	}

	#parseNumber(value: NumberLike): BigNumberValue {
		const [integers, decimals] = String(value).split(".");

		return {
			integers: String(integers),
			decimals: decimals ? String(decimals) : undefined,
		};
	}
}
