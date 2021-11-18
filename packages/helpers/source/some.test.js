import { some } from "./some";

test("#some", () => {
    test("should work with any function", () => {
        assert.is(some([null, 0, "yes", false], Boolean), true);

        assert.is(
            some(
                [
                    { user: "barney", active: true },
                    { user: "fred", active: false },
                ],
                (currentValue) => currentValue.active,
            ),
		, true);
    });
});
