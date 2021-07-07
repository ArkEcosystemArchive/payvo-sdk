import "jest-extended";
import "reflect-metadata";

import nock from "nock";

import { identity } from "../test/fixtures/identity";
import { bootContainer, importByMnemonic } from "../test/mocking";
import { IProfileInput, IProfileRepository } from "./contracts";
import { Profile } from "./profile";
import { ProfileRepository } from "./profile.repository";
import { ProfileImporter } from "./profile.importer";
import { ProfileSerialiser } from "./profile.serialiser";
import { container } from "./container";
import { Identifiers } from "./container.models";

let subject: IProfileRepository;

beforeAll(() => {
	bootContainer();

	nock.disableNetConnect();
});

beforeEach(() => {
	nock.cleanAll();

	nock(/.+/)
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

describe("ProfileRepository", () => {
	it("should restore the given profiles", async () => {
		expect(subject.count()).toBe(0);

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
				notifications: {
					"b183aef3-2dba-471a-a588-0fcf8f01b645": {
						id: "b183aef3-2dba-471a-a588-0fcf8f01b645",
						icon: "warning",
						name: "Ledger Update Available",
						body: "...",
						action: "Read Changelog",
					},
				},
				peers: {},
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

		expect(subject.count()).toBe(1);
	});

	it("should push, get, list and forget any given profiles", async () => {
		expect(subject.count()).toBe(0);

		const john = subject.create("John");

		expect(subject.count()).toBe(1);
		expect(subject.findById(john.id())).toBeInstanceOf(Profile);

		const jane = subject.create("Jane");

		expect(subject.count()).toBe(2);
		expect(subject.findById(jane.id())).toBeInstanceOf(Profile);
		expect(subject.findByName(jane.name())).toBeInstanceOf(Profile);
		expect(subject.has(jane.id())).toBeTrue();

		subject.forget(jane.id());

		expect(subject.count()).toBe(1);
		expect(subject.has(jane.id())).toBeFalse();
		expect(() => subject.findById(jane.id())).toThrow("No profile found for");
	});

	it("should get all profiles", async () => {
		subject.create("John");
		subject.create("Jane");

		expect(Object.keys(subject.all())).toHaveLength(2);
	});

	it("should get all keys", async () => {
		subject.create("John");
		subject.create("Jane");

		expect(subject.keys()).toHaveLength(2);
	});

	it("should get all values", async () => {
		subject.create("John");
		subject.create("Jane");

		expect(subject.values()).toHaveLength(2);
	});

	it("should forget all values", async () => {
		subject.create("Jane");

		expect(subject.values()).toHaveLength(1);

		subject.flush();

		expect(subject.values()).toHaveLength(0);
	});

	it("should get the first and last profile", async () => {
		const john = subject.create("John");
		const jane = subject.create("Jane");

		expect(subject.first()).toEqual(john);
		expect(subject.last()).toEqual(jane);
	});

	it("should fail to push a profile with a duplicate name", async () => {
		subject.create("John");

		expect(() => subject.create("John")).toThrow("The profile [John] already exists.");
	});

	it("should fail to forget a profile that doesn't exist", async () => {
		expect(() => subject.forget("doesnotexist")).toThrow("No profile found for");
	});

	it("should dump profiles without a password", async () => {
		const john = subject.create("John");

		await importByMnemonic(john, identity.mnemonic, "ARK", "ark.devnet");

		subject.persist(john);

		const repositoryDump = subject.toObject();

		const restoredJohn = new Profile(repositoryDump[john.id()] as IProfileInput);
		await new ProfileImporter(restoredJohn).import();
		await restoredJohn.sync();

		expect(new ProfileSerialiser(restoredJohn).toJSON()).toEqual(new ProfileSerialiser(john).toJSON());
	});

	it("should dump profiles with a password", async () => {
		const jane = subject.create("Jane");

		await importByMnemonic(jane, identity.mnemonic, "ARK", "ark.devnet");

		jane.password().set("password");
		jane.auth().setPassword("password");

		subject.persist(jane);

		const repositoryDump = subject.toObject();

		const restoredJane = new Profile(repositoryDump[jane.id()] as IProfileInput);
		await new ProfileImporter(restoredJane).import("password");
		await restoredJane.sync();

		expect(new ProfileSerialiser(restoredJane).toJSON()).toEqual(new ProfileSerialiser(jane).toJSON());
	});

	it("should export ok", async () => {
		const profile = subject.create("John");
		await importByMnemonic(profile, identity.mnemonic, "ARK", "ark.devnet");

		const exported = subject.export(profile, {
			excludeEmptyWallets: false,
			excludeLedgerWallets: false,
			addNetworkInformation: true,
			saveGeneralSettings: true,
		});

		expect(exported).toBeString();
	});

	it("should export ok with password", async () => {
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

		expect(exported).toBeString();
	});

	it("should import ok", async () => {
		const data =
			"eyJpZCI6Ijc5YzViNWE1LTdlM2QtNDhlNC1hNjkwLWM2OTA5MzA1NDA0OSIsImNvbnRhY3RzIjp7fSwiZGF0YSI6e30sIm5vdGlmaWNhdGlvbnMiOnt9LCJwZWVycyI6e30sInBsdWdpbnMiOnt9LCJzZXR0aW5ncyI6eyJBQ0NFTlRfQ09MT1IiOiJncmVlbiIsIkFEVkFOQ0VEX01PREUiOmZhbHNlLCJBVVRPTUFUSUNfU0lHTl9PVVRfUEVSSU9EIjoxNSwiQklQMzlfTE9DQUxFIjoiZW5nbGlzaCIsIkRBU0hCT0FSRF9UUkFOU0FDVElPTl9ISVNUT1JZIjpmYWxzZSwiRE9fTk9UX1NIT1dfRkVFX1dBUk5JTkciOmZhbHNlLCJFUlJPUl9SRVBPUlRJTkciOmZhbHNlLCJFWENIQU5HRV9DVVJSRU5DWSI6IkJUQyIsIkxPQ0FMRSI6ImVuLVVTIiwiTUFSS0VUX1BST1ZJREVSIjoiY3J5cHRvY29tcGFyZSIsIk5BTUUiOiJKb2huIiwiU0NSRUVOU0hPVF9QUk9URUNUSU9OIjp0cnVlLCJUSEVNRSI6ImxpZ2h0IiwiVElNRV9GT1JNQVQiOiJoOm1tIEEiLCJVU0VfVEVTVF9ORVRXT1JLUyI6ZmFsc2V9LCJ3YWxsZXRzIjp7IjI0YzExMTQ3LTBlN2QtNDZhMC1hYzcxLTI0ZWRhOGMxZjRiZiI6eyJpZCI6IjI0YzExMTQ3LTBlN2QtNDZhMC1hYzcxLTI0ZWRhOGMxZjRiZiIsImRhdGEiOnsiQ09JTiI6IkFSSyIsIk5FVFdPUksiOiJhcmsuZGV2bmV0IiwiQUREUkVTUyI6IkQ2MW1mU2dnemJ2UWdUVWU2SmhZS0gyZG9IYXFKM0R5aWIiLCJQVUJMSUNfS0VZIjoiMDM0MTUxYTNlYzQ2YjU2NzBhNjgyYjBhNjMzOTRmODYzNTg3ZDFiYzk3NDgzYjFiNmM3MGViNThlN2YwYWVkMTkyIiwiQkFMQU5DRSI6eyJhdmFpbGFibGUiOiI1NTgyNzA5MzQ0NDU1NiIsImZlZXMiOiI1NTgyNzA5MzQ0NDU1NiJ9LCJCUk9BRENBU1RFRF9UUkFOU0FDVElPTlMiOnt9LCJERVJJVkFUSU9OX1RZUEUiOiJiaXAzOSIsIklNUE9SVF9NRVRIT0QiOiJCSVAzOS5NTkVNT05JQyIsIlNFUVVFTkNFIjoiMTExOTMyIiwiU0lHTkVEX1RSQU5TQUNUSU9OUyI6e30sIlZPVEVTIjpbXSwiVk9URVNfQVZBSUxBQkxFIjowLCJWT1RFU19VU0VEIjowLCJXQUlUSU5HX0ZPUl9PVVJfU0lHTkFUVVJFX1RSQU5TQUNUSU9OUyI6e30sIldBSVRJTkdfRk9SX09USEVSX1NJR05BVFVSRVNfVFJBTlNBQ1RJT05TIjp7fSwiU1RBUlJFRCI6ZmFsc2V9LCJzZXR0aW5ncyI6eyJBVkFUQVIiOiI8c3ZnIHZlcnNpb249XCIxLjFcIiB4bWxucz1cImh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnXCIgY2xhc3M9XCJwaWNhc3NvXCIgd2lkdGg9XCIxMDBcIiBoZWlnaHQ9XCIxMDBcIiB2aWV3Qm94PVwiMCAwIDEwMCAxMDBcIj48c3R5bGU+LnBpY2Fzc28gY2lyY2xle21peC1ibGVuZC1tb2RlOnNvZnQtbGlnaHQ7fTwvc3R5bGU+PHJlY3QgZmlsbD1cInJnYigyMzMsIDMwLCA5OSlcIiB3aWR0aD1cIjEwMFwiIGhlaWdodD1cIjEwMFwiLz48Y2lyY2xlIHI9XCI1MFwiIGN4PVwiNjBcIiBjeT1cIjQwXCIgZmlsbD1cInJnYigxMzksIDE5NSwgNzQpXCIvPjxjaXJjbGUgcj1cIjQ1XCIgY3g9XCIwXCIgY3k9XCIzMFwiIGZpbGw9XCJyZ2IoMCwgMTg4LCAyMTIpXCIvPjxjaXJjbGUgcj1cIjQwXCIgY3g9XCI5MFwiIGN5PVwiNTBcIiBmaWxsPVwicmdiKDI1NSwgMTkzLCA3KVwiLz48L3N2Zz4ifX19fQ==";
		await expect(subject.import(data)).resolves.toBeInstanceOf(Profile);
	});

	it("should import ok with password", async () => {
		const data =
			"NjM4ZmFkZjA1YmE1MWU3MWZiN2IyNTdmYjFiMzUzNWM6NjI0NjU3NmU0MzJiNmYyYjcwNjk0NjZmNzA2MjUxNGU0Yjc0NGE0MjRmNDI0MTMxMzI0YTJiNWE1MjY1NDY3MjdhMzczNzcxNTc3NDZkNzA1YTM3MzM3NDQ1NzY0MTJiNDg0ZjRjNTE1NTUzNjg2ZTQ3Nzc2YjZlNzQzMzQ4NTUzNDYxNTkyZjQzNmI2OTdhMzE1NDQ5NDE0YjU0MmI0MTY4NmI0MTRlMzY0YTUyNTg1MDQ5Nzg2NDcwNzM0NzU3NmY1MzdhMzY2NTU1NGM3MTMzNTkzMzU1MmI1NjRiMzc0NTMxNzk0ZTY1NmY0NzRkNDU2NTQzNjk3YTRjNWE2MTc5NTY1ODQ4Mzg3MTc1NjQ2ODc0NTU0ZDRmNzE3MTQyNmU3Njc4NDM2ODMxNDM1ODMwNDEzMDJmNTc3MTY4NzM3NTMzNzUzODUwNTczMDYxNmY3NzJiNGQ0MzUwNmUyZjRmMzIzOTM3MzMzNTRmNjU0YTc2NDgzNDZhNDk2YjZkNTIzNDM0NmE0NTU4MmY0NTU2NDQ1NjU4NTMyYjQ4MzQ1YTUyNjQ2OTQzNDQ2ODRiNmIyZjQyNmIzMTcxNTQ2OTM2NDY2OTYxNGY1MTMyNTU3NjM2NDE2MTU0NWE3NTM1NTQ2ZjQyMzU0ZjYzNDI3NDU5Njk1MjVhNDI1MzQ2Mzk3MjM0NDE1MjZiNDI3NzU3NTE3MDc1MmY2MzQxN2E1MDQ3NzYzNzMzMmI1NTJiNDU2ZTQ5NDQ0ODU3Nzg2ZTRkMzIzMzY5NTA3YTQ4NzM2YTU5MzgzOTQxMzE1MDc4NGE1YTQ4Nzg3NTYyMmI2MTc5NGE0NDJiNmU2OTU3NGQ0MTUzNjY1NTM2NDM0MTQyNzc3MDVhNGU0NDY1NmU0NjQ0NjI0ZjQzNGY3NDQ4NjM1ODYxNzI1ODQ0NjM3MjMzNTEzMDMzNGMzNjM1NjE2NjM4NzEzMzZjNGQzOTU4MzY3YTUzMzY2Mzc4MmI3MTRkNTI0YjQ1NDc2NzJiMzk1MDUyMzA3MjM2NmYzNjRjMzI2MTcxNDk2ODY2MzI3NzY4NzEzNzY0NzA3NTU2N2E0MTMyNDQ2NzU1NDM3ODcxNTI1MTYzNDg0YTRjNzM1YTRlNjY3MzYyNjg3NjY5NjY1YTcxMzE0ZTQ1NjE3MzY1NzM3MjVhNzQ2NDRhMzI3MDcxNDE3MzdhNTQ0ZTRmMmI0ODMzNDQ0NjM3NDMzNDU0NGEzODM5Nzk3MDZkNTkzMDZjNzY3NDcyNzY0ODQ2NTU1ODQ3NzE1MjVhNmU2YjY0NGIzOTQyNmE1MDVhNTk3NzQ4MzI2ODM2NjY1NzQ1NjQ1YTM5NzI3NzY3NGM2ZTdhNGY1NTZiNjEyZjc4MzM0YzM1NmM1NTU5Njc2MjJmNzQ2ODY0NjczMDQ3NDI2OTYzMmI2NTM3NGQ3ODUyNDE3YTZiNGU3NDRjNmQ1OTM2NjY3MzZjNzk2YjUzN2E0MTZkNzMzNzM0MzUzMjMwNjM3MzQ0MzQzNDc1NDk2MzM2NTY0NjU3NzM2OTQ2Nzk3NTMyNTc1NjM4NTQ0MjRiNDIzNDM1NTE3YTM5NzgzOTM4MzkzMjYzNTI0MjY3NTEzMTU5NWE0MTY4Mzg1NjU5NDU1NzQ1NGIzNzQzNjg3NDU3NDc3ODU3NTEzMzM5NzY0YzQzN2EyYjY5NDY0ZTY3NjE3MzM4NjQzMDRhNDk2NzRlNDE2YjQ5NDEzODM2NmY3MTZhNTU1ODcxNDc2NTU2MmIzMjM3MzM3YTM1NmYzNzQzNjYzMDQ5NmE2OTZjNGIyZjU2NDYzNjQxNzQ1MDUyNGIyYjRlMzkzNjZkNTY2ZTM1NzA1NzU5MzU2NjYzMzA2ZDYyN2EzODc0NTc1ODRjNmY0NTVhNDc1NTU5NTc0ZTMzNTA0ZTMxMzE1NDU0NDU3ODJiNzk2YjY4NDc0YzdhNGI1ODY0N2E2OTY1NDU2NzU0NzE2MjVhNmE3NTMxNjg1ODQyNmY1NjRkMzc3OTYxNDQ2NjZjNGM2MzY5NmU2YTRhNmE0ZDc0Nzg0ZDZiNzczNTY3NGM2NzRiMzg2Njc1MmY3NTQ3NDU3NDZlNjc3OTM2NzY2MTU4NGY0MjQ1MzA2MTM1NTU1OTY4NjU3OTMwNGQ0OTY1NTM0YjMzNjg3OTY4MzE0NTQ2MzIzMzQ0NmM0ZDQyNzg2YTZhMzc2MzZiMzMzNzZiNmI0YzMyNDg3OTc3NmM2ODRmNzU3MTYxNjY0YzZlMzQ0YzRkMzk0ZTZiNjE2MTYzNzIzOTZlN2E0OTQzMzY1MzZjNTI2ZTU3Njc0YzcyMmI1MDQzMzQ1MzUxMzI3OTYzNjQ3MTQ0Mzg3NDZiNmM3MDc4NzM2ZDUzNzM2YTc1NGY3NjQ3NjczMjZmNjM0MzYyNzk3YTMxNTE2ZjRiMzE0NjZmNTI1ODZjN2EzMDRkNTA1MTZjNTQ3YTZjNjU3MzQxNGI1NzcxNGMzNTJmNmE0ZDRmMzA0Yzc1N2EyYjYyNGI2NDMxNTg2NTQ0MmY3NjUwNmE0ODY3MmY1Mjc0NGI0ZDc0NzU3MDMxNmY0YjZjNTczNTRlNzY0NjUwNTI3MTM1NzMzOTczNGI0NTZmMzI3OTMzNTc3MjZiNDUzOTU4NDEzODRlNmQ0NTU1NTk0MzQ0NTczMTU0NmM2Mjc2NGQ3MjZhNzg1NjMxNTQ2MzQzNGY3MDdhNzI3OTMyNmQ0NTMwNGE2MTU3NjgyYjY1NGM1NjcyNmQzODM4NDI2YzRjNTI2ZTQyNGUzMTM2Njk0YjM4NGM0MzM0NTIzODUzNjIzMDUyNDY0ODQxMzI1YTRkMmY1NzU4MzA1MzY3NzM0Zjc0NTgzNTY4Njg1ODY1NTY0ODZiNGQzMTc0NmQ0ZTc5NTE2OTY3MzM0ODU2NmY0MzMzNjU3NTZhMzY0MjM5NzY1NzJmNzc2ZTMwNzg0NDZmNjczOTUyNmIzNzM3MzM2NjMwNjQ1OTcwMzc2ZTRjNGM2Mjc0NTA2ZDY3MmI1YTQyNGI2NDJmNjY2YTU3Nzc2ZDc0NDkzNDU0MzYyZjYzNjc1MzczNGEzMzMwNmMzNDU5MzA0NjMxNmY2ZTZkNDMzNDMwNzUyZjZlNGE0OTY1NTc3NTM3NjE1MjM2NGQzNzUyNTM2OTZjNzU3Njc2NmMyYjcxNzk0MjcyNjU2ZTYzNmE0MjRlNDM1NzQ4MzA0Nzc5NjQ3OTc0NDQ0ZTczNzI3YTJmMzE0NTQyNzU3YTY2NjQzNzQyNTI1OTZlNjg1MTQ0MmY1ODUwNjM2YzQzN2E2YjRhMzk2ZjY2N2EzNDYxNDY1NTRlNWE2MjYzNzMzODU3NTM0YTQ3Nzk2MzQ1MmIzNDRhNDM2MTM2NjIzOTZkMzU2NzY3Nzc3MTUyMmI2NzYxNDc0YjcxMmI2NzYzNmIzNjc4NzQ0OTMzNGU2OTZiNjY2ODc3NGM3MzY3Mzc3MTQyNmU2NzdhNzQzNDRiMmY0NTMxNmY0ZDM0NDg1NjczNTA2OTY1NTMzMTRmNDM0NjY5NTU0YTMyNjY1NzQ0MzM2NzM3Njc0NjUwNTg3MjY2Nzc1NTc5Njk2YjMxN2E1NDY5MzY1MzRjNTA2OTZjMmY3YTRlNGE2YTU0NjI1NTY1MzM0YjQ3MzQ3MDczNGUyYjZmMzU0NTU0Mzg1MzM0NDU0ZDZlNTU3NDQ4NmY0YjRlNzM3NDYzNDQ2YjJmNjczNzQ1NjQ1MzQ2NjQ2ODZiNmI0NDVhNTIzNzM1NjczMTJmNmI0OTU2Mzg3MDRlNGE2YTM0NzQ3NjQxNWE3MjMzMzI1MzZiNTM2NDRmNTU2NDRmMzgzMjZlMzQ0MzZkNzc0YzU4Njk0NTcyNTc1ODZiNzM3NzU3Nzc1NTc2NjY3NTY4NDI1ODMwNTc2MjdhNzE2YzMyNzc2NTQzNTY2MTcxNzE3ODM0NmI0NDUyNTc0ODM0NTgzNDU1Nzc2MzRkNTEyZjM4NTY3MTcxNzI2MTVhNjE0YjcxNTM2ODRmNzUzNTRmMzQ1MTQ1NDE0NzQ3NmM1OTUxNTA2NTc1NmY2NDZiNzYzNDZkNmI3MDM5NTE3MzUwNjk0YzY1NmEzNjVhNzkyZjVhNGM1MzU0NjU2YzZhNzU3MjZhNDQ0ZTY5NDU2NzZkNjI0Njc4Mzc1NDM4NjY3NDYyNzc3NDcyNDM1MDQyNTg1OTczNTI1MzcyMmI2OTQxNmMzMjJmNmU0Yzc0MmI0OTc5NzYzMjY1NjY0OTQ2NmQ2YzMxMzk2YzZlNjg2NjMxMzMzNzRhNjM1YTc5NzA2MjM1NGQ0YzUwNjc2YTZmNDE3NTZhMzU3NjcxNTk1NDY1Nzk1NzQxNmI2NjZkNGE2MjczNTU3NjRmNGM1MjYxNjc1YTM3Njk1NDQyMzY0MTM4NjEzOTYzNGYzOTZiMzA2OTc2NzkzOTVhNjE0ZTQ4NDU2NjY3NGI0OTVhNTA1MDY0NmY1NzM5NzE2OTczNjI1MTQ1NTkzODJmNGU2ZDY4NTA0NzM2NDMzNjU0NzQ0MzY5NTM3OTZjNTY3NDZhNjEyYjYyNWE0MjYyNGI1NjZiNTQ3OTMyMzc1MDU5Nzk0YTZlNGI1OTc1NmEzNzZjNmIzOTZlNDk0OTJmNTk2ZTY1NGQ3YTc3NTM0MTQ4MzgzNDc5NGE2MzdhNGE2ODc4NmYzNjZhMzc2MjQ2NTA0NTc4NTU0ODRmMmY2ZTcwNzI3NDc2NzUzMTU1MmY2MjRiNjY3NTc1NDk0NzczNzUyZjZmNDI1NzYzNGI3OTM2NzI2NDYxMzU3MjZmNzY0ZjY2NjkzNDQzNDc2YTVhNmQ1Njc3NzM2YTc5MzU0MzQyNzcyZjc1NmQ1MDMxNDY0OTUyNTU2OTJiNGI3OTYzNDk1MTMxNjEyZjY4Nzk0MjM1Nzg1NjMwNTk2YjQ0NTI0MzY1NjM2MzZjNjc2ODM4MzA0YjRlNTM0YzY1NmY2ODYyNDU0ZDZjNWEzMzMwNmUzMTU0Nzk2ZjQ5NTM3ODU0NDk1OTMzNjk0ZDcwMzU3NDYyNzUzNDc1NjQ3NDM5NGY0MTY2NGQ1YTU3MzM3YTUzNGU0YTYyMzA1NTc4NmE3NDc5NGY2YjUwNTE2OTQxMmY0YTJiNjczMDcyNmY2YzY3MzU3NzY4NTU3NjJmMzY2YzM2NDUzMzM4NDU0ODZjNjM1YTRmMzA2NDY0NmI2ZTQ2NmQ3MzU5MzA2MzU3NmMzMDU1NzI3MDYzMzU2ZDQ1NTk2ZTRhNDU1NzdhNDc1ODc4NmM2ZDQ3Mzg3YTRjNWE2MzczNjQzMDU1NGI1NDVhNDQzODQ0NjY3MTUzMmYzNjM1Nzc2NjZjMzU1MDU0NGY2ODc5NzYzMTUyNjc0ODZkMzQ1NzQ2MzY0ZjM0NzEzNzU0MzE2YzczMzg2YzY2NTE3YTZlNzc3NjQ3MzczMjUxNGI3NTcxNmEzNTZiNmQ0ZTZjNTE0NTQ0NmY1OTcwNzI0ODU3NzQ3NDU3NDE0MzQxNTUzMTUxNjE1MDJiNjE3NzRmMzMzNTM5MzU3MTZkNjg1ODUwNTc0YTYzNjg1ODYxNzc0ZTYxNDMzNjYzNjQ1MDYxNzA2OTQxNzA0MzU4Nzg1NTczNTA1NjZlNTQ1MDU3NjE1MTYzNDc2YjU0Nzk2YjU3NDUzMzYzNDY0ZDU0NGI2NTMwNmIzMTM0NzEzOTUzNzIzODM1NmY2YzZkNjg2ZDZjNGM2ZDM2MzEzODU2NTU1MjRhNTg1OTM4Mzg2YTc2NmY3NTc2NGE1YTc4NzU1ODUzNTAzOTUyNTA0ZDRiNDE0ODU3Mzk1MTQxMzE1MjM4NTM2YjM3NzQ1NTQzMzI1NTUyNjI2NjQ4NjgzNzQ0NDY2OTY5NTA0YTM3NTI3NzM4Mzk0YzUwNzc2ZDZhNzE0OTMzNDY2NDZlNmY1YTUxNDE3YTUyMzQ0MjU5NzY2NjRlNTQ3MDYxNmUyYjZjNTI1NTMyNjU2ZDQ0MzMzOTZiMzU2MTY3Mzk1MjZmN2E0MzVhNjE1ODM0NzI3MDM4NDg1MDU3NmQ0MzY1NGMzMDU0NDM1NDQ1NWE1ODUyNjQ0YjM0Njc2MzUwNzAzMDdhNzQ0MTRiNDI0ZTYyNDc3MDU5MzQ0YTZkMzU3MjM2NTU2MTQ0NmU0YTUzNTA0Nzc1NzUyZjU0NTg3YTczNmI1YTJiNzY2MjY2MzA3NDU2NTkyZjc3NzQ1MTY2Nzc1ODU2NWEyYjZlNjc0YjY1Mzk3MzU0NTU3MTQ2NmI2MzQ3NmE0ZTM0NTI3OTUyMzQ3MTUzMzE0ZDQxNzIyYjU2MmY0NDY4NTE0OTQ5NDQ3Mzc0NmE2ZjQ3NTI0NjRjNTY0NzZmNTIyZjQ2NTM0NDZmNjk1NzMyNDM3MjZhNmQzMjQ0NDY2ODQzNDY0MjVhNjQ2ZDU5NDk2ZTY1NTY1OTQ1NjcyYjUwNzc0NjQ1NzI0Njc2NmE0ZDZiMzMzNDRlNzk0MzY2Nzg1NTU4MzY3NDcyNTMzMTc3Njk0YzU0NDM0ZTcwNDI2OTMyNzc2ODRjNzY1MTU3MzgzMzM3MzE1OTYzMzMzMzM4NTE3OTRlNDMzMzRiNDQ0YTZlNjI2YjQxNzg3NTM3NDc1MDRkNmU0YTM3NGU1YTdhNDczMTc2NmE0NDU1NTQ3ODYyNDM0NzYyMzc2ZTU5NTc2ZDRlNmQ2MjQ5NmE2YTYxNDI0NDc2NTA1MTU5NDM2ZjY1NmE2OTZjNTYzOTY3NmE0MjUwNjg1MTQ4NTY0YjU2MzMzMDM3NTEyYjU4NzE1NTc1Mzg1MzQzNTM1MDU4NTc3YTZjNzc1NTU4NmE0OTcwNGI3NTMxMzk2YzY5Njg2YzRjNzI0ODc1NmE1MzZlNDcyYjUzMzMzNjZmNGE0Zjc5NTA0NTQ5Mzg3NDQxNjk2NzQ4NjU3OTUwNmY2MTJiNTQ0ZTc5NmY1NjQ3NzQ0Zjc4NDQzMDU4NmQ3NTRiNzM0ODc0NzE0YjQ5NGY0NDMyNzkzMDc3NDQ3NDMzMzM1NjRjNmM1NjQ2NDg1NTQzNGM2ZjM3NzYzMjc2NmE2ZjZhNTk0MzZhNGM0ZjMxNGI0YTQzMzU0NDY5MzAzODM2NzY2ZTM3NmE0ZDVhNGU1Mjc2NDk3ODZhMzA2NzUyNTczMDU3NzI2YTU1NjE0ZDMzNzYzOTUyNzMzMzY0Njc2ZTMxNzU2NDcwNTc2NDc2NTM0MjdhNzkzOTJiNGY3MDc3NTk2MjZiMmI3MjM2NDU3MjU0NmI1NzUyMmY1NDcyNDk3Mjc2NzI1NDYyNmMzODQzNDQ0MzMyNjc2ODczNjI2NTU5NzMzNzQ2NDI0Yjc5NTA1NTM0MzA0OTczMmI2YjMyNGI3OTM4Nzg2OTU5NzI3NTRmNDE3NDY4NGM1NTY1MzgzNTc5NGUzODQ5NTM2YzY1NTg0ODRjNmE3OTQyNTA2YTUwMzk2YzY4NDk2NTZlNzQ0MjUzNjgzMzY3MzY3NjVhNmM0OTU4NzA0OTM4NDE3MzY5NjY2MTY5NjQ1YTQzNjg1NDRkNjU3MjY0NTI0MzU0Mzc1NTZhNjg2MTQ0NGYzMjZhNzM0NjUyNjQyYjQxMzU0OTU3NzA1MzQ0NjY2MjRmNWE0ZjY0NTY2YTRmNGM0YTcyNmY0MTVhNGQzMTc5NjQ2ODMxNDM2MzRmNmM0ZDZmNjM3MTQ1Mzg0ZDU5MmIzOTVhNzU1MzM0NGYzMDMxNzUzMDM0NjM1MDZiNzUzOTM0NDE3MjMxNDQ0ZTJmN2EzMjdhNTA3NjRkNDQ2NDczN2E2OTQ1MzA3MjY2NTI1NTcwNDM2OTQzNzA3NjRmNGM1MDJiNmE0MzU3MzA3NTRkNmM0NzY2NGE0NjcwNzg2MTY5NjY3MjQ2NjUzMDUyNGU2NDUzNzk2MTY4NDQ3NzM2NDMzNTYxNzQ=";
		await expect(subject.import(data, "some pass")).resolves.toBeInstanceOf(Profile);
	});

	it("should restore", async () => {
		subject.flush();

		const profile = subject.create("John");
		await expect(subject.restore(profile)).toResolve();
	});

	it("should dump", async () => {
		const profile = subject.create("John");

		expect(subject.dump(profile)).toBeObject();
	});

	it("should restore and mark as restored", async () => {
		subject.flush();

		const profile = subject.create("John");

		await subject.restore(profile);

		expect(profile.status().isRestored()).toBeTrue();
	});

	it("should persist profile and reset dirty status", async () => {
		subject.flush();

		const profile = subject.create("John");
		profile.status().markAsRestored();
		profile.status().markAsDirty();

		expect(profile.status().isDirty()).toBeTrue();

		subject.persist(profile);

		expect(profile.status().isDirty()).toBeFalse();
	});

	it("should not save profile data if profile is not restored", async () => {
		subject.flush();

		const profile = subject.create("John");
		profile.status().reset();

		const profileAttibuteSetMock = jest.spyOn(profile.getAttributes(), "set").mockImplementation(() => {
			return true;
		});

		expect(profile.status().isRestored()).toBeFalse();
		expect(profileAttibuteSetMock).toHaveBeenCalledTimes(0);

		subject.persist(profile);

		expect(profile.status().isRestored()).toBeFalse();
		expect(profileAttibuteSetMock).toHaveBeenCalledTimes(0);
	});

	it("should not save profile data if profile is not marked as dirty", async () => {
		subject.flush();

		const profile = subject.create("John");

		const profileAttibuteSetMock = jest.spyOn(profile.getAttributes(), "set").mockImplementation(() => {
			return true;
		});

		profile.status().reset();
		expect(profile.status().isRestored()).toBeFalse();
		expect(profile.status().isDirty()).toBeFalse();
		expect(profileAttibuteSetMock).toHaveBeenCalledTimes(0);

		await subject.restore(profile);
		const profileDirtyStatusMock = jest.spyOn(profile.status(), "isDirty").mockReturnValue(false);
		subject.persist(profile);

		expect(profile.status().isRestored()).toBeTrue();
		expect(profile.status().isDirty()).toBeFalse();
		expect(profileAttibuteSetMock).not.toHaveBeenCalled();
		profileDirtyStatusMock.mockRestore();
		profileAttibuteSetMock.mockRestore();
	});
});
