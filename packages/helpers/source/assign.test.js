import { describe } from "@payvo/sdk-test";

import { assign } from "./assign";

function Foo() {
	this.a = 1;
}

function Bar() {
	this.c = 3;
}

Foo.prototype.b = 2;
Bar.prototype.d = 4;

describe("assign", async ({ assert, it }) => {
	it("should return the names of the users", () => {
		assert.equal(assign({ a: 0 }, new Foo(), new Bar()), { a: 1, c: 3 });
	});
});
