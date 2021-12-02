type NumberLike = string | number | bigint | BigNumber;

interface BigNumberParameters {
	value: NumberLike;
	decimals?: number;
	asBigDecimal?: boolean;
}

class BigNumber {
	public static readonly ZERO: BigNumber = new BigNumber({ value: 0 });
	public static readonly ONE: BigNumber = new BigNumber({ value: 1 });

	readonly #bigIntDecimals = 30;

	readonly #value: bigint;
	readonly #decimals: number | undefined;

	private constructor({ value, decimals, asBigDecimal }: BigNumberParameters) {
		if (value instanceof BigNumber) {
			this.#decimals = value.decimals();
		}

		if (decimals !== undefined) {
			this.#decimals = decimals;
		}

		if (!asBigDecimal) {
			const [int, dec = ""] = String(value).split(".");

			this.#value = BigInt(`${int}${dec.padEnd(this.#bigIntDecimals, "0").slice(0, this.#bigIntDecimals)}`);

			return;
		}

		if (typeof value !== "bigint") {
			throw new TypeError("[value] must be of type bigint when [asBigDecimal] is true.");
		}

		this.#value = value;
	}

	public static make(value: NumberLike, decimals?: number): BigNumber {
		return new BigNumber({ decimals, value });
	}

	#fromBigDecimal(value: bigint, decimals?: number): BigNumber {
		return new BigNumber({ asBigDecimal: true, decimals, value });
	}

	public decimalPlaces(decimals: number): BigNumber {
		return this.#fromBigDecimal(this.#value, decimals);
	}

	public bigDecimal(): bigint {
		return this.#value;
	}

	public decimals(): number | undefined {
		return this.#decimals;
	}

	public plus(value: NumberLike): BigNumber {
		return this.#fromBigDecimal(this.#value + BigNumber.make(value).bigDecimal());
	}

	public minus(value: NumberLike): BigNumber {
		return this.#fromBigDecimal(this.#value - BigNumber.make(value).bigDecimal());
	}

	public divide(value: NumberLike): BigNumber {
		return this.#fromBigDecimal(this.#value * this.#shift() / BigNumber.make(value).bigDecimal());
	}

	public times(value: NumberLike): BigNumber {
		return this.#fromBigDecimal(this.#value * BigNumber.make(value).bigDecimal() / this.#shift());
	}

	public static sum(values: NumberLike[]): BigNumber {
		return values.reduce(
			(accumulator: BigNumber, currentValue: NumberLike) => accumulator.plus(currentValue),
			BigNumber.ZERO,
		);
	}

	public static powerOfTen(exponent: number): BigNumber {
		return BigNumber.make(`1${"0".repeat(exponent)}`);
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
		if (this.isGreaterThan(value)) {
			return 1;
		}

		if (this.isLessThan(value)) {
			return -1;
		}

		return 0;
	}

	public isEqualTo(value: NumberLike): boolean {
		return this.#value === BigNumber.make(value).bigDecimal();
	}

	public isGreaterThan(value: NumberLike): boolean {
		return this.#value > BigNumber.make(value).bigDecimal();
	}

	public isGreaterThanOrEqualTo(value: NumberLike): boolean {
		return this.#value >= BigNumber.make(value).bigDecimal();
	}

	public isLessThan(value: NumberLike): boolean {
		return this.#value < BigNumber.make(value).bigDecimal();
	}

	public isLessThanOrEqualTo(value: NumberLike): boolean {
		return this.#value <= BigNumber.make(value).bigDecimal();
	}

	public denominated(decimals?: number): BigNumber {
		decimals ??= this.#decimals;

		return this.#fromBigDecimal(this.#value, decimals).divide(BigNumber.powerOfTen(decimals ?? 0));
	}

	public toSatoshi(decimals?: number): BigNumber {
		decimals ??= this.#decimals;

		return this.#fromBigDecimal(this.#value, decimals).times(BigNumber.powerOfTen(decimals ?? 0));
	}

	public toHuman(decimals?: number): number {
		return +this.denominated(decimals).toString();
	}

	public toNumber(): number {
		return Number(this.toString());
	}

	public valueOf(): string {
		return this.toString();
	}

	public toFixed(decimalDigits?: number): string {
		decimalDigits ??= 0;

		let { integers, decimals } = this.#split();

		if (integers === "") {
			integers = "0";
		}

		if (decimalDigits > this.#bigIntDecimals) {
			return this.#removeTrailingDot(
				integers + "." + decimals + "0".repeat(decimalDigits - this.#bigIntDecimals)
			);
		}

		return this.#removeTrailingDot(integers + "." + decimals.slice(0, decimalDigits));
	}

	public toString(): string {
		const { integers, decimals } = this.#split();

		return this.#removeTrailingDot([integers, decimals.replace(/\.?0+$/, "")].join("."));
	}

	#shift(): bigint {
		return BigInt("1" + "0".repeat(this.#bigIntDecimals));
	}

	#split(): { integers: string; decimals: string } {
		const valueAsString = String(this.#value).padStart(this.#bigIntDecimals + 1, "0");

		const integers = valueAsString.slice(0, -this.#bigIntDecimals);
		let decimals = valueAsString.slice(-this.#bigIntDecimals);

		if (this.#decimals !== undefined) {
			decimals = decimals.slice(0, this.#decimals);
		}

		return { decimals, integers };
	}

	#removeTrailingDot(value: string): string {
		return value.replace(/\.$/, "");
	}
}

export { BigNumber, NumberLike };
