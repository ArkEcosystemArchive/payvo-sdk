import { keysIn } from "./keys-in.js";

describe("#keysIn", () => {
	it("should work with an object", () => {
		function Foo() {
			// @ts-ignore
			this.a = 1;
			// @ts-ignore
			this.b = 2;
		}

		Foo.prototype.c = 3;

		assert.is(keysIn(new Foo())).toIncludeAllMembers(["a", "b", "c"]);
	});
});
