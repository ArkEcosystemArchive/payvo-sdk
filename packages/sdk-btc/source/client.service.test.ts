import "jest-extended";

import { IoC, Services } from "@payvo/sdk";
import { DateTime } from "@payvo/intl";
import { BigNumber } from "@payvo/helpers";
import nock from "nock";
import { createService } from "../test/mocking";
import { SignedTransactionData } from "./signed-transaction.dto";
import { WalletData } from "./wallet.dto";
import { DataTransferObjects } from "./coin.dtos";
import { ClientService } from "./client.service";
import { ConfirmedTransactionData } from "./transaction.dto";
import { ConfirmedTransactionDataCollection } from "@payvo/sdk/distribution/collections";

let subject: ClientService;

beforeAll(() => {
	nock.disableNetConnect();

	subject = createService(ClientService, "btc.testnet", (container) => {
		container.constant(IoC.BindingType.Container, container);
		container.constant(IoC.BindingType.DataTransferObjects, DataTransferObjects);
		container.singleton(IoC.BindingType.DataTransferObjectService, Services.AbstractDataTransferObjectService);
	});
});

afterEach(() => nock.cleanAll());

describe("ClientService", () => {
	describe("#transaction", () => {
		it("should succeed", async () => {
			nock("https://btc-test.payvo.com")
				.get("/api/transactions/68ad0264053ab94fa7749e78d2f728911d166ca9af8dbb68e6ee264958ca7f32")
				.reply(200, require(`${__dirname}/../test/fixtures/client/transaction.json`));

			const result = await subject.transaction(
				"68ad0264053ab94fa7749e78d2f728911d166ca9af8dbb68e6ee264958ca7f32"
			);

			expect(result).toBeInstanceOf(ConfirmedTransactionData);
			expect(result.id()).toBe("21c0cdf1d1e191823540841dd926944e7bc4ee37a7227ec9609ad9715227a02d");
			expect(result.type()).toBe("transfer");
			expect(result.timestamp()).toBeInstanceOf(DateTime);
			expect(result.confirmations()).toEqual(BigNumber.make(159414));
			// expect(result.sender()).toBe("...");
			// expect(result.recipient()).toBe("...");
			expect(result.amount()).toEqual(BigNumber.make(3050000));
			expect(result.fee()).toEqual(BigNumber.make(10000));
			// @ts-ignore - Better types so that memo gets detected on TransactionDataType
			expect(result.memo()).toBeUndefined();
		});
	});

	describe("#transactions", () => {
		it("should succeed", async () => {
			nock("https://btc-test.payvo.com")
				.post("/api/wallets/transactions", { addresses: ["12C1rVsgUUNKfFYWQ9X18M38c4hsGV9T5w"] })
				.reply(200, require(`${__dirname}/../test/fixtures/client/transactions.json`));

			const result = await subject.transactions({ addresses: ["12C1rVsgUUNKfFYWQ9X18M38c4hsGV9T5w"] });
			expect(result).toBeInstanceOf(ConfirmedTransactionDataCollection);
			expect(result.currentPage()).toBe(1);
			expect(result.getPagination().last).toBe(1);
			expect(result.getPagination().self).toBe(1);
			expect(result.getPagination().prev).toBeUndefined();
			expect(result.getPagination().next).toBeUndefined();

			const transaction = result.items()[0];
			expect(transaction).toBeInstanceOf(ConfirmedTransactionData);
			expect(transaction.id()).toBe("21c0cdf1d1e191823540841dd926944e7bc4ee37a7227ec9609ad9715227a02d");
			expect(transaction.type()).toBe("transfer");
			expect(transaction.timestamp()).toBeInstanceOf(DateTime);
			expect(transaction.confirmations()).toEqual(BigNumber.make(159414));
			// expect(transaction.sender()).toBe("...");
			// expect(transaction.recipient()).toBe("...");
			expect(transaction.amount()).toEqual(BigNumber.make(3050000));
			expect(transaction.fee()).toEqual(BigNumber.make(10000));
			// @ts-ignore - Better types so that memo gets detected on TransactionDataType
			expect(transaction.memo()).toBeUndefined();
		});
	});

	describe("#wallet", () => {
		it("should derive addresses from xpub", async () => {

			nock("https://btc-test.payvo.com:443", { "encodedQueryParams": true })
				.post("/api/wallets/addresses", { "addresses": ["mvVAfs3MCDYg7HokDhL6pPuef6KZLPdUUz", "msy7ZqCfVFBuNAf4GJSEnrpc9HMpn6mPV2", "n4pMT65JrzLCfA6ErNX63yb6GvcA2oMwtA", "mjJ7AvduauMXmtj8AcxfkdJkjhYcKqChJR", "mm9gzxT8zh7Beo1wxmNKSgePXVSEYSrCrM", "mjTHjhtECpHPpTckxqUuEirexUoXnVa2C4", "mhn5Lm29KHQpSFb888Ne2N8sjCoTstAAAq", "mrHYgvzE2xAL7sxVfJDP4WuGUP181RvBr3", "mnL5PvKG4GXwX3AYLSx75S98vFeFteBJRq", "mn6RriDhuTh9DrXX8WwKmHBpMFkXpU4w4A", "msR3m6CyXZ9bTG5ooQDcbwEtzwgAsKrKDw", "n3kvzGysEJ3XuzecWaAtBTxjnpD4BZAiYe", "n2bKDbjXLj3QYLMfBmd9GVcy1c19wJUxWi", "mxyZfgBZo7goEiMFz4ZfXpWjqxGdfJnckQ", "mhThc9DvGgJZZoDf3JxE8mHpcTS8wBoiDH", "mzTxEzujzS2bMD9BWYck2U7k9m79grRnaw", "mpfthavUUarbK8vBkrLEqBX3SDaj8632Af", "moyKoZsCf6UP8X4HkRxdKmq5ihamCNpxon", "mksdPb37aU3QwvdHS3Q442PiPX1qxhquq3", "n4gPfaKpeLpTUyazt296bHf3hj6ZB7H2wc"] })
				.reply(200, {"data":{"mvVAfs3MCDYg7HokDhL6pPuef6KZLPdUUz":true,"msy7ZqCfVFBuNAf4GJSEnrpc9HMpn6mPV2":false,"n4pMT65JrzLCfA6ErNX63yb6GvcA2oMwtA":false,"mjJ7AvduauMXmtj8AcxfkdJkjhYcKqChJR":false,"mm9gzxT8zh7Beo1wxmNKSgePXVSEYSrCrM":false,"mjTHjhtECpHPpTckxqUuEirexUoXnVa2C4":false,"mhn5Lm29KHQpSFb888Ne2N8sjCoTstAAAq":false,"mrHYgvzE2xAL7sxVfJDP4WuGUP181RvBr3":false,"mnL5PvKG4GXwX3AYLSx75S98vFeFteBJRq":false,"mn6RriDhuTh9DrXX8WwKmHBpMFkXpU4w4A":false,"msR3m6CyXZ9bTG5ooQDcbwEtzwgAsKrKDw":false,"n3kvzGysEJ3XuzecWaAtBTxjnpD4BZAiYe":false,"n2bKDbjXLj3QYLMfBmd9GVcy1c19wJUxWi":false,"mxyZfgBZo7goEiMFz4ZfXpWjqxGdfJnckQ":false,"mhThc9DvGgJZZoDf3JxE8mHpcTS8wBoiDH":false,"mzTxEzujzS2bMD9BWYck2U7k9m79grRnaw":false,"mpfthavUUarbK8vBkrLEqBX3SDaj8632Af":false,"moyKoZsCf6UP8X4HkRxdKmq5ihamCNpxon":false,"mksdPb37aU3QwvdHS3Q442PiPX1qxhquq3":false,"n4gPfaKpeLpTUyazt296bHf3hj6ZB7H2wc":false}}, []);

			nock("https://btc-test.payvo.com:443", { "encodedQueryParams": true })
				.post("/api/wallets/addresses", { "addresses": ["mzXqh3GSAkRF83HA9xXvgkCsUMPhtbpF47", "mvRPTy61Eu5FuQkKSD9RschXsCcgT7F9Ke", "mfnKdSFaXGTgjd67xZrPMrxamBxuk9JfwF", "miqgjnVTsheUs75EQ7W6MVN2ScvP7uB8MX", "mtqgfbjZ9tstZtr3jyVKNzjPsfvKgqwdsh", "mj6WUpsrEE1DKyyh6Tt4dL4Q6ovYMJXDqv", "n2GwVELhoFabFoideHVSfimb66wUGHPzmp", "mi55ngoeJQUmZ8ewxe799pQ744JkMbCjcr", "mtd1drZCsnBXSnNhHj74N42xrXdTNQefbG", "moAgQVoviA2D2aQV2jB9CRyjQF4KcWJg1t", "mtoy82b6JjSjU44YMm49bUW3kkrgcA7eEL", "mvXQdC1Jup75WNTry5zx7iaYb6UFWtgt4o", "moa9QDEacjkayZ5VbWTTfCNkjKAVxgiX7K", "moyESkaN1TDxtdcMFk5LTU8EcB7tP2eSgJ", "mpRcrvTbFmwymYgW79m8tE5ANWJEGhBq2s", "mwcQ2Kd7fKqH9x7cWgMksmKy6UL8BYZFbc", "mnR7bePTUyRvm4Vu4EkvYrbc7UbLF7aiwi", "mqvktLDsBXL7WVLamv9XAaNw3mProXaah3", "mhCKygbPwuUojtMXKn5ugoDzfTyMxFek6D", "mhPGchVv6RRVAGBwGNNBzNpumQk2YGm9Gp"] })
				.reply(200, {"data":{"mzXqh3GSAkRF83HA9xXvgkCsUMPhtbpF47":false,"mvRPTy61Eu5FuQkKSD9RschXsCcgT7F9Ke":false,"mfnKdSFaXGTgjd67xZrPMrxamBxuk9JfwF":false,"miqgjnVTsheUs75EQ7W6MVN2ScvP7uB8MX":false,"mtqgfbjZ9tstZtr3jyVKNzjPsfvKgqwdsh":false,"mj6WUpsrEE1DKyyh6Tt4dL4Q6ovYMJXDqv":false,"n2GwVELhoFabFoideHVSfimb66wUGHPzmp":false,"mi55ngoeJQUmZ8ewxe799pQ744JkMbCjcr":false,"mtd1drZCsnBXSnNhHj74N42xrXdTNQefbG":false,"moAgQVoviA2D2aQV2jB9CRyjQF4KcWJg1t":false,"mtoy82b6JjSjU44YMm49bUW3kkrgcA7eEL":false,"mvXQdC1Jup75WNTry5zx7iaYb6UFWtgt4o":false,"moa9QDEacjkayZ5VbWTTfCNkjKAVxgiX7K":false,"moyESkaN1TDxtdcMFk5LTU8EcB7tP2eSgJ":false,"mpRcrvTbFmwymYgW79m8tE5ANWJEGhBq2s":false,"mwcQ2Kd7fKqH9x7cWgMksmKy6UL8BYZFbc":false,"mnR7bePTUyRvm4Vu4EkvYrbc7UbLF7aiwi":false,"mqvktLDsBXL7WVLamv9XAaNw3mProXaah3":false,"mhCKygbPwuUojtMXKn5ugoDzfTyMxFek6D":false,"mhPGchVv6RRVAGBwGNNBzNpumQk2YGm9Gp":false}}, []);

			nock("https://btc-test.payvo.com:443", { "encodedQueryParams": true })
				.post("/api/wallets/addresses", { "addresses": ["n3LhrsyE8g1Ga2XPGuXfRkaPcipevENLre", "n1ii1xkSqM5zTyY4h5zpAnPi86csRbA5ar", "mkEU1tHycuDj2XPcRMBWZHrBvHJXwkcBNR", "my6MACmsGA3MXq73KJwnZwcNYwAYNXGGaM", "mvY8me8vYkKUz8Qn3pFhionqYWDZeiC1hC", "ms9QjBPWq7atAGtp4HrFRUhcuNU2QHj58z", "mtkq8N81uLbazEszNZSij7ago4k6KkfjKk", "mjZij3tVEKKFdyGcUTTkAVDR7jGhUfxEf7", "mhub5yjwn8aktqw2C1hipdYNW83njAgymv", "mjP4YPUBZZW6GaXJJ36W8gfTfxMCfuTvbP", "n2khkbRh2pc8srDNeqM8uEy3n9APaL8KgV", "mtBkrgNXdCX7gBVAugdtNqSq8L56EVV7Uw", "mi5VbkBz7tjfg7AQ2oxxQWj78LDBzhrb3d", "mhbNtdzhrxRLAuajTLYCzaec3DE79GLjwh", "mhuacfeCHWSVweiu6KwDVrTGhsrnCQfTgz", "mtbT1i9DnWaUMiWxUvSR42Ve56KbReKcgg", "mowcx8DHsDBuhKSQ9XBpML9nZSSB2SyJDc", "n2FJRGVUvWEk4rUzfJWkki5jqSg5bBwc98", "n1nSwLjZ54S6k58KBwjdNDuqs1mZSCXx3z", "moGqYcYarUUiLntbqEL3BBkq4XPuGBoVqN"] })
				.reply(200, {"data":{"n3LhrsyE8g1Ga2XPGuXfRkaPcipevENLre":false,"n1ii1xkSqM5zTyY4h5zpAnPi86csRbA5ar":false,"mkEU1tHycuDj2XPcRMBWZHrBvHJXwkcBNR":false,"my6MACmsGA3MXq73KJwnZwcNYwAYNXGGaM":false,"mvY8me8vYkKUz8Qn3pFhionqYWDZeiC1hC":false,"ms9QjBPWq7atAGtp4HrFRUhcuNU2QHj58z":false,"mtkq8N81uLbazEszNZSij7ago4k6KkfjKk":false,"mjZij3tVEKKFdyGcUTTkAVDR7jGhUfxEf7":false,"mhub5yjwn8aktqw2C1hipdYNW83njAgymv":false,"mjP4YPUBZZW6GaXJJ36W8gfTfxMCfuTvbP":false,"n2khkbRh2pc8srDNeqM8uEy3n9APaL8KgV":false,"mtBkrgNXdCX7gBVAugdtNqSq8L56EVV7Uw":false,"mi5VbkBz7tjfg7AQ2oxxQWj78LDBzhrb3d":false,"mhbNtdzhrxRLAuajTLYCzaec3DE79GLjwh":false,"mhuacfeCHWSVweiu6KwDVrTGhsrnCQfTgz":false,"mtbT1i9DnWaUMiWxUvSR42Ve56KbReKcgg":false,"mowcx8DHsDBuhKSQ9XBpML9nZSSB2SyJDc":false,"n2FJRGVUvWEk4rUzfJWkki5jqSg5bBwc98":false,"n1nSwLjZ54S6k58KBwjdNDuqs1mZSCXx3z":false,"moGqYcYarUUiLntbqEL3BBkq4XPuGBoVqN":false}}, []);

			nock("https://btc-test.payvo.com:443", { "encodedQueryParams": true })
				.post("/api/wallets", { "addresses": ["mvVAfs3MCDYg7HokDhL6pPuef6KZLPdUUz"] })
				.reply(200, {"data":{"balance":100000,"address":["mvVAfs3MCDYg7HokDhL6pPuef6KZLPdUUz"],"publicKey":"figure this out"}}, []);

			const xpub =
				"tpubDCzoRb9kb5qSjv1RcX5g4bJ9h28uuaqeuEhFmHCgtGRuoxB121X1e4DSwq44AD1gv7Lu33ije8b4b7fX8oXp3h28CRycqJkFJRd7GSSV7YK";

			const result = await subject.wallet(xpub);

			expect(result).toBeInstanceOf(WalletData);
			expect(result.address()).toEqual(["mvVAfs3MCDYg7HokDhL6pPuef6KZLPdUUz"]);
			expect(result.publicKey()).toBe("figure this out");
			expect(result.balance().available).toEqual(BigNumber.make(100000));
		});
	});

	describe("#broadcast", () => {
		it("should pass", async () => {
			nock("https://btc-test.payvo.com")
				.post("/api/transactions")
				.reply(200, require(`${__dirname}/../test/fixtures/client/broadcast.json`));

			const result = await subject.broadcast([
				createService(SignedTransactionData).configure("id", "transactionPayload", "")
			]);

			expect(result).toEqual({
				accepted: ["id"],
				rejected: [],
				errors: {}
			});
		});

		it("should fail", async () => {
			nock("https://btc-test.payvo.com")
				.post("/api/transactions")
				.reply(200, require(`${__dirname}/../test/fixtures/client/broadcast-failure.json`));

			const result = await subject.broadcast([
				createService(SignedTransactionData).configure("id", "transactionPayload", "")
			]);

			expect(result).toEqual({
				accepted: [],
				rejected: ["id"],
				errors: {
					id: "bad-txns-in-belowout, value in (0.00041265) < value out (1.00) (code 16)"
				}
			});
		});
	});
});
