import { protocols } from "./protocols.js";

describe("#protocols", () => {
	it("should return all protocols of the given URL", () => {
		assert.is(protocols("git+ssh://git@host.com/owner/repo")).toEqual(["git", "ssh"]);
		assert.is(protocols("http://google.com/")).toEqual(["http"]);
		assert.is(protocols("https://google.com/")).toEqual(["https"]);
	});
});
