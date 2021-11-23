import { assert, describe, Mockery, test } from "@payvo/sdk-test";
import "reflect-metadata";

import nock from "nock";

import { identity } from "../test/fixtures/identity";
import { bootContainer, importByMnemonic } from "../test/mocking";
import { Profile } from "./profile";
import { ProfileRepository } from "./profile.repository";
import { ProfileImporter } from "./profile.importer";
import { ProfileSerialiser } from "./profile.serialiser";
import { container } from "./container";
import { Identifiers } from "./container.models";

test.before(() => {
	bootContainer();

	nock.disableNetConnect();
});

test.before.each(() => {
	nock.cleanAll();

	nock.fake(/.+/)
		.get("/api/node/configuration")
		.reply(200, require("../test/fixtures/client/configuration.json"))
		.get("/api/peers")
		.reply(200, require("../test/fixtures/client/peers.json"))
		.get("/api/node/configuration/crypto")
		.reply(200, require("../test/fixtures/client/cryptoConfiguration.json"))
		.get("/api/node/syncing")
		.reply(200, require("../test/fixtures/client/syncing.json"))
		.get("/api/wallets/D6i8P5N44rFto6M6RALyUXLLs7Q1A1WREW")
		.reply(200, require("../test/fixtures/client/wallet.json"))
		.persist();

	subject = new ProfileRepository();

	if (container.has(Identifiers.ProfileRepository)) {
		container.unbind(Identifiers.ProfileRepository);
	}

	container.constant(Identifiers.ProfileRepository, subject);
});

test("should restore the given profiles", async () => {
	assert.is(subject.count(), 0);

	subject.fill({
		"b999d134-7a24-481e-a95d-bc47c543bfc9": {
			id: "b999d134-7a24-481e-a95d-bc47c543bfc9",
			contacts: {
				"0e147f96-049f-4d89-bad4-ad3341109907": {
					id: "0e147f96-049f-4d89-bad4-ad3341109907",
					name: "Jane Doe",
					starred: false,
					addresses: [],
				},
			},
			data: {
				key: "value",
			},
			exchangeTransactions: {},
			notifications: {
				"b183aef3-2dba-471a-a588-0fcf8f01b645": {
					id: "b183aef3-2dba-471a-a588-0fcf8f01b645",
					icon: "warning",
					name: "Ledger Update Available",
					body: "...",
					action: "Read Changelog",
				},
			},
			plugins: {
				data: {},
			},
			settings: {
				ADVANCED_MODE: "value",
				NAME: "John Doe",
			},
			wallets: {
				"ac38fe6d-4b67-4ef1-85be-17c5f6841129": {
					id: "ac38fe6d-4b67-4ef1-85be-17c5f6841129",
					coin: "ARK",
					network: "ark.devnet",
					address: "D6i8P5N44rFto6M6RALyUXLLs7Q1A1WREW",
					publicKey: "030fde54605c5d53436217a2849d276376d0b0f12c71219cd62b0a4539e1e75acd",
					data: {
						BALANCE: {},
						SEQUENCE: {},
					},
					settings: {
						ALIAS: "Johnathan Doe",
						AVATAR: "...",
					},
				},
				"0e147f96-049f-4d89-bad4-ad3341109907": {
					id: "0e147f96-049f-4d89-bad4-ad3341109907",
					coin: "ARK",
					network: "ark.devnet",
					address: "DNjuJEDQkhrJ7cA9FZ2iVXt5anYiM8Jtc9",
					publicKey: "03bbfb43ecb5a54a1e227bb37b5812b5321213838d376e2b455b6af78442621dec",
					data: {
						BALANCE: {},
						SEQUENCE: {},
					},
					settings: {
						ALIAS: "Jane Doe",
						AVATAR: "...",
					},
				},
			},
		},
	});

	assert.is(subject.count(), 1);
});

test("should push, get, list and forget any given profiles", async () => {
	assert.is(subject.count(), 0);

	const john = subject.create("John");

	assert.is(subject.count(), 1);
	assert.instance(subject.findById(john.id()), Profile);

	const jane = subject.create("Jane");

	assert.is(subject.count(), 2);
	assert.instance(subject.findById(jane.id()), Profile);
	assert.instance(subject.findByName(jane.name()), Profile);
	assert.true(subject.has(jane.id()));

	subject.forget(jane.id());

	assert.is(subject.count(), 1);
	assert.false(subject.has(jane.id()));
	assert.throws(() => subject.findById(jane.id()), "No profile found for");
});

test("should get all profiles", async () => {
	subject.create("John");
	subject.create("Jane");

	assert.length(Object.keys(subject.all()), 2);
});

