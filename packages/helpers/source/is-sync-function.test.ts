import { isSyncFunction } from "./is-sync-function.js";

describe("#isSyncFunction", () => {
	it("should pass", () => {
		expect(isSyncFunction(new Function())).toBeTrue();
	});

	it("should fail", () => {
		expect(isSyncFunction(async () => ({}))).toBeFalse();
		expect(isSyncFunction([])).toBeFalse();
	});
});
