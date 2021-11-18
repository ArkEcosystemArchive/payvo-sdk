import { semver } from "./semver.js";

describe("#semver", () => {
	describe("#isEqual", () => {
		it("should return true", () => {
			assert.is(semver.isEqual("0.0.0", "0.0.0"), true);
			assert.is(semver.isEqual("1.2.3", "1.2.3"), true);

			assert.is(semver.isEqual("0.0", "0.0"), true);
			assert.is(semver.isEqual("1.2", "1.2"), true);

			assert.is(semver.isEqual("0", "0"), true);
			assert.is(semver.isEqual("1", "1"), true);
		});

		it("should return false", () => {
			assert.is(semver.isEqual("0.0.0", "0.0.1"), false);
			assert.is(semver.isEqual("1.2.3", "1.2.4"), false);

			assert.is(semver.isEqual("0.1", "0.0"), false);
			assert.is(semver.isEqual("1.2", "1.3"), false);

			assert.is(semver.isEqual("0", "1"), false);
			assert.is(semver.isEqual("1", "2"), false);
		});
	});

	describe("#isGreaterThan", () => {
		it("should return true", () => {
			assert.is(semver.isGreaterThan("2.1.0", "1.9.0"), true);
			assert.is(semver.isGreaterThan("1.9.1", "1.9.0"), true);
			assert.is(semver.isGreaterThan("10.0.0", "1.0.0"), true);
			assert.is(semver.isGreaterThan("10.0.0", "8.9.0"), true);
			assert.is(semver.isGreaterThan("1.2.3-next.10", "1.2.3-next.6"), true);
			assert.is(semver.isGreaterThan("2.0.0-alpha-10", "2.0.0-alpha-6"), true);
			assert.is(semver.isGreaterThan("2.0.0-beta.1", "2.0.0-alpha.8"), true);
		});

		it("should return false", () => {
			assert.is(semver.isGreaterThan("1.9.0", "2.1.0"), false);
			assert.is(semver.isGreaterThan("1.9.0", "1.9.1"), false);
			assert.is(semver.isGreaterThan("1.0.0", "10.0.0"), false);
			assert.is(semver.isGreaterThan("8.9.0", "10.0.0"), false);
			assert.is(semver.isGreaterThan("1.2.3-next.6", "1.2.3-next.10"), false);
			assert.is(semver.isGreaterThan("2.0.0-alpha-6", "2.0.0-alpha-10"), false);
			assert.is(semver.isGreaterThan("2.0.0-alpha.8", "2.0.0-beta.1"), false);
		});
	});

	describe("#isGreaterThanOrEqual", () => {
		it("should return true", () => {
			assert.is(semver.isGreaterThanOrEqual("0.0.0", "0.0.0"), true);
			assert.is(semver.isGreaterThanOrEqual("1.2.3", "1.2.3"), true);
			assert.is(semver.isGreaterThanOrEqual("2.1.0", "1.9.0"), true);
			assert.is(semver.isGreaterThanOrEqual("1.9.1", "1.9.0"), true);
			assert.is(semver.isGreaterThanOrEqual("10.0.0", "1.0.0"), true);
			assert.is(semver.isGreaterThanOrEqual("10.0.0", "8.9.0"), true);
			assert.is(semver.isGreaterThanOrEqual("1.2.3-next.10", "1.2.3-next.6"), true);
			assert.is(semver.isGreaterThanOrEqual("2.0.0-alpha-10", "2.0.0-alpha-6"), true);
			assert.is(semver.isGreaterThanOrEqual("2.0.0-beta.1", "2.0.0-alpha.8"), true);
		});

		it("should return false", () => {
			assert.is(semver.isGreaterThanOrEqual("1.9.0", "2.1.0"), false);
			assert.is(semver.isGreaterThanOrEqual("1.9.0", "1.9.1"), false);
			assert.is(semver.isGreaterThanOrEqual("1.0.0", "10.0.0"), false);
			assert.is(semver.isGreaterThanOrEqual("8.9.0", "10.0.0"), false);
			assert.is(semver.isGreaterThanOrEqual("1.2.3-next.6", "1.2.3-next.10"), false);
			assert.is(semver.isGreaterThanOrEqual("2.0.0-alpha-6", "2.0.0-alpha-10"), false);
			assert.is(semver.isGreaterThanOrEqual("2.0.0-alpha.8", "2.0.0-beta.1"), false);
		});
	});

	describe("#isLessThan", () => {
		it("should return true", () => {
			assert.is(semver.isLessThan("1.9.0", "2.1.0"), true);
			assert.is(semver.isLessThan("1.9.0", "1.9.1"), true);
			assert.is(semver.isLessThan("1.0.0", "10.0.0"), true);
			assert.is(semver.isLessThan("8.9.0", "10.0.0"), true);
			assert.is(semver.isLessThan("1.2.3-next.6", "1.2.3-next.10"), true);
			assert.is(semver.isLessThan("2.0.0-alpha-6", "2.0.0-alpha-10"), true);
			assert.is(semver.isLessThan("2.0.0-alpha.8", "2.0.0-beta.1"), true);
		});

		it("should return false", () => {
			assert.is(semver.isLessThan("2.1.0", "1.9.0"), false);
			assert.is(semver.isLessThan("1.9.1", "1.9.0"), false);
			assert.is(semver.isLessThan("10.0.0", "1.0.0"), false);
			assert.is(semver.isLessThan("10.0.0", "8.9.0"), false);
			assert.is(semver.isLessThan("1.2.3-next.10", "1.2.3-next.6"), false);
			assert.is(semver.isLessThan("2.0.0-alpha-10", "2.0.0-alpha-6"), false);
			assert.is(semver.isLessThan("2.0.0-beta.1", "2.0.0-alpha.8"), false);
		});
	});

	describe("#isLessThanOrEqual", () => {
		it("should return true", () => {
			assert.is(semver.isLessThanOrEqual("0.0.0", "0.0.0"), true);
			assert.is(semver.isLessThanOrEqual("1.2.3", "1.2.3"), true);
			assert.is(semver.isLessThanOrEqual("1.9.0", "2.1.0"), true);
			assert.is(semver.isLessThanOrEqual("1.9.0", "1.9.1"), true);
			assert.is(semver.isLessThanOrEqual("1.0.0", "10.0.0"), true);
			assert.is(semver.isLessThanOrEqual("8.9.0", "10.0.0"), true);
			assert.is(semver.isLessThanOrEqual("1.2.3-next.6", "1.2.3-next.10"), true);
			assert.is(semver.isLessThanOrEqual("2.0.0-alpha-6", "2.0.0-alpha-10"), true);
			assert.is(semver.isLessThanOrEqual("2.0.0-alpha.8", "2.0.0-beta.1"), true);
		});

		it("should return false", () => {
			assert.is(semver.isLessThanOrEqual("2.1.0", "1.9.0"), false);
			assert.is(semver.isLessThanOrEqual("1.9.1", "1.9.0"), false);
			assert.is(semver.isLessThanOrEqual("10.0.0", "1.0.0"), false);
			assert.is(semver.isLessThanOrEqual("10.0.0", "8.9.0"), false);
			assert.is(semver.isLessThanOrEqual("1.2.3-next.10", "1.2.3-next.6"), false);
			assert.is(semver.isLessThanOrEqual("2.0.0-alpha-10", "2.0.0-alpha-6"), false);
			assert.is(semver.isLessThanOrEqual("2.0.0-beta.1", "2.0.0-alpha.8"), false);
		});
	});
});
