import { assert, test } from "@payvo/sdk-test";

import { createValue } from "./transaction.factory";

test("createValue", () => {
	const result = createValue("2");

	assert.is(result.coin().to_str(), "2");
});

test.run();
