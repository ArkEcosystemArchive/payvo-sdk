import { Arr } from "./arr.js";

test("#randomElement", () => {
    const data = [...Array(1000).keys()];

    assert.is(Arr.randomElement(data)).not, Arr.randomElement(data));
});
