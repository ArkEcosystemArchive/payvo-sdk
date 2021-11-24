import { describe } from "@payvo/sdk-test";

import { keysIn } from "./keys-in";

describe("includeAllMembers", async ({ assert, it }) => {
	it("should work with an object", () => {
		function Foo() {
			this.a = 1;

			this.b = 2;
		}

		Foo.prototype.c = 3;

		assert.includeAllMembers(keysIn(new Foo()), ["a", "b", "c"]);
	});
});
