import { semver } from "./semver";

test("#semver", () => {
	test("#isEqual", () => {
		test("should return true", () => {
			assert.true(semver.isEqual("0.0.0", "0.0.0"));
			assert.true(semver.isEqual("1.2.3", "1.2.3"));

			assert.true(semver.isEqual("0.0", "0.0"));
			assert.true(semver.isEqual("1.2", "1.2"));

			assert.true(semver.isEqual("0", "0"));
			assert.true(semver.isEqual("1", "1"));
		});

		test("should return false", () => {
			assert.false(semver.isEqual("0.0.0", "0.0.1"));
			assert.false(semver.isEqual("1.2.3", "1.2.4"));

			assert.false(semver.isEqual("0.1", "0.0"));
			assert.false(semver.isEqual("1.2", "1.3"));

			assert.false(semver.isEqual("0", "1"));
			assert.false(semver.isEqual("1", "2"));
		});
	});

	test("#isGreaterThan", () => {
		test("should return true", () => {
			assert.true(semver.isGreaterThan("2.1.0", "1.9.0"));
			assert.true(semver.isGreaterThan("1.9.1", "1.9.0"));
			assert.true(semver.isGreaterThan("10.0.0", "1.0.0"));
			assert.true(semver.isGreaterThan("10.0.0", "8.9.0"));
			assert.true(semver.isGreaterThan("1.2.3-next.10", "1.2.3-next.6"));
			assert.true(semver.isGreaterThan("2.0.0-alpha-10", "2.0.0-alpha-6"));
			assert.true(semver.isGreaterThan("2.0.0-beta.1", "2.0.0-alpha.8"));
		});

		test("should return false", () => {
			assert.false(semver.isGreaterThan("1.9.0", "2.1.0"));
			assert.false(semver.isGreaterThan("1.9.0", "1.9.1"));
			assert.false(semver.isGreaterThan("1.0.0", "10.0.0"));
			assert.false(semver.isGreaterThan("8.9.0", "10.0.0"));
			assert.false(semver.isGreaterThan("1.2.3-next.6", "1.2.3-next.10"));
			assert.false(semver.isGreaterThan("2.0.0-alpha-6", "2.0.0-alpha-10"));
			assert.false(semver.isGreaterThan("2.0.0-alpha.8", "2.0.0-beta.1"));
		});
	});

	test("#isGreaterThanOrEqual", () => {
		test("should return true", () => {
			assert.true(semver.isGreaterThanOrEqual("0.0.0", "0.0.0"));
			assert.true(semver.isGreaterThanOrEqual("1.2.3", "1.2.3"));
			assert.true(semver.isGreaterThanOrEqual("2.1.0", "1.9.0"));
			assert.true(semver.isGreaterThanOrEqual("1.9.1", "1.9.0"));
			assert.true(semver.isGreaterThanOrEqual("10.0.0", "1.0.0"));
			assert.true(semver.isGreaterThanOrEqual("10.0.0", "8.9.0"));
			assert.true(semver.isGreaterThanOrEqual("1.2.3-next.10", "1.2.3-next.6"));
			assert.true(semver.isGreaterThanOrEqual("2.0.0-alpha-10", "2.0.0-alpha-6"));
			assert.true(semver.isGreaterThanOrEqual("2.0.0-beta.1", "2.0.0-alpha.8"));
		});

		test("should return false", () => {
			assert.false(semver.isGreaterThanOrEqual("1.9.0", "2.1.0"));
			assert.false(semver.isGreaterThanOrEqual("1.9.0", "1.9.1"));
			assert.false(semver.isGreaterThanOrEqual("1.0.0", "10.0.0"));
			assert.false(semver.isGreaterThanOrEqual("8.9.0", "10.0.0"));
			assert.false(semver.isGreaterThanOrEqual("1.2.3-next.6", "1.2.3-next.10"));
			assert.false(semver.isGreaterThanOrEqual("2.0.0-alpha-6", "2.0.0-alpha-10"));
			assert.false(semver.isGreaterThanOrEqual("2.0.0-alpha.8", "2.0.0-beta.1"));
		});
	});

	test("#isLessThan", () => {
		test("should return true", () => {
			assert.true(semver.isLessThan("1.9.0", "2.1.0"));
			assert.true(semver.isLessThan("1.9.0", "1.9.1"));
			assert.true(semver.isLessThan("1.0.0", "10.0.0"));
			assert.true(semver.isLessThan("8.9.0", "10.0.0"));
			assert.true(semver.isLessThan("1.2.3-next.6", "1.2.3-next.10"));
			assert.true(semver.isLessThan("2.0.0-alpha-6", "2.0.0-alpha-10"));
			assert.true(semver.isLessThan("2.0.0-alpha.8", "2.0.0-beta.1"));
		});

		test("should return false", () => {
			assert.false(semver.isLessThan("2.1.0", "1.9.0"));
			assert.false(semver.isLessThan("1.9.1", "1.9.0"));
			assert.false(semver.isLessThan("10.0.0", "1.0.0"));
			assert.false(semver.isLessThan("10.0.0", "8.9.0"));
			assert.false(semver.isLessThan("1.2.3-next.10", "1.2.3-next.6"));
			assert.false(semver.isLessThan("2.0.0-alpha-10", "2.0.0-alpha-6"));
			assert.false(semver.isLessThan("2.0.0-beta.1", "2.0.0-alpha.8"));
		});
	});

	test("#isLessThanOrEqual", () => {
		test("should return true", () => {
			assert.true(semver.isLessThanOrEqual("0.0.0", "0.0.0"));
			assert.true(semver.isLessThanOrEqual("1.2.3", "1.2.3"));
			assert.true(semver.isLessThanOrEqual("1.9.0", "2.1.0"));
			assert.true(semver.isLessThanOrEqual("1.9.0", "1.9.1"));
			assert.true(semver.isLessThanOrEqual("1.0.0", "10.0.0"));
			assert.true(semver.isLessThanOrEqual("8.9.0", "10.0.0"));
			assert.true(semver.isLessThanOrEqual("1.2.3-next.6", "1.2.3-next.10"));
			assert.true(semver.isLessThanOrEqual("2.0.0-alpha-6", "2.0.0-alpha-10"));
			assert.true(semver.isLessThanOrEqual("2.0.0-alpha.8", "2.0.0-beta.1"));
		});

		test("should return false", () => {
			assert.false(semver.isLessThanOrEqual("2.1.0", "1.9.0"));
			assert.false(semver.isLessThanOrEqual("1.9.1", "1.9.0"));
			assert.false(semver.isLessThanOrEqual("10.0.0", "1.0.0"));
			assert.false(semver.isLessThanOrEqual("10.0.0", "8.9.0"));
			assert.false(semver.isLessThanOrEqual("1.2.3-next.10", "1.2.3-next.6"));
			assert.false(semver.isLessThanOrEqual("2.0.0-alpha-10", "2.0.0-alpha-6"));
			assert.false(semver.isLessThanOrEqual("2.0.0-beta.1", "2.0.0-alpha.8"));
		});
	});
