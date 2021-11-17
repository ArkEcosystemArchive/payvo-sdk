import "jest-extended";

import { Base58Check } from "./base58-check.js";

test("#encode", () => {
	expect(Base58Check.encode("Hello")).toBeString();
	expect(Base58Check.encode(Buffer.from("Hello"))).toBeString();
});

test("#decode", () => {
	expect(Base58Check.decode(Base58Check.encode("Hello")).toString("utf8")).toBe("Hello");
});
