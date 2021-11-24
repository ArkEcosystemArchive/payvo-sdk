import { describe } from "@payvo/sdk-test";

import { sleep } from "./sleep";

describe("sleep", async ({ assert, it }) => {
	it("should sleep for 1 second", async () => {
		const start = +new Date();

		await sleep(1000);

		const end = +new Date();

		assert.is(Math.round((end - start) / 1000), 1);
	});
});
