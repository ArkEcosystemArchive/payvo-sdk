import { describe } from "@payvo/sdk-test";

import { URI } from "./uri";

describe("URI", async ({ assert, beforeEach, each, it }) => {
	beforeEach(async (context) => (context.subject = new URI()));

	it("should serialize", (context) => {
		const result = context.subject.serialize({
			amount: 1.2,
			coin: "ark",
			method: "transfer",
			memo: "ARK",
			network: "ark.mainnet",
			recipient: "DNjuJEDQkhrJ7cA9FZ2iVXt5anYiM8Jtc9",
		});

		assert.is(
			result,
			"amount=1.2&coin=ark&memo=ARK&method=transfer&network=ark.mainnet&recipient=DNjuJEDQkhrJ7cA9FZ2iVXt5anYiM8Jtc9",
		);
	});

	each(
		`should deserialize (%s)`,
		({ dataset, context }) => {
			assert.equal(context.subject.deserialize(dataset[0]), dataset[1]);
		},
		[
			[
				"payvo:transfer?coin=ark&network=ark.mainnet&recipient=AePNZAAtWhLsGFLXtztGLAPnKm98VVC8tJ",
				{
					method: "transfer",
					coin: "ark",
					network: "ark.mainnet",
					recipient: "AePNZAAtWhLsGFLXtztGLAPnKm98VVC8tJ",
				},
			],
			[
				"payvo:transfer?coin=lisk&network=lisk.mainnet&recipient=8290259686148623987L",
				{
					method: "transfer",
					coin: "lisk",
					network: "lisk.mainnet",
					recipient: "8290259686148623987L",
				},
			],
			[
				"payvo:transfer?coin=ark&network=ark.mainnet&recipient=AePNZAAtWhLsGFLXtztGLAPnKm98VVC8tJ&amount=10&vendorField=999&fee=0.1&relay=1.1.1.1",
				{
					method: "transfer",
					coin: "ark",
					network: "ark.mainnet",
					recipient: "AePNZAAtWhLsGFLXtztGLAPnKm98VVC8tJ",
					amount: "10",
					vendorField: "999",
					fee: "0.1",
					relay: "1.1.1.1",
				},
			],
			[
				"payvo:vote?coin=ark&network=ark.mainnet&delegate=genesis_10&fee=0.1",
				{
					method: "vote",
					coin: "ark",
					network: "ark.mainnet",
					delegate: "genesis_10",
					fee: "0.1",
				},
			],
			[
				"payvo:sign-message?coin=ark&network=ark.mainnet&message=This%20is%20my%20message",
				{
					coin: "ark",
					method: "sign-message",
					network: "ark.mainnet",
					message: "This is my message",
				},
			],
			[
				"payvo:register-delegate?coin=ark&network=ark.mainnet&delegate=mydelegatename&fee=0.0001",
				{
					method: "register-delegate",
					coin: "ark",
					network: "ark.mainnet",
					delegate: "mydelegatename",
					fee: "0.0001",
				},
			],
		],
	);

	it("should fail to deserialize with an invalid protocol", (context) => {
		assert.throws(
			() => context.subject.deserialize("mailto:DNjuJEDQkhrJ7cA9FZ2iVXt5anYiM8Jtc9"),
			"The given data is malformed.",
		);
	});

	it("should fail to deserialize with invalid data", (context) => {
		assert.throws(
			() =>
				context.subject.deserialize(
					"payvo:transfer?coin=ark&network=ark.mainnet&recipient=DNjuJEDQkhrJ7cA9FZ2iVXt5anYiM8Jtc9&amount=ARK&memo=ARK",
				),
			'The given data is malformed: ValidationError: "amount" must be a number',
		);
	});

	it("should fail to deserialize with an invalid method", (context) => {
		assert.throws(
			() =>
				context.subject.deserialize(
					"payvo:unknown?coin=ark&network=ark.mainnet&recipient=DNjuJEDQkhrJ7cA9FZ2iVXt5anYiM8Jtc9&amount=ARK&memo=ARK",
				),
			"The given method is unknown: unknown",
		);
	});
});
