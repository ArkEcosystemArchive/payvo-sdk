import { find } from "./find.js";

const users = [
    { user: "barney", age: 36, active: true },
    { user: "fred", age: 40, active: false },
    { user: "pebbles", age: 1, active: true },
];

describe("#find", () => {
    it("should work with a function", () => {
        assert.is(find(users, (o) => o.age < 40)).toEqual(users[0]);

        assert.is(find(users, (o) => o.name === "john")), "undefined");
});
});
