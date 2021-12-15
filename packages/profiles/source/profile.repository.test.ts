import { describe } from "@payvo/sdk-test";

import { identity } from "../test/fixtures/identity";
import { bootContainer, importByMnemonic } from "../test/mocking";
import { container } from "./container";
import { Identifiers } from "./container.models";
import { Profile } from "./profile";
import { ProfileImporter } from "./profile.importer";
import { ProfileRepository } from "./profile.repository";
import { ProfileSerialiser } from "./profile.serialiser";

describe("ProfileRepository", ({ it, assert, beforeEach, loader, nock, stub }) => {
	beforeEach((context) => {
		bootContainer();

		nock.fake()
			.get("/api/node/configuration")
			.reply(200, loader.json("test/fixtures/client/configuration.json"))
			.get("/api/peers")
			.reply(200, loader.json("test/fixtures/client/peers.json"))
			.get("/api/node/configuration/crypto")
			.reply(200, loader.json("test/fixtures/client/cryptoConfiguration.json"))
			.get("/api/node/syncing")
			.reply(200, loader.json("test/fixtures/client/syncing.json"))
			.get("/api/wallets/D6i8P5N44rFto6M6RALyUXLLs7Q1A1WREW")
			.reply(200, loader.json("test/fixtures/client/wallet.json"))
			.persist();

		context.subject = new ProfileRepository();

		if (container.has(Identifiers.ProfileRepository)) {
			container.unbind(Identifiers.ProfileRepository);
		}

		container.constant(Identifiers.ProfileRepository, context.subject);
	});

	it("should restore the given profiles", async (context) => {
		assert.is(context.subject.count(), 0);

		context.subject.fill({
			"b999d134-7a24-481e-a95d-bc47c543bfc9": {
				contacts: {
					"0e147f96-049f-4d89-bad4-ad3341109907": {
						addresses: [],
						id: "0e147f96-049f-4d89-bad4-ad3341109907",
						name: "Jane Doe",
						starred: false,
					},
				},
				data: {
					key: "value",
				},
				exchangeTransactions: {},
				id: "b999d134-7a24-481e-a95d-bc47c543bfc9",
				notifications: {
					"b183aef3-2dba-471a-a588-0fcf8f01b645": {
						action: "Read Changelog",
						body: "...",
						icon: "warning",
						id: "b183aef3-2dba-471a-a588-0fcf8f01b645",
						name: "Ledger Update Available",
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
					"0e147f96-049f-4d89-bad4-ad3341109907": {
						address: "DNjuJEDQkhrJ7cA9FZ2iVXt5anYiM8Jtc9",
						coin: "ARK",
						data: {
							BALANCE: {},
							SEQUENCE: {},
						},
						id: "0e147f96-049f-4d89-bad4-ad3341109907",
						network: "ark.devnet",
						publicKey: "03bbfb43ecb5a54a1e227bb37b5812b5321213838d376e2b455b6af78442621dec",
						settings: {
							ALIAS: "Jane Doe",
							AVATAR: "...",
						},
					},
					"ac38fe6d-4b67-4ef1-85be-17c5f6841129": {
						address: "D6i8P5N44rFto6M6RALyUXLLs7Q1A1WREW",
						coin: "ARK",
						data: {
							BALANCE: {},
							SEQUENCE: {},
						},
						id: "ac38fe6d-4b67-4ef1-85be-17c5f6841129",
						network: "ark.devnet",
						publicKey: "030fde54605c5d53436217a2849d276376d0b0f12c71219cd62b0a4539e1e75acd",
						settings: {
							ALIAS: "Johnathan Doe",
							AVATAR: "...",
						},
					},
				},
			},
		});

		assert.is(context.subject.count(), 1);
	});

	it("should push, get, list and forget any given profiles", async (context) => {
		assert.is(context.subject.count(), 0);

		const john = context.subject.create("John");

		assert.is(context.subject.count(), 1);
		assert.instance(context.subject.findById(john.id()), Profile);

		const jane = context.subject.create("Jane");

		assert.is(context.subject.count(), 2);
		assert.instance(context.subject.findById(jane.id()), Profile);
		assert.instance(context.subject.findByName(jane.name()), Profile);
		assert.true(context.subject.has(jane.id()));

		context.subject.forget(jane.id());

		assert.is(context.subject.count(), 1);
		assert.false(context.subject.has(jane.id()));
		assert.throws(() => context.subject.findById(jane.id()), "No profile found for");
	});

	it("should get all profiles", async (context) => {
		context.subject.create("John");
		context.subject.create("Jane");

		assert.length(Object.keys(context.subject.all()), 2);
	});

	it("should get all keys", async (context) => {
		context.subject.create("John");
		context.subject.create("Jane");

		assert.length(context.subject.keys(), 2);
	});

	it("should get all values", async (context) => {
		context.subject.create("John");
		context.subject.create("Jane");

		assert.length(context.subject.values(), 2);
	});

	it("should forget all values", async (context) => {
		context.subject.create("Jane");

		assert.length(context.subject.values(), 1);

		context.subject.flush();

		assert.length(context.subject.values(), 0);
	});

	it("should get the first and last profile", async (context) => {
		const john = context.subject.create("John");
		const jane = context.subject.create("Jane");

		assert.is(context.subject.first(), john);
		assert.is(context.subject.last(), jane);
	});

	it("should fail to push a profile with a duplicate name", async (context) => {
		context.subject.create("John");

		assert.throws(() => context.subject.create("John"), "The profile [John] already exists.");
	});

	it("should fail to forget a profile that doesn't exist", async (context) => {
		assert.throws(() => context.subject.forget("doesnotexist"), "No profile found for");
	});

	it("should dump profiles without a password", async (context) => {
		const john = context.subject.create("John");

		await importByMnemonic(john, identity.mnemonic, "ARK", "ark.devnet");

		context.subject.persist(john);

		const repositoryDump = context.subject.toObject();

		const restoredJohn = new Profile(repositoryDump[john.id()]);
		await new ProfileImporter(restoredJohn).import();
		await restoredJohn.sync();

		assert.equal(new ProfileSerialiser(restoredJohn).toJSON(), new ProfileSerialiser(john).toJSON());
	});

	it("should dump profiles with a password", async (context) => {
		const jane = context.subject.create("Jane");

		await importByMnemonic(jane, identity.mnemonic, "ARK", "ark.devnet");

		jane.password().set("password");
		jane.auth().setPassword("password");

		context.subject.persist(jane);

		const repositoryDump = context.subject.toObject();

		const restoredJane = new Profile(repositoryDump[jane.id()]);
		await new ProfileImporter(restoredJane).import("password");
		await restoredJane.sync();

		assert.equal(new ProfileSerialiser(restoredJane).toJSON(), new ProfileSerialiser(jane).toJSON());
	});

	it("should export ok", async (context) => {
		const profile = context.subject.create("John");
		await importByMnemonic(profile, identity.mnemonic, "ARK", "ark.devnet");

		const exported = context.subject.export(profile, {
			addNetworkInformation: true,
			excludeEmptyWallets: false,
			excludeLedgerWallets: false,
			saveGeneralSettings: true,
		});

		assert.string(exported);
	});

	it("should export ok with password", async (context) => {
		const profile = context.subject.create("John");
		profile.auth().setPassword("some pass");
		await importByMnemonic(profile, identity.mnemonic, "ARK", "ark.devnet");

		const exported = context.subject.export(
			profile,
			{
				addNetworkInformation: true,
				excludeEmptyWallets: false,
				excludeLedgerWallets: false,
				saveGeneralSettings: true,
			},
			"some pass",
		);

		assert.string(exported);
	});

	it("should import ok", async (context) => {
		const data =
			"eyJpZCI6Ijg0ZjI3NWMyLTVkMzQtNDYxNy05NzVjLTc5ZTA5MTZmNGQ3NyIsImNvbnRhY3RzIjp7fSwiZGF0YSI6e30sImV4Y2hhbmdlVHJhbnNhY3Rpb25zIjp7fSwibm90aWZpY2F0aW9ucyI6e30sInBsdWdpbnMiOnt9LCJzZXR0aW5ncyI6eyJBQ0NFTlRfQ09MT1IiOiJncmVlbiIsIkFEVkFOQ0VEX01PREUiOmZhbHNlLCJBVVRPTUFUSUNfU0lHTl9PVVRfUEVSSU9EIjoxNSwiQklQMzlfTE9DQUxFIjoiZW5nbGlzaCIsIkRBU0hCT0FSRF9UUkFOU0FDVElPTl9ISVNUT1JZIjp0cnVlLCJET19OT1RfU0hPV19GRUVfV0FSTklORyI6ZmFsc2UsIkVSUk9SX1JFUE9SVElORyI6ZmFsc2UsIkVYQ0hBTkdFX0NVUlJFTkNZIjoiQlRDIiwiTE9DQUxFIjoiZW4tVVMiLCJNQVJLRVRfUFJPVklERVIiOiJjcnlwdG9jb21wYXJlIiwiTkFNRSI6IkpvaG4iLCJTQ1JFRU5TSE9UX1BST1RFQ1RJT04iOnRydWUsIlRIRU1FIjoibGlnaHQiLCJUSU1FX0ZPUk1BVCI6Img6bW0gQSIsIlVTRV9FWFBBTkRFRF9UQUJMRVMiOmZhbHNlLCJVU0VfTkVUV09SS19XQUxMRVRfTkFNRVMiOmZhbHNlLCJVU0VfVEVTVF9ORVRXT1JLUyI6ZmFsc2V9LCJ3YWxsZXRzIjp7fX0=";
		assert.instance(await context.subject.import(data), Profile);
	});

	it("should import ok with password", async (context) => {
		const data =
			"Y2YyN2NkZGZjOTYxZGU1YmRlNTBlNjczMmJkY2MxOGY6NTE2ZDUyMzg1MjMyNzc1MjVhNGU3MDQzNjI2NjM4NDEzNjU5NzQ3ODYxNDkzOTUxNTk0YTY5NmU1MTUzMmIzODZkNWEzNDQyNzk3NDM2MzQ0NjY3NmQzMTc2NjEzNjRmNmY0YjZlNzI1MzMxMzA0NjY0Njc1MzY5NjM2NjcyMzg0YzU0NmM0Nzc4NTQ1MTM2NjI1NDc3NTI3MjZjNGM3MzM4Nzg1MDRjNDI2YjdhNTA0Mjc4MzE0YzdhMzY2YTMxN2E2NjU5NTM3NjZmNzM0NjYzNDc1NjczNDE2OTU1NmM0YzM2NzY2NTQyNGE2MzJiMzE2MTRhNjg2OTM1NjEzNDZhNmE0OTc1NDI0ZDU3NmY0MzUzNTI1MjMzMzI0ODZkNGI3NjU0MzI0Zjc1NjYzMDc2NjU2YjVhNGU2NTcxNDc2ODYzNzg0NzQxNGU1NjU0NDI2NTRlNjk1MTcxNzM1MTQxNTk2YTc4N2E3NTRhNTE0ZDRjNzU1OTYzNmI0MjU0MzI1YTUxNmU0MjUxNzk3YTY4NDIzMTZjNTk1MDM0NGM2YTY5NTg2MTMxNTI1NzUwNjg0NTM1NDc2NDRhNGU1YTM2MzM3MjRkNzA2YTQ5NzY2MzQ5MzM2NjQ3NTY0Mjc3NGQ3OTY5Nzg3NDU3NGM0NDUwNGE0ZDM1NDk3MDUxNzk0ZDZiNmIyYjMwMzg1NDU4NGU3ODU2NmU2YjM4NTQ3MzMzMzk2NTM1NjkzMDc1NDE3MDUxMzkzNDQ1NjQ1NTU0NTQ3MDc2NjE1NTQyNjM1YTczNTQ2NjY5NzczNjM5Nzk3ODUwNzY0ODUyNTU2MTYzNzk2NTczNmYzMjQyNTU0YTc4NmY3OTU0NjI0MTY0NzU2ZTM2NzI2YjQ3NzU2ODUyMzA2OTZmNWE0NzU5NGQ2NTZjNmQ3MzMxNTA3MTQyNzU0ZDYxNDUzMzRjNmU2ZDMzMzE0ZjRiNDg0YjM0MzM2NjU2MzM3NzRlNTIzOTM2NGE3OTZkNjY2NTU2MzA0ZDM2NGI2YTU5NmE1ODU2MzI0Mzc3NjgzODUyNTA0ZDQ4NTAzMTRmNTI2YjY3NmEzNDZmNTQ2ODM5MzI0NzU3Mzc1NDQ0NDYzNzM0NDgzNDczNGYyZjQxMzQ1MjcxNTA1NzczMzk3OTc5Nzg1MTYyNTUzODM2Nzc2ODMxNDM1MjM3MzE1NTcyMzk2MTc2NmQ0ZjQ0NTAzOTU2NjQ3OTczNTQ0MjYzNDk3MDQ5NzczMjcxNjU2ZjQ0NDM3MjM3Nzc0NzU5MzA0MzU2NGE1NDcwNTMyYjZmNzU3MDY0NjM0ZTM3Nzg0MjU0NjU0ZjJmNjk3MzJmNmY2MzM1NzMzNzczNjc1MTZkNzk1OTQyN2E3NDMzNTQ2NTUwNTQ0NzQ3NDQ3OTM0NzMzMjY5NzczNzQ4MmIzODU4NmQ0ZjU0NTg2NDM5NzU2YjQ3NGUzNzcwNjk0NDY5NTQ2ODZmNTc1NTM4Nzk2YjQ4NzQ1MTdhNzAyYjRmNDMzMDM0NTE2YTJiNDg1NjRjMzQ0ZjQ3MzE1MDMyMzU0NTRiN2EzNTQ0MzU3YTQ5NzI3MjZjMzc3MjY5MzM2YTRkNDk2YjYxNTA3YTM0Nzk1OTQzNGQzMjM1NDUzNTJmNjU1ODc2NmU0YzY3NzA3MTYxNzQ2ZjUzNmE2NzQ0NzY3MDc2NzQ1NzQzNTg3NTQ3MzI0YTMxMzI0ZTc1NGE3NDUyNGU1NTU5Nzc1MDRhNGQ1OTc4NjEzMDU2MzkzMTZiNTAzMjUzN2E1ODUyNGUzODU3NGE1MTcxNmY3NTY5NGM0NDY2NTY1MDQ0NjI3NzY5Mzc0YzQ3NTk3ODY0MzEzMDMyNmQ0MzcyNmYzNzUxNzUzNDUxNjY1OTM5NDM0NjQ1NmE1YTU2NWE3MDUyNGE3MDRhNTU0ZTJmMzczMTY5NGIzMjQ3NDc0OTY2NTg3NzcwNjE2NjUzNjU3NzRjNjUzNDdhNTU0ZTQ1NDU3MjM2NGQ0MzQ5NjM1NjY4NzI1NDU1NjY0ZjcxNGU0OTMyNTE1NjQ0NTU1MzU1NmE0MTc0NzczNjZiNmEzMDRlMzM0ODQxNjg2OTM3NzMzMzY1NGY1NDY4NmQzMDM4NDk1MTRiNzczOTU3NTU1MDQ0NmY2MTRjMzg1NTMzNDQ3NjJiMzQ3NDY1NGU1NTJiNDQ0NTc1Mzg1MTQ0NjUzMDU0MmY2ZDQyMmI0YTdhNjM1MDMzNzU3NTJmNTQ3ODc0Nzk1NzYzNDIzMzY1NjY1ODc0NTYzOTRjMzk0ZTc3MmY2ODYyNjMzMDJiMzI2MjQ3Njc2NzJmNmUyZjZlMzUzMTQxNzU1YTY5NTgzODY1NjU2NjYzNTA1OTRkNDE0ODY5NGI3OTYzNzE1NTM3NDg0ZjY4NTQ3NzU4NmI2YjU3MzU3NzU2NGM1MTU3Njk2NTYxNDIzMDcxNjg3NTY1NDE3ODY1NDQ2MTRhNDUzMzMzNTA2ODQ4NTA1NDZjMzE3MDQzNjM1MjU3NzA0ZDQ0NzI2Njc2NmQ2MzU0NjEyZjRlNmEzOTRjNWE3MDVhNTk2ODM1MmY2MTM0NTY1NTRkNjYzMjJiNWE1NTY2NTU0Zjc1MmI2MTM0NTk1NzRjNGM1MDZhNTAzMDZiN2E2YTMwNmY1OTcwNTU0Mzc3NzU1YTY2NjU3NDU5NmUzMTVhNjU3ODM1NGEzNjMyMzIzMzM1NTU3NTU2NmQ0MTQ3NjE1MDY2NGQ3MTY4NmQyZjMxNDg2OTQ0NGE3NTY0NGU2MjczMzk2NTU2Mzg1YTY4MzMzMzY4NmY3MDUwNDQ3YTZkNTQzNDc5NzY0OTZmMzM2ZDZlNjk2MjZhNzczMzVhNmM1NTQyNzU0ZjcxNDY0YjY5NTczMjRhNTE3NDdhNTE2YjUzNzY2ODQ1NTY2NTM1NjE1YTcyNDU3ODQ3MzU3NzcxMzQzNzJiMzA0MTM4NjM0Yjc1NzE1MDc4NTUzNTY1NjU2MjU2NzU0MzM1NGE1NzVhMzA1NTcxNzkzODMwNGE0ZjdhNGE0NDczNzgzMDRmNDY0MTYxNzc3ODRjNjQ2MzY4NTgzODU2NjgzMzRjNTU0NzZlMzE1MjZiNmM0MjUzNjE0ZjcxNDM0ZjUyMzE2MzM1NDU0OTc0MzM3ODU2NTU0ZjM3NDI3ODc3NjMzMDY1NDU1MDRmNDY0MjY1NzY0OTY0NzMzOTcyNjI2YjMwMzc3MTc4MmI2ZTU2NmY3MTc5NzU0OTQ2MzY0OTU4NGI3MjRlNjgzMjQzMzQ2YTUyMzgzNzY2Njk1NDczNGQ1YTQyNDM2ZTc5NDg3NTU0NTU1NzU5MzA0ZDRmMzM1MjcyMzE2MzUzNjM0ODc5NmM2MzU0NDczNzU0MzI3MDRiNGU3OTcyNjkyZjUwNDY1NTQ3NDg0YTU3NGY3NzUyMzM0YTY3NzI2ZjZiNDE0YzRiNzc0Mjc3MzUzMzMzNmY0OTQzNDY3YTJmNzc0NjM4NTI1NDY2Njc0YzM2Nzk0NTRhNzc2ZjdhNzAzNTM2MzE2YTczNjMzNzQ5NDEyYjVhNTc0NzQzNjg3Mzc1NzMzNjYxNmY0YzY4NTUzMjU3MzAyZjU3N2E1NDQ0NmQ2NTY4NTY3MjcyMzY0YjQzNTA0NjcwMzg3NjUyNjEzNDQ5NGI0MTRlMmY2YTRkNDUzMDM5NDk3NzQ2Nzk2YzU0MmIzNTY5MzE1YTU4NzM2MTJiNjM3ODcwNGY0ODc1NTY3Mjc3NzczNTRjNDcyZjM5NzMzMjRjNjk0ZDM2NDk0NDczNTU2NDRkNDg2ZTUxNGE3MjUzNzQ1MTcwNjEzNzQ3NDI2MjMwNjc3NDRmNjYzMTRlNzc2MTY0MzM1NTYxNDQ0NTZmNmI3NzdhMzg0YjZkNTY0YTQ4NWE2NjU3Njk2NjUwNzY1NTQ2NDc0MjUxNmM3NDRmNGEzMTM5NDI3NTMzNjg1MzUwMzk2YjM1Mzc3NzJmNjU2ZTU1Mzk0YjdhNzA1MTZiNzM2NTY1NWE1MjU1NzYzMDZjMzQzNDQ2NDIyZjcyMzkzMjc3NGI2ZTU2NTE2MjcxNmM0NzZiNjU0MzUzNDUzODdhNDkyYjcwNGU0YTQyNzc1MTMyN2E1MzVhNDk1NDJiMzg1MDM2NjE3NzQxNTYzMDZmNWEzMjYzNzE0ODU4NzU3MTUzNjk2NTc2NzI2ODU4NzU0YjRiNDQzMDM0NjY1ODcxMzY0ODUwNjU0Yjc4MzE1MDY2NDU2ZDU2NTk3MzM5NjEzNDc3NDI0ZDMwNTQ1OTMxNzc3YTQ5NDczMzVhMzU1ODcwNmU1YTc0Mzg2YjM3NTY2ZDU3NmY0YzJiNTE1ODQxMzM1OTRjMzg0ZDMyNTU1NTQ3NzI0OTc5NzU1YTcxNzI0MjZmNDQ2OTMzNmY3NjM1NDE2MjQ1NjE1YTYzNTI2MzcwNTI2NzQ2MzM1MDQ1Njc2ZTcxNDU3OTJmNTQ0NzRmMzc0Nzc0NzY2MjUyNzI1NzU0NzU2Mzc3MmY1MTJiN2E0MTNkM2Q=";
		assert.instance(await context.subject.import(data, "some pass"), Profile);
	});

	it("should restore", async (context) => {
		context.subject.flush();

		const profile = context.subject.create("John");
		await assert.resolves(() => context.subject.restore(profile));
	});

	it("should dump", async (context) => {
		const profile = context.subject.create("John");

		assert.object(context.subject.dump(profile));
	});

	it("should restore and mark as restored", async (context) => {
		context.subject.flush();

		const profile = context.subject.create("John");

		await context.subject.restore(profile);

		assert.true(profile.status().isRestored());
	});

	it("should persist profile and reset dirty status", async (context) => {
		context.subject.flush();

		const profile = context.subject.create("John");
		profile.status().markAsRestored();
		profile.status().markAsDirty();

		assert.true(profile.status().isDirty());

		context.subject.persist(profile);

		assert.false(profile.status().isDirty());
	});

	it("should not save profile data if profile is not restored", async (context) => {
		context.subject.flush();

		const profile = context.subject.create("John");
		profile.status().reset();

		const profileAttributeSetMock = stub(profile.getAttributes(), "set").callsFake(() => true);

		assert.false(profile.status().isRestored());
		profileAttributeSetMock.neverCalled();

		context.subject.persist(profile);

		assert.false(profile.status().isRestored());
		profileAttributeSetMock.neverCalled();
	});

	it("should not save profile data if profile is not marked as dirty", async (context) => {
		context.subject.flush();

		const profile = context.subject.create("John");

		const profileAttributeSetMock = stub(profile.getAttributes(), "set").callsFake(() => true);

		profile.status().reset();
		assert.false(profile.status().isRestored());
		assert.false(profile.status().isDirty());
		profileAttributeSetMock.neverCalled();

		await context.subject.restore(profile);
		const profileDirtyStatusMock = stub(profile.status(), "isDirty").returnValue(false);
		context.subject.persist(profile);

		assert.true(profile.status().isRestored());
		assert.false(profile.status().isDirty());
		profileAttributeSetMock.neverCalled();
	});
});
