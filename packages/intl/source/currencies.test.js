import { test } from "uvu";
import * as assert from "uvu/assert";

import { CURRENCIES } from "./currencies";

test("CURRENCIES", () => {
	assert.type(CURRENCIES, "object");
});

test.run();
