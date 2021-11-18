import { protocols } from "./protocols";

test("#protocols", () => {
	test("should return all protocols of the given URL", () => {
		assert.is(protocols("git+ssh://git@host.com/owner/repo"), ["git", "ssh"]);
		assert.is(protocols("http://google.com/"), ["http"]);
		assert.is(protocols("https://google.com/"), ["https"]);
	});
