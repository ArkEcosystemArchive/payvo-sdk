import { parseGitUrl } from "./parse-git-url";

test("#parseGitUrl", () => {
	test("should throw if it cannot find a host", () => {
		assert.is(() => parseGitUrl("owner/repo.git")).toThrow("Failed to find a host.");
	});

	test("should throw if it cannot find a name", () => {
		assert.is(() => parseGitUrl("git@github.com")).toThrow("Failed to find a name.");
	});

	test("should return the expected fields", () => {
		assert.is(parseGitUrl("git@github.com:owner/repo.git"), {
			host: "github.com",
			owner: "owner",
			name: "repo",
			repo: "owner/repo",
			branch: "master",
		});

		assert.is(parseGitUrl("https://github.com/owner/repo.git"), {
			host: "github.com",
			owner: "owner",
			name: "repo",
			repo: "owner/repo",
			branch: "master",
		});

		assert.is(parseGitUrl("https://github.com/owner/repo.git#develop"), {
			host: "github.com",
			owner: "owner",
			name: "repo",
			repo: "owner/repo",
			branch: "develop",
		});

		assert.is(parseGitUrl("https://github.com/owner/repo.git#f4991348ca779b68b8e7139cfcbc601e6d496612"), {
			host: "github.com",
			owner: "owner",
			name: "repo",
			repo: "owner/repo",
			branch: "f4991348ca779b68b8e7139cfcbc601e6d496612",
		});

		assert.is(parseGitUrl("https://github.com/owner/repo.git#develop#develop"), {
			host: "github.com",
			owner: "owner",
			name: "repo",
			repo: "owner/repo",
			branch: "develop",
		});
	});
