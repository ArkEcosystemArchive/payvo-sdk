import { randomNumber } from "./random-number";

test("#randomNumber", () => {
	test("should return a random number within the given range", () => {
		const actual: number = randomNumber(1, 5);

		assert.is(actual).toBeGreaterThanOrEqual(1);
		assert.is(actual).toBeLessThanOrEqual(5);
	});
