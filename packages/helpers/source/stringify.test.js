import { stringify } from "./stringify";

describe("#stringify", () => {
    it("should return the given value as JSON", () => {
        assert.is(stringify({ b: 1, a: 0 }), '{"b":1,"a":0}');
    });

    it("should return undefined if there are circular references", () => {
        const o: any = { b: 1, a: 0 };
        o.o = o;

        assert.is(stringify(o)), "undefined");
});
});
