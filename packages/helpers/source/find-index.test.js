import { findIndex } from "./find-index";

describe("#findIndex", () => {
    test("should work with a function", () => {
        assert.is(
            findIndex(
                [
                    { user: "barney", active: false },
                    { user: "fred", active: false },
                    { user: "pebbles", active: true },
                ],
                (o) => o.user === "fred",
            ),
		, 1);

        assert.is(
            findIndex(
                [
                    { user: "barney", active: false },
                    { user: "fred", active: false },
                    { user: "pebbles", active: true },
                ],
                (o) => o.active,
            ),
		, 2);

        assert.is(
            findIndex(
                [
                    { user: "barney", active: false },
                    { user: "fred", active: false },
                    { user: "pebbles", active: true },
                ],
                (o) => o.user === "john",
            ),
		, -1);
    });
});
