import { prettyTime } from "./pretty-time";

test("#prettyTime", () => {
	test("should turn the given milliseconds into a human readable format", () => {
		assert.is(prettyTime(1000000000), "11d 13h 46m 40s");
		assert.is(prettyTime(1500), "1s 500ms");
		assert.is(prettyTime(1000), "1s");
		assert.is(prettyTime(100), "100ms");
		assert.is(prettyTime(100.1001), "100ms 100µs 100ns");
	});