test("should get all keys", async () => {
	subject.create("John");
	subject.create("Jane");

	assert.length(subject.keys(), 2);
});

test("should get all values", async () => {
	subject.create("John");
	subject.create("Jane");

	assert.length(subject.values(), 2);
});

test("should forget all values", async () => {
	subject.create("Jane");

	assert.length(subject.values(), 1);

	subject.flush();

	assert.length(subject.values(), 0);
});

test("should get the first and last profile", async () => {
	const john = subject.create("John");
	const jane = subject.create("Jane");

	assert.is(subject.first(), john);
	assert.is(subject.last(), jane);
});

test("should fail to push a profile with a duplicate name", async () => {
	subject.create("John");

	assert.throws(() => subject.create("John"), "The profile [John] already exists.");
});

test("should fail to forget a profile that doesn't exist", async () => {
	assert.throws(() => subject.forget("doesnotexist"), "No profile found for");
});

test("should dump profiles without a password", async () => {
	const john = subject.create("John");

	await importByMnemonic(john, identity.mnemonic, "ARK", "ark.devnet");

	subject.persist(john);

	const repositoryDump = subject.toObject();

	const restoredJohn = new Profile(repositoryDump[john.id()]);
	await new ProfileImporter(restoredJohn).import();
	await restoredJohn.sync();

	assert.equal(new ProfileSerialiser(restoredJohn).toJSON(), new ProfileSerialiser(john).toJSON());
});

test("should dump profiles with a password", async () => {
	const jane = subject.create("Jane");

	await importByMnemonic(jane, identity.mnemonic, "ARK", "ark.devnet");

	jane.password().set("password");
	jane.auth().setPassword("password");

	subject.persist(jane);

	const repositoryDump = subject.toObject();

	const restoredJane = new Profile(repositoryDump[jane.id()]);
	await new ProfileImporter(restoredJane).import("password");
	await restoredJane.sync();

	assert.equal(new ProfileSerialiser(restoredJane).toJSON(), new ProfileSerialiser(jane).toJSON());
});

test("should export ok", async () => {
	const profile = subject.create("John");
	await importByMnemonic(profile, identity.mnemonic, "ARK", "ark.devnet");

	const exported = subject.export(profile, {
		excludeEmptyWallets: false,
		excludeLedgerWallets: false,
		addNetworkInformation: true,
		saveGeneralSettings: true,
	});

	assert.string(exported);
});

test("should export ok with password", async () => {
	const profile = subject.create("John");
	profile.auth().setPassword("some pass");
	await importByMnemonic(profile, identity.mnemonic, "ARK", "ark.devnet");

	const exported = subject.export(
		profile,
		{
			excludeEmptyWallets: false,
			excludeLedgerWallets: false,
			addNetworkInformation: true,
			saveGeneralSettings: true,
		},
		"some pass",
	);

	assert.string(exported);
});

