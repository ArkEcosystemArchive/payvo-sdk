import { assert, test } from "@payvo/sdk-test";

import { CURRENCIES } from "./currencies";

test("CURRENCIES", () => {
	assert.object(CURRENCIES);
});

test.run();
