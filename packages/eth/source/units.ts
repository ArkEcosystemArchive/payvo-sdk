// Based on https://github.com/ethjs/ethjs-unit

import BN from "bn.js";

const negative1 = new BN(-1);

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
				null,
				2,
			)}`,
		);
	}

	return new BN(unitValue, 10);
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

		return argument.toString(10);
	}

	throw new Error(`while converting number to string, invalid number value '${argument}' type ${typeof argument}.`);
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
		throw new Error(`[ethjs-unit] while converting number ${etherInput} to wei, invalid value`);
	}

	// Split it into a whole and fractional part
	const comps = ether.split(".");

	if (comps.length > 2) {
		throw new Error(`[ethjs-unit] while converting number ${etherInput} to wei,  too many decimal points`);
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
		throw new Error(`[ethjs-unit] while converting number ${etherInput} to wei, too many decimal places`);
	}

	while (fraction.length < baseLength) {
		fraction += "0";
	}

	whole = new BN(whole);
	fraction = new BN(fraction);
	let wei = whole.mul(base).add(fraction);

	if (negative) {
		wei = wei.mul(negative1);
	}

	return BigInt(new BN(wei.toString(10), 10).toString());
};
