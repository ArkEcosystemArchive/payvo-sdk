import { Avatar } from "./avatar.js";

test("Helpers.Avatar", () => {
	assert.is(Avatar.make("Hello World")).toMatchSnapshot();
});
