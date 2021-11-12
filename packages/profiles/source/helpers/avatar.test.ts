import "jest-extended";

import { Avatar } from "./avatar";

test("Helpers.Avatar", () => {
	expect(Avatar.make("Hello World")).toMatchSnapshot();
});
