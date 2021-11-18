import { sleep } from "./sleep";

	test("should sleep for 1 second", async () => {
		const start = +new Date();

		await sleep(1000);

		const end = +new Date();

		assert.is(Math.round((end - start) / 1000), 1);
	});