test("should import ok", async () => {
	const data =
		"eyJpZCI6Ijc5YzViNWE1LTdlM2QtNDhlNC1hNjkwLWM2OTA5MzA1NDA0OSIsImNvbnRhY3RzIjp7fSwiZGF0YSI6e30sImV4Y2hhbmdlVHJhbnNhY3Rpb25zIjp7fSwibm90aWZpY2F0aW9ucyI6e30sInBlZXJzIjp7fSwicGx1Z2lucyI6e30sInNldHRpbmdzIjp7IkFDQ0VOVF9DT0xPUiI6ImdyZWVuIiwiQURWQU5DRURfTU9ERSI6ZmFsc2UsIkFVVE9NQVRJQ19TSUdOX09VVF9QRVJJT0QiOjE1LCJCSVAzOV9MT0NBTEUiOiJlbmdsaXNoIiwiREFTSEJPQVJEX1RSQU5TQUNUSU9OX0hJU1RPUlkiOmZhbHNlLCJET19OT1RfU0hPV19GRUVfV0FSTklORyI6ZmFsc2UsIkVSUk9SX1JFUE9SVElORyI6ZmFsc2UsIkVYQ0hBTkdFX0NVUlJFTkNZIjoiQlRDIiwiTE9DQUxFIjoiZW4tVVMiLCJNQVJLRVRfUFJPVklERVIiOiJjcnlwdG9jb21wYXJlIiwiTkFNRSI6IkpvaG4iLCJTQ1JFRU5TSE9UX1BST1RFQ1RJT04iOnRydWUsIlRIRU1FIjoibGlnaHQiLCJUSU1FX0ZPUk1BVCI6Img6bW0gQSIsIlVTRV9URVNUX05FVFdPUktTIjpmYWxzZX0sIndhbGxldHMiOnsiMjRjMTExNDctMGU3ZC00NmEwLWFjNzEtMjRlZGE4YzFmNGJmIjp7ImlkIjoiMjRjMTExNDctMGU3ZC00NmEwLWFjNzEtMjRlZGE4YzFmNGJmIiwiZGF0YSI6eyJDT0lOIjoiQVJLIiwiTkVUV09SSyI6ImFyay5kZXZuZXQiLCJBRERSRVNTIjoiRDYxbWZTZ2d6YnZRZ1RVZTZKaFlLSDJkb0hhcUozRHlpYiIsIlBVQkxJQ19LRVkiOiIwMzQxNTFhM2VjNDZiNTY3MGE2ODJiMGE2MzM5NGY4NjM1ODdkMWJjOTc0ODNiMWI2YzcwZWI1OGU3ZjBhZWQxOTIiLCJCQUxBTkNFIjp7ImF2YWlsYWJsZSI6IjU1ODI3MDkzNDQ0NTU2IiwiZmVlcyI6IjU1ODI3MDkzNDQ0NTU2In0sIkJST0FEQ0FTVEVEX1RSQU5TQUNUSU9OUyI6e30sIkRFUklWQVRJT05fVFlQRSI6ImJpcDM5IiwiSU1QT1JUX01FVEhPRCI6IkJJUDM5Lk1ORU1PTklDIiwiU0VRVUVOQ0UiOiIxMTE5MzIiLCJTSUdORURfVFJBTlNBQ1RJT05TIjp7fSwiVk9URVMiOltdLCJWT1RFU19BVkFJTEFCTEUiOjAsIlZPVEVTX1VTRUQiOjAsIldBSVRJTkdfRk9SX09VUl9TSUdOQVRVUkVfVFJBTlNBQ1RJT05TIjp7fSwiV0FJVElOR19GT1JfT1RIRVJfU0lHTkFUVVJFU19UUkFOU0FDVElPTlMiOnt9LCJTVEFSUkVEIjpmYWxzZX0sInNldHRpbmdzIjp7IkFWQVRBUiI6IjxzdmcgdmVyc2lvbj1cIjEuMVwiIHhtbG5zPVwiaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmdcIiBjbGFzcz1cInBpY2Fzc29cIiB3aWR0aD1cIjEwMFwiIGhlaWdodD1cIjEwMFwiIHZpZXdCb3g9XCIwIDAgMTAwIDEwMFwiPjxzdHlsZT4ucGljYXNzbyBjaXJjbGV7bWl4LWJsZW5kLW1vZGU6c29mdC1saWdodDt9PC9zdHlsZT48cmVjdCBmaWxsPVwicmdiKDIzMywgMzAsIDk5KVwiIHdpZHRoPVwiMTAwXCIgaGVpZ2h0PVwiMTAwXCIvPjxjaXJjbGUgcj1cIjUwXCIgY3g9XCI2MFwiIGN5PVwiNDBcIiBmaWxsPVwicmdiKDEzOSwgMTk1LCA3NClcIi8+PGNpcmNsZSByPVwiNDVcIiBjeD1cIjBcIiBjeT1cIjMwXCIgZmlsbD1cInJnYigwLCAxODgsIDIxMilcIi8+PGNpcmNsZSByPVwiNDBcIiBjeD1cIjkwXCIgY3k9XCI1MFwiIGZpbGw9XCJyZ2IoMjU1LCAxOTMsIDcpXCIvPjwvc3ZnPiJ9fX19";
	assert.instance(await subject.import(data), Profile);
});

