import { some } from "./some";

    test("should work with any function", () => {
        assert.true(some([null, 0, "yes", false], Boolean));

        assert.true(
            some(
                [
                    { user: "barney", active: true },
                    { user: "fred", active: false },
                ],
                (currentValue) => currentValue.active,
            ),
		);
    });
