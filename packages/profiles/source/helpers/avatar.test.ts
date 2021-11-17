import "jest-extended";

import { Avatar } from "./avatar.js";

test("Helpers.Avatar", () => {
    expect(Avatar.make("Hello World")).toMatchSnapshot();
});
