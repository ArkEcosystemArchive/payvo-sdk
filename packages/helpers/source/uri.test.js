import { readFileSync } from "fs";

import { URI } from "./uri";

let subject: URI;

test.before.each(async () => (subject = new URI()));

describe("URI", () => {
	test("should serialize", () => {
		const result = subject.serialize({
			method: "transfer",
			coin: "ark",
			network: "ark.mainnet",
			recipient: "DNjuJEDQkhrJ7cA9FZ2iVXt5anYiM8Jtc9",
			amount: 1.2,
			memo: "ARK",
		});

		assert
			.is(result)
			.toEqual(
				"payvo:transfer?coin=ark&network=ark.mainnet&recipient=DNjuJEDQkhrJ7cA9FZ2iVXt5anYiM8Jtc9&amount=1.2&memo=ARK",
			);
	});

	// @ts-ignore
	it.each(JSON.parse(readFileSync("./test/uri.json")))("should deserialize (%s)", (input, output) => {
		assert.is(subject.deserialize(input), output);
	});

	test("should fail to deserialize with an invalid protocol", () => {
		assert
			.is(() => subject.deserialize("mailto:DNjuJEDQkhrJ7cA9FZ2iVXt5anYiM8Jtc9"))
			.toThrowError("The given data is malformed.");
	});

	test("should fail to deserialize with invalid data", () => {
		assert
			.is(() =>
				subject.deserialize(
					"payvo:transfer?coin=ark&network=ark.mainnet&recipient=DNjuJEDQkhrJ7cA9FZ2iVXt5anYiM8Jtc9&amount=ARK&memo=ARK",
				),
			)
			.toThrowError('The given data is malformed: ValidationError: "amount" must be a number');
	});

	test("should fail to deserialize with an invalid method", () => {
		assert
			.is(() =>
				subject.deserialize(
					"payvo:unknown?coin=ark&network=ark.mainnet&recipient=DNjuJEDQkhrJ7cA9FZ2iVXt5anYiM8Jtc9&amount=ARK&memo=ARK",
				),
			)
			.toThrowError("The given method is unknown: unknown");
	});
});
