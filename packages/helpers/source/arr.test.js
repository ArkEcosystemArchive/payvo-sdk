import { assert, test } from "@payvo/sdk-test";

import { Arr } from "./arr";

test("#randomElement", () => {
    const data = [...Array(1000).keys()];

    assert.is.not(Arr.randomElement(data), Arr.randomElement(data));
});
