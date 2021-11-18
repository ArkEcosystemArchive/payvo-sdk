import { isSSH } from "./is-ssh";

test("#isSSH", () => {
	test("should pass for SSH URLs", () => {
		assert.is(isSSH("ssh://user@github.com:port/owner/repo.git"), true);
		assert.is(isSSH("user@github.com:/owner/repo.git"), true);
		assert.is(isSSH("user@github.com:~user/owner/repo.git"), true);
		assert.is(isSSH("user@github.com:owner/repo.git"), true);
		assert.is(isSSH("rsync://github.com/owner/repo.git"), true);
		assert.is(isSSH("git://github.com/owner/repo.git"), true);
	});

	test("should fail for URLs other than SSH", () => {
		assert.is(isSSH("ssh://user@github.com:port/owner/repo.git"), true);
		assert.is(isSSH("user@github.com:/owner/repo.git"), true);
		assert.is(isSSH("user@github.com:~user/owner/repo.git"), true);
		assert.is(isSSH("user@github.com:owner/repo.git"), true);
		assert.is(isSSH("rsync://github.com/owner/repo.git"), true);
		assert.is(isSSH("git://github.com/owner/repo.git"), true);
		assert.is(isSSH("http://github.com/owner/repo.git"), false);
		assert.is(isSSH("https://github.com/owner/repo.git"), false);
		assert.is(isSSH("/owner/repo.git/"), false);
		assert.is(isSSH("file:///owner/repo.git/"), false);
		assert.is(isSSH("file://~/owner/repo.git/"), false);
	});
});
