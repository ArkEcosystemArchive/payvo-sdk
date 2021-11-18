import { assert, test } from "@payvo/sdk-test";

import { URI } from "./uri";
import { fixtures } from "../test/uri";

let subject;

test.before.each(async () => (subject = new URI()));

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
		.is(result,
			"payvo:transfer?coin=ark&network=ark.mainnet&recipient=DNjuJEDQkhrJ7cA9FZ2iVXt5anYiM8Jtc9&amount=1.2&memo=ARK",
		);
});

for (const fixture of fixtures) {
	test("should deserialize", () => {
		assert.is(subject.deserialize(fixture[0]), fixture[1]);
	});
}

test("should fail to deserialize with an invalid protocol", () => {
	assert
		.throws(() => subject.deserialize("mailto:DNjuJEDQkhrJ7cA9FZ2iVXt5anYiM8Jtc9"), "The given data is malformed.");
});

test("should fail to deserialize with invalid data", () => {
	assert
		.throws(() =>
			subject.deserialize(
				"payvo:transfer?coin=ark&network=ark.mainnet&recipient=DNjuJEDQkhrJ7cA9FZ2iVXt5anYiM8Jtc9&amount=ARK&memo=ARK",
			), 'The given data is malformed: ValidationError: "amount" must be a number');
});

test("should fail to deserialize with an invalid method", () => {
	assert
		.throws(() =>
			subject.deserialize(
				"payvo:unknown?coin=ark&network=ark.mainnet&recipient=DNjuJEDQkhrJ7cA9FZ2iVXt5anYiM8Jtc9&amount=ARK&memo=ARK",
			), "The given method is unknown: unknown");
});

test.run();
