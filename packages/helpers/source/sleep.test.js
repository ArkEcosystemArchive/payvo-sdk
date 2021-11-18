import { sleep } from "./sleep";

test("#sleep", () => {
	test("should sleep for 1 second", async () => {
		const start: number = +new Date();

		await sleep(1000);

		const end: number = +new Date();

		assert.is(Math.round((end - start) / 1000), 1);
	});
