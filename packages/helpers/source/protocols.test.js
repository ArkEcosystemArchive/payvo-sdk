import { protocols } from "./protocols";

	test("should return all protocols of the given URL", () => {
		assert.equal(protocols("git+ssh://git@host.com/owner/repo"), ["git", "ssh"]);
		assert.equal(protocols("http://google.com/"), ["http"]);
		assert.equal(protocols("https://google.com/"), ["https"]);
	});
