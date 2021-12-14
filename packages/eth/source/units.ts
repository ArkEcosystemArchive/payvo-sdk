// Based on https://github.com/ethjs/ethjs-unit

const negative1 = BigInt(-1);

const unitMap = {
	Gwei: "1000000000",
	Kwei: "1000",
	Mwei: "1000000",
	babbage: "1000",
	ether: "1000000000000000000",
	femtoether: "1000",
	finney: "1000000000000000",
	gether: "1000000000000000000000000000",
	grand: "1000000000000000000000",
	gwei: "1000000000",
	kether: "1000000000000000000000",
	kwei: "1000",
	lovelace: "1000000",
	mether: "1000000000000000000000000",
	micro: "1000000000000",
	microether: "1000000000000",
	milli: "1000000000000000",
	milliether: "1000000000000000",
	mwei: "1000000",
	nano: "1000000000",
	nanoether: "1000000000",
	noether: "0",
	picoether: "1000000",
	shannon: "1000000000",
	szabo: "1000000000000",
	tether: "1000000000000000000000000000000",
	wei: "1",
};

const getValueOfUnit = (unitInput) => {
	const unit = unitInput ? unitInput.toLowerCase() : "ether";
	const unitValue = unitMap[unit];

	if (typeof unitValue !== "string") {
		throw new TypeError(
			`[ethjs-unit] the unit provided ${unitInput} doesn't exists, please use the one of the following units ${JSON.stringify(
				unitMap,
				undefined,
				2,
			)}`,
		);
	}

	return BigInt(unitValue);
};

const numberToString = (argument) => {
	if (typeof argument === "string") {
		if (!/^-?[\d.]+$/.test(argument)) {
			throw new Error(
				`while converting number to string, invalid number value '${argument}', should be a number matching (^-?[0-9.]+).`,
			);
		}

		return argument;
	}

	if (typeof argument === "number") {
		return String(argument);
	}

	if (typeof argument === "object" && argument.toString && (argument.toTwos || argument.dividedToIntegerBy)) {
		if (argument.toPrecision) {
			return String(argument.toPrecision());
		}

		return argument;
	}

	throw new Error(`Invalid number value '${argument}' type ${typeof argument} while converting number to string`);
};

export const toWei = (etherInput, unit) => {
	let ether = numberToString(etherInput);
	const base = getValueOfUnit(unit);
	const baseLength = unitMap[unit].length - 1 || 1;

	// Is it negative?
	const negative = ether.slice(0, 1) === "-";

	if (negative) {
		ether = ether.slice(1);
	}

	if (ether === ".") {
		throw new Error(`Invalid value while converting number ${etherInput} to wei`);
	}

	// Split it into a whole and fractional part
	const comps = ether.split(".");

	if (comps.length > 2) {
		throw new Error(`Too many decimal points while converting number ${etherInput} to wei`);
	}

	let whole = comps[0],
		fraction = comps[1];

	if (!whole) {
		whole = "0";
	}

	if (!fraction) {
		fraction = "0";
	}

	if (fraction.length > baseLength) {
		throw new Error(`Too many decimal places while converting number ${etherInput} to wei`);
	}

	while (fraction.length < baseLength) {
		fraction += "0";
	}

	whole = BigInt(whole);
	fraction = BigInt(fraction);

	const wei = whole * base + fraction;

	if (negative) {
		return wei * negative1;
	}

	return wei;
};
