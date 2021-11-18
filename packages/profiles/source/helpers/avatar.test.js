import { Avatar } from "./avatar";

test("Helpers.Avatar", () => {
	assert.is(Avatar.make("Hello World")).toMatchSnapshot();
});
