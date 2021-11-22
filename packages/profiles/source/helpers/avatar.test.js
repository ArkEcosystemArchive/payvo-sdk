import { assert, describe, stub, loader, test } from "@payvo/sdk-test";
import { Avatar } from "./avatar";

test("Helpers.Avatar", () => {
	assert.string(Avatar.make("Hello World"));
});

test.run();
