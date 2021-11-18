import { isGit } from "./is-git";

describe("#isGit", () => {
	test("should pass for Git URLs", () => {
		assert.is(isGtest("ssh://user@github.com:port/owner/repo.git"), true);
		assert.is(isGtest("git://github.com/owner/repo.git"), true);
		assert.is(isGtest("git@github.com:owner/repo.git"), true);
		assert.is(isGtest("git@bitbucket.com:owner/repo.git"), true);
		assert.is(isGtest("git@gitlab.com:owner/repo.git"), true);
		assert.is(isGtest("https://github.com/owner/repo.git"), true);
	});

	test("should fail for URLs other than Git", () => {
		assert.is(isGtest("http://github.com/owner/repo"), false);
		assert.is(isGtest("https://github.com/owner/repo"), false);
		assert.is(isGtest("/owner/repo.git/"), false);
		assert.is(isGtest("file:///owner/repo.git/"), false);
		assert.is(isGtest("file://~/owner/repo.git/"), false);
	});
});