test("should import ok with password", async () => {
	const data =
		"ZGU2YTQ3YjQ0NzZkMzZmODEyMzlkMjM0Mzg1Zjc1M2U6NGU3NDYzNjQ3MDRhNDczMDQ1NmQ1MzRhNGMzODRjNDE3NDRkNTk1MjczNDIzMzc0Mzc0YjYxNDQ0YTQ4NjEzOTJiMzM1MzY2MzY0MzQ1NTI3OTJmNTk2YTM4NDczNTU1Mzk1YTc1NTMzNjQ2MzEzNjY0NDE0NDc3NzM2YTcxNzA0NjUyNzc3NTRkNTA2Yjc3Njg1MjUyNzY1YTYzN2E2ODZkNjM1NTMxNjc1NzU0NGUzMjdhNDk3NTc2NjUzNDY2NGIzNDU5MzA1ODc1MzMzOTczNzQ2ODM4NmI1NTUyNmQ0MTMzNDU1MzQyNzY3MDcwMzk3YTU2MzQ2YzRmNTI2Nzc3Mzc0ZTcxNjk1NzQ1Mzc2ZTc5NGI3NTcwNmU3YTM5MzU3MjM5MzM3NjRjNzY0OTM5MmI3NTRmNTc3NjZlNTY3MjczNzU2ZTQ1NmE2OTM3NTI0ZDM2NDE3ODQ3MzQ0ZTczNGU2ZjQ4MzM0Njc1NjU2OTRjNTU3NDdhNDM2MjZhMmY1MDQzNTI2NDQxNjU2NTQ0NDI2ZjY3NjQ1NjYyNDU3MTYxNTk2NjRmNTYzMTM0NjkzMDU2NTA2OTJiMzc2MTc3NjQ2NjZlMmI0YTc4MmI2ODQ5MzAyZjY5Mzc2MjQ2MmY0ZTRhNjg2MTYyNzIzMjUxNTU1MDczNDQ2Mzc4MzU3ODRjNzAzMDYyNWE1NzMyNmI1ODMxNzk3NDM0NjM0ZTUyMzk0NjQ1NGIzMzQ4NjE0NjczNjY0YTRlNzA0NDRkNzU3OTQ4Njc2NDM3NTM2NDMwNjkyYjJiMzI1MTQ4NmUzNzcxNjUzMjRhNjQ3OTUxNGU2NzZkMzc1NjRiMzg3MDMyMzc0Zjc3NTE3OTMzNzc0ZjRhNGQzMDc2Nzc0NjYyMmY0ZTQ5NGE1OTU1Mzk0OTc4NzU3Mjc0NmE2OTU4NGQ1NDcwNTIzNzQ1NmE1NjM3NWE2YTRmNjg2OTRiNjY2ODM2Njg1YTY1NzI1MzRmNzkzMjQ1NTE2NTRmMzQ0ODY2NjE2ZjVhMzYyZjczMmI0ZTU2NDkzNjU1NzY3MDM4NDE2YTRhNmM0ZDc2NDU0MjVhNzEyZjY1NGY3NjQ0NjkzMjRjMmI3OTUxNzQzMDYxNDI2ZjY4MzQ0ZDc4NjkzMjQ0NjM0ZjMzNjk3NjY0NDc1MDZkNmY0MTRjNmQ3NTY5NzU2ZTdhNmE1NDRmNGY0YzQ3NjI1ODMxNDIzNTQ4NmQ2YjM4NzA3YTc0NTU0ODYyNDUzOTRiNzg1NTQ3NjI3NzRlNDg0MjU2MzU2OTZiNjg3NDUzMzkzMTM2NmU2ZDRhMzk0MTc0NzU0MjQ3NmMzNjUyNTc1MjM4NGE2NjQzNzA0NTM1MzczNTQxNDg0ZDYxNzI0ODM1NWE0YTRiNDE0NDZlNjY2NDRkNGQ3MTUxNmM3MjcwNGM2YzRhNjU1MjQ4Mzg3YTZiNmI1MTU2Mzc2YzU2NTU3ODVhNjM3NDJiNmQ1MjM2NTI1MDY2NGQyYjUzNTkzNDM1NmI2YTYxNzY2MjQ4NzQzNTQ3NDE2ZjU3NjU2NzM2NTE0OTQzNjMzNDc0NDI1MDRiMmY0ZDYxNDU1YTQyNmQ2MzQyNjU1NDU3NzA0NzRkNjc1NjZkNTc0Njc0NGEzOTM1NzQ0NzVhNzY2ZDVhNGQ3NDUyNWE0ZjQyNTQ2NzU3NDI3MjM0NmU1ODYzMzMzMDU4NDg3NTUxNGY1MTZlNDM2ZjRhNmEyYjcyNzY0YTc4NTI3NTRmNmM2ZDRhNGI2MzM2NDU0MzM4MzU1MTM2NjE3NDdhMzE3YTQzNmE0NzY0NzU1NjQxNDYzODU4MmI2NTJiNDUzNzM5Njg2OTQzNmEzNjU1NDI0MzUxMzY2ZTc3NzI0MTMxNjc3MDU4NTg2YjMzNTY1MTU2NzI0NjRiNzc2ODY4NTM3MzMyNDY2MTQ3NDE0ODRkMmI2NDM0NDEzNDMwNGI0MzQ0NmY0MTU4NmEyZjQ2NzM3MjY1NzE3MDUzNGQ1NTdhNmI1Njc4NmM0ODc5NzgzNzY2NTE0NTZhNTM2YTRlMzA0YTQ1NmM2MTQ2NGI2OTRhMzQyZjZlNmQ0NDc3NTI1NDRkNGI1NjQzNGQzMDMzNTk2NDQ3NTI3OTQ0MzU0ZDU3NDQ2MzMzNGIzOTZlMzI2NzU4NGY2OTRmMzUzMjU2NzY3MTZkMmY2YTJmNDg0NDMyNzM0ZDU1NGQyYjY0NTA1YTZlNDU0YjU0NzE3OTRiNDQ3MTQ4NTQ2NjZjNDUzODM4MzE0MTRhMzA3ODY0Nzg0YjMxNmQ0NDc0NGQ1MDY5NzM1NjZkNTg3MzRhMzg3ODY1NjY0MjcwNjQyYjUyNmY0NzU0NjE3OTQzN2E2YzU4Mzg2NTU3NWE2OTUyNTc0OTQzNDc3MDM3NGY1NDY0Nzg0ODM1NTU3OTQxNzI2NDUxNjk2MjZhNmQzNzZlNzA0NzQ5MzM3YTc5MzU0YzY2NzMzMDY5NTA2NzYxMzQ0YjY5NTUzMTU4NjI2OTM3NDQ2YzQ2NzM2Njc5Nzc3YTUyNGE2ZDMxNmI1YTM5NzA0ODQ0NmM1MTQxNWE3OTRlNTA3YTM4NTg1Mzc5NGY0NjZiNmI2ZTZjNjIzODU1NTk1MDQyNjY1NDMwNTY0MzQxNzc2ZjRjNDUzNDRmMzg0NTJmNTY2MzQ2NGQzNjVhNDM2YjZmMzEzMTM5NzgzNjMzNzU3MDY1NDIzMTU3NjIzOTc0NDY3MzYzNmIzNjMxNmY2NTM1NTg3YTY2NTY2NjY0NDYzODYxMzg1MDZiNGI3MDQxNDU2NzMwNjc3MDMwMzgyZjZiN2E2MjcxMmY0OTU0NzUzMzQ0NjU0NzZmNTU1NzM0NWE1ODRjNzYzNjZlNTI0ODQ4NGI0ZDU1NzU1MjZiMzc2ZDUyNDg2ODQ5NTE2ODQ1Mzc1NjQ4NzE1MDQ3NzgzOTM5NmE1YTQ5NWE1MzMxNGI1NTY0NjQ1MTY1NzU0NzM1NzI3NDcyNTA2OTM3NzY1NDUxNDM1NTQ5NDM0ZjY1NzA3MjRlMzQ0MTU4MzY0Yzc0Nzg1NzM0Nzk3MTJmNDIzNDc0NDk2YTQxNTI2NTZhNTQ2ZTUzNzA3OTJmNGY1YTU4NTM2ODQ0MzE1MDM4NGY1MjQ1NzAzMDMzNjU1NTJmNzc0NTQ0NmU0YTMyNDI3OTQ3NDE1NDRhNzIzMDUyNzc2MzU5NmQ2YzRlNmQ2NzMxMzQ2ZTRmNjU2MTM3NzQzNzZkNDcyYjQ0NTU0MjUzMzc3OTMzNTg1MjMyNTk2ZTZjNGY3NzU5NmE0YTY1NTI0NjUyMmI0ZDcxNGMzMzUxNmQ2MTYxNDU1NTU4NjM2Yzc2NTY0YzY5NzEzNzU2NTI2ZDRkNTYzNzU4Nzg0ZjU4NTY0MTZkNDY0ZjRkNTc1MDJiMzk3NjY0MzA3OTcwNjM3OTZjMzc3NTY0Mzc2OTMxNjc2ZjVhNDM2NjZkNmM1MTc4NjY3MTU2NDQ2NjU4NDQ3NjQyNTY1MjU3MzU0NjYxMzU0ZTVhNDI2Zjc1NTA3ODM3NjY1MTY3NjgzNjU3MzI2MzJmNmM1YTc5NTg0NTZlMzk0ZjY0NzU3ODRlNjI0OTU2NzM0YTM5NzkyZjRlNDk0ZDU5NGI2YjZmNDY1MjUxMmI3MTMxNDg3MTRlNzE0MjRmNmQ0YTdhMzg2NTM5Mzk3NTZhNDQ3NTQ2NTc1OTMzNWE0NDU4NDE1MzQzMzY0YzYzNDk0YjM1NGM3YTc5NGQ3MzM4NDc2NDQ0NTkzNzc2NmI2ZTc5Mzk2NDY3MzUyYjMyNTE0NTVhNzA0NzQ0Nzk1NTMwMzM3NzRiNmI3ODRkMzE2ZjZjMzQ0ODYxNDEzMzUwNmI2MzQ3NTk3OTQzNTE2YTU2NWE1NTQ5NGEzODRiMzI0YTU4NDg3MTcwMzI0YTU1NDU2YzZlNjg3MzQxNjc3MDUzMzk1MjZhNDU0OTczNmU2NDU1NzA1OTZmNjUzOTU5NDI0MTQxNDIzNjY4Mzc3MjUyNGQ3ODU0Mzg2MjM5NjUzMTU1Njg3MzMyNWEzNzZhNDE0ODJiNTA2NjZkNTI3MDYxNDU3NzMzNzM3MDQ1NmY0ZjYxNTc1NTZlNTc1NzQyNDc2YTczNTA0MzQ3NzU0ZjMyNzE1ODMwMzY0ZDRjNDQ3MTRlNmE2NTRmMzk2YzM5NWEzNzY3NDQ0NDcxNjg3ODRjNmQ3NjVhNDQ2MTRhNjY1NjcyNjQ1NzMxNmQzNjMzMmYzODY2NjUyZjM0NGI2YTRhNzY3MjY1NzczODcyNGE2YzQ5Mzc1MjMyNGU0OTZmNTU3NDQyNDI0NTY1NDk1OTY1NGU2ZTZjNjU1YTZlMmY1NzZkNjY3MDQ3NTc2MTZkNGQyZjU1NjU1MzU1NjgzNzQ2NWE0NzM4NDE1NzRlNDE2NzQ3NDE0ZTc3NzMzMTM3NGI2ZjYyNDU2NTc3NTc1ODU0NDMzNzQ1Njk2NDc4Mzc1OTU2MmI3MTZiNGY2OTVhMzM0MzU5NTI3NjY2NjY2ZDc3MzY0YTRlMzg0NDVhMmIzMDU5NTQ0MzcyNmMzODMyNDc1OTMxNmI1MjQ0NzczODQ3NjY1NDY4NjQ2OTUyMzMzNjcxNmU0ODcyNzg2YjM0NDEzMTU3NTg2NTQ4NDk3YTQ1NmQzNjZlNzQ0YTRhNjYyYjM4NmY2MTQ2MzAzMTZlNmE2YjRkNDQ2MzMwNzE1YTY3NGE0MjczNTk1OTU0NDY1MjUxNGUzMzUyNDM2Nzc1NzA1Mjc0NzU2OTJmMzM0ZjZkNzc1MTU1NmI3MzVhNGEzMzU3NGM1MjcyNDc1MjZhNzA3OTM5NDg0NTQzN2E1MzUxNWE2NTc3MzIzOTY3NTQzNjRjNTQ0NTczMzI0MzY0MzE0ZTUyMmI3ODRmNTA2OTcyMzQ1ODM1MzQ1MzM4NTY3MTRmMzI2ODMyNGM1MTZhNTczODZmNjIzNTcxNjYyZjc0NmUzOTdhMzU0ZTcyNTIzNzYyMzI2MzU2NTg0Nzc1Mzc0ZTMwNjk3NjcwMmI1MTc0MzI3MzY4NDM2ZjVhMzgzNjY0MmY2YjY0NjIzMDQ0MzE3MzQ4NDg3MDZjNDE1OTUwNjk0ZDU3NDk1MzM4NDQ2Njc1NGY0ZjY4NjkzMDQ1MzE2OTM0MmI3NzY5NmM1MjY1NzM2Zjc0Mzk1MDQ1MzczODM0MzU3OTU2NmM0YjRiNTI3MjYzMmIzODQyMzQ2NTcxNmQ0MjcyMzY2YjM3NTY0ODRhNTM0MjU2NTk3MDQ1NGU2NzY1NzY3NzY4MmI3ODc3NDI2YzJmNmQ3YTYxNWEyZjRhNGY0NjU0MzI1YTVhNmE3NzY5NTQ2YTRiNTA2NDUwNTU3MDY1NmM2NjZiMmY0MjY3Nzg2ZDRkNDE3MzM0MzI3NDRiNWE3Nzc4NTQ1YTUwMzE2MzU3NTY2MTZiMzE1MDQ5Njk0Mjc0NjQ3MzczNTYzMDU0NGIzMTZlNTA0NDM4NDE0ZjY4NzEzMTQyNmQzMzZlMzY2NTc1NWE0NjQ2NmMyYjUyNTU0MzQ0Nzg1MjYxNmQ3MzZlNGM3NzM1MzE2YTZhNzM0YzQ1NTA3MTc1NmQ1NDZiNGQzNzVhNTc0ZDcxNDY3MzM2NDc2ZjcwMmY0YzY5NDU2MzcwNmY0MTM4NDQzNjQ0NDc0NTQ2NzY2MzYzNjIzNjM1N2EzNzcwNmI3MjYxNDYzNDUyNmQzNDUzNjM2ODZhNjE0YjZkNzM2MzQ4NTE2ZTQxNjI2MzYxNTAzNTc5MzMyYjc1NzE1NTUxNjM0ZDQ5NGE3MTQ4NmUzMzZhNTk1NTM3NjgzMjcxNGQ0NTUyNjc2MTY0NTY2NzJmNWEzNzY3NDY1MzcyNzE0NjRmNjU2NjU1Nzk3ODMzMmY0ZTQyNjg2ZDY3NGI1NTZlNzE0YjMyNjI1NDdhNTQ1NDMzNjU2ZTZmNzE0YTY5NmE0ZTYzNjIyYjM3NzM1NDMxNGM0NDM2Nzc3NjQ3NTU1OTRjNmIzMzQ1NjM1OTUxNDY1NTc1MzI1MzQ2NGE0YTY3Mzg3NDZkNjU0ZTVhNTA1ODU5NDQ3OTZmNzk3NDczMmI3NjM4NTU0NzU1NDk1ODU2NDY1MzcxNzM1NTZiNDg2YTZmNzM2NzUzNTU0MzUzNGEzNTUzMzI0NTc1NTUyZjYyNGY0OTUwNzI3MjQ2NWEyYjM4NTE3MjY4NWEzNjQ2NzE1YTc0NjY0YTM1NDg1MTU3NjI2ZDRlNjk2NDZmNjc2NTQ5NTA0NjY1Njk3NzM3NTE3ODJmMzM0ZDcxMzI3MDY4NDM0OTU1Nzg1NDYxMzM0MjY5NjI1OTU3Nzk0MjQyNmI2NzQyMzk1MjUyNWE3NDRhNzU2NDcxNzg2ZjU0MmI0NDM0Njc1NTU4NDYzNzY5Mzk2MTc2MmI0NjdhNTg3NzM4NjczNDcyNGI0YzZkNDUzMjZhNTA0YjU0NDY1NjU4NTYzODYyNjUzNzY1NTk3OTc3NjY2Yzc1NjM0NjM1NTkzMDcwNjQ2YTVhNjU2NjQ4NjM2NjUyMzk1MjM1NjQzNjY0NmI2ODUwNTU0NTczN2E0NzRlNzE1NDRiNjU1MTdhNzU2YTUwNDMzMzMyNjg0ZDc0Njg3MjM4NTY0YzM2MzI2OTMyNjk0ZjRmMzU0NTc0NzU2YTU5Njk0ZDU4NzU1MTRiNjM2NzY2NTkzMTRmNDQ3OTM5NDE2ODJiNjE0MzcxMzMzMzZjNDE1NjQxNzk0YzRhNzk0YTRmNGE0OTQyNzc2NzJmNTI2ZTM1Nzk0ZTRjNmMzMjJiNGE2YjY3NTEzMDZmNDE1MjYyNGM0NzU3NTI0YjY3NzY1MTQxNDc3MDYyNTI0ODU2NGUzMzMyNjU3MTU1NzQ3MTJiNzM3OTJmNGU3OTU1NTgzODU0NGIzNTcyNTg1NTUyNGYzMzUwNzE1OTM1NDk2YTQ2NmM2ZjcyNjY3NzM4NDI1MjcwNDk2YjUwNTgzMzMwNTQ0MTYxNDU2OTQ3NGM3MzU4NGI1MDc1NTg2NzQyNTQzNzMzNzc3NTc2NTE2YTQ0Nzc2ZjY1MzY3ODRjMzg0ODQ1NGI0MTZiMmI3NTRkNTk2NzYzNTE2MzU0MzA1OTcwNjg2OTMwNGEzODc2NzkzNjc5NjE0NDQ4N2E0Mjc4Mzk3MjcyNTE0NzcxNmQ1MTY0MzYzNTQ0MmI0NDZjNDQ0NDUzNzk2Yzc1NTIzNDc4NGI2MjYyNDI0ODZhMzg0YTVhNzU1MDQ0NDY2NzY5NmIyYjMwNTY2Njc5NjY1NzU0Nzc0NjUzNzc3OTJmNjQ1ODJmMmY1NTc1MmY1ODU2Mzk3NjQzNGU0Nzc5NGIzNzRkNjg3NjY1NjQzNDQ0MmY0MjRiMzY2ODM0Mzg0NjczNGQyYjUxNDg2NjM4NzE1NjY2NTUyYjZlNGM0NzcyMzc0NDY5NTQ3NDJiNjY1MTU5NTI0MzQ5NTk1OTY2NmU2MTYxMmY3NTYxNmI0NTczMzI0ZTc2NzU2NzQ2NTA2YjdhN2E0ZDY0NmI3MDQ5NTM2ZjQ4NWE1OTY2Njk2OTUzNTE1MzY5Nzc2NDU1NDg3NDQ5NGI3NTc3NDIzMDc3NjM2NjMzNzA3OTU0NTczNTZhMzk2NjY4MzYzNzZkNDc1Mjc4NTU1YTc5NGMyZjc0NzAzMjJiMmY0OTc2NTg0ZDM5NmI1NDc3NzI1ODRjNTQzMzY0NzM1NDQ0NjI0YTU1NDU2ZjU2NjUyYjU4NjUzNjZkNDg0OTRiNjc2ZDY5Nzc0YjZhNjg0MTMxNTQ1MTY3NDM3NzU2NGE0NzRmMzMzNjQ1N2E2OTQyNzY0YjUwNTI1NTU1NTM1MDU1MzI3YTczNGY1Mzc3NjU0ZTU4Nzg3MTZiMzYyYjMzNzA0NDQxMzY2ZTZmNmMzMzZlNzIyZjQxNTQ0ODVhMzIyZjUzNTk0Zjc1NzAzNzc3NzU0ODY3NTQ3ODc3NGM1MjUzNmMyZjZkNDc1MDRhNTAyZjU5NDc2NTU1Njk2NjQxNDk1ODc5NDU3MzQ4NzI3OTM2MzU0ZTU4NDEzNjRmMzI1MzU1NjQ2ZTY3NjI1MzdhNjE2MjY1MzA0ZDZkNjU2MTY0NDczMzM4NmY2OTU3N2E0NTU2Mzg2YzMzNTE3OTc0MzU1MzZmNDM0NDU3NmE3NjU1NzU3OTZkNTMzMTZlMzI2YzVhNDI2YzMxNTM1NDRjNDY1NDQ4NDY0YjQ5NzE1NzM5NjY0ODMyNmY1OTQ2NzQ0YzM2MzI3MDczNTM2MTc1NDU0MjY2MzI2ZTU4NTQ3OTY1NmU0ZjRlNzE3MDM0NTY0NzUzMzE1YTU2MzQ1MzQ5NzU3YTM1NDQ3MzQ1NGU2Mzc3Njc0YjRkNmIzNzUxM2QzZA==";
	assert.instance(await subject.import(data, "some pass"), Profile);
});

