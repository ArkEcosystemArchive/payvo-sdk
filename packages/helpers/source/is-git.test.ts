import { isGit } from "./is-git.js";

describe("#isGit", () => {
	it("should pass for Git URLs", () => {
		assert.is(isGit("ssh://user@github.com:port/owner/repo.git"), true);
		assert.is(isGit("git://github.com/owner/repo.git"), true);
		assert.is(isGit("git@github.com:owner/repo.git"), true);
		assert.is(isGit("git@bitbucket.com:owner/repo.git"), true);
		assert.is(isGit("git@gitlab.com:owner/repo.git"), true);
		assert.is(isGit("https://github.com/owner/repo.git"), true);
	});

	it("should fail for URLs other than Git", () => {
		assert.is(isGit("http://github.com/owner/repo"), false);
		assert.is(isGit("https://github.com/owner/repo"), false);
		assert.is(isGit("/owner/repo.git/"), false);
		assert.is(isGit("file:///owner/repo.git/"), false);
		assert.is(isGit("file://~/owner/repo.git/"), false);
	});
});
