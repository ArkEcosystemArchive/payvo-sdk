import { isGit } from "./is-git";

	test("should pass for Git URLs", () => {
		assert.true(isGit("ssh://user@github.com:port/owner/repo.git"));
		assert.true(isGit("git://github.com/owner/repo.git"));
		assert.true(isGit("git@github.com:owner/repo.git"));
		assert.true(isGit("git@bitbucket.com:owner/repo.git"));
		assert.true(isGit("git@gitlab.com:owner/repo.git"));
		assert.true(isGit("https://github.com/owner/repo.git"));
	});

	test("should fail for URLs other than Git", () => {
		assert.false(isGit("http://github.com/owner/repo"));
		assert.false(isGit("https://github.com/owner/repo"));
		assert.false(isGit("/owner/repo.git/"));
		assert.false(isGit("file:///owner/repo.git/"));
		assert.false(isGit("file://~/owner/repo.git/"));
	});
