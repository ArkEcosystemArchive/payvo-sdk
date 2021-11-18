import { binary } from "./binary";

describe("#binary", () => {
    test("should encode the given string", () => {
        assert.is(binary.encode("Hello World"),
            "1001000 1100101 1101100 1101100 1101111 100000 1010111 1101111 1110010 1101100 1100100",
        );
    });

    test("should decode the given string", () => {
        assert.is(
            binary.decode("1001000 1100101 1101100 1101100 1101111 100000 1010111 1101111 1110010 1101100 1100100"),
		, "Hello World");
    });
});