test("should restore", async () => {
	subject.flush();

	const profile = subject.create("John");
	await assert.resolves(() => subject.restore(profile));
});

test("should dump", async () => {
	const profile = subject.create("John");

	assert.object(subject.dump(profile));
});

test("should restore and mark as restored", async () => {
	subject.flush();

	const profile = subject.create("John");

	await subject.restore(profile);

	assert.true(profile.status().isRestored());
});

test("should persist profile and reset dirty status", async () => {
	subject.flush();

	const profile = subject.create("John");
	profile.status().markAsRestored();
	profile.status().markAsDirty();

	assert.true(profile.status().isDirty());

	subject.persist(profile);

	assert.false(profile.status().isDirty());
});

test("should not save profile data if profile is not restored", async () => {
	subject.flush();

	const profile = subject.create("John");
	profile.status().reset();

	const profileAttibuteSetMock = Mockery.stub(profile.getAttributes(), "set").callsFake(() => {
		return true;
	});

	assert.false(profile.status().isRestored());
	profileAttibuteSetMock.neverCalled();

	subject.persist(profile);

	assert.false(profile.status().isRestored());
	profileAttibuteSetMock.neverCalled();
});

test("should not save profile data if profile is not marked as dirty", async () => {
	subject.flush();

	const profile = subject.create("John");

	const profileAttibuteSetMock = Mockery.stub(profile.getAttributes(), "set").callsFake(() => {
		return true;
	});

	profile.status().reset();
	assert.false(profile.status().isRestored());
	assert.false(profile.status().isDirty());
	profileAttibuteSetMock.neverCalled();

	await subject.restore(profile);
	const profileDirtyStatusMock = Mockery.stub(profile.status(), "isDirty").returnValue(false);
	subject.persist(profile);

	assert.true(profile.status().isRestored());
	assert.false(profile.status().isDirty());
	profileAttibuteSetMock.neverCalled();
	profileDirtyStatusMock.restore();
	profileAttibuteSetMock.restore();
});

test.run();
