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
				"68ad0264053ab94fa7749e78d2f728911d166ca9af8dbb68e6ee264958ca7f32",
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
			nock("https://btc-test.payvo.com:443", { encodedQueryParams: true })
				.post(
					"/api/wallets/addresses",
					'{"addresses":["mvVAfs3MCDYg7HokDhL6pPuef6KZLPdUUz","msy7ZqCfVFBuNAf4GJSEnrpc9HMpn6mPV2","n4pMT65JrzLCfA6ErNX63yb6GvcA2oMwtA","mjJ7AvduauMXmtj8AcxfkdJkjhYcKqChJR","mm9gzxT8zh7Beo1wxmNKSgePXVSEYSrCrM","mjTHjhtECpHPpTckxqUuEirexUoXnVa2C4","mhn5Lm29KHQpSFb888Ne2N8sjCoTstAAAq","mrHYgvzE2xAL7sxVfJDP4WuGUP181RvBr3","mnL5PvKG4GXwX3AYLSx75S98vFeFteBJRq","mn6RriDhuTh9DrXX8WwKmHBpMFkXpU4w4A","msR3m6CyXZ9bTG5ooQDcbwEtzwgAsKrKDw","n3kvzGysEJ3XuzecWaAtBTxjnpD4BZAiYe","n2bKDbjXLj3QYLMfBmd9GVcy1c19wJUxWi","mxyZfgBZo7goEiMFz4ZfXpWjqxGdfJnckQ","mhThc9DvGgJZZoDf3JxE8mHpcTS8wBoiDH","mzTxEzujzS2bMD9BWYck2U7k9m79grRnaw","mpfthavUUarbK8vBkrLEqBX3SDaj8632Af","moyKoZsCf6UP8X4HkRxdKmq5ihamCNpxon","mksdPb37aU3QwvdHS3Q442PiPX1qxhquq3","n4gPfaKpeLpTUyazt296bHf3hj6ZB7H2wc","mzXqh3GSAkRF83HA9xXvgkCsUMPhtbpF47","mvRPTy61Eu5FuQkKSD9RschXsCcgT7F9Ke","mfnKdSFaXGTgjd67xZrPMrxamBxuk9JfwF","miqgjnVTsheUs75EQ7W6MVN2ScvP7uB8MX","mtqgfbjZ9tstZtr3jyVKNzjPsfvKgqwdsh","mj6WUpsrEE1DKyyh6Tt4dL4Q6ovYMJXDqv","n2GwVELhoFabFoideHVSfimb66wUGHPzmp","mi55ngoeJQUmZ8ewxe799pQ744JkMbCjcr","mtd1drZCsnBXSnNhHj74N42xrXdTNQefbG","moAgQVoviA2D2aQV2jB9CRyjQF4KcWJg1t","mtoy82b6JjSjU44YMm49bUW3kkrgcA7eEL","mvXQdC1Jup75WNTry5zx7iaYb6UFWtgt4o","moa9QDEacjkayZ5VbWTTfCNkjKAVxgiX7K","moyESkaN1TDxtdcMFk5LTU8EcB7tP2eSgJ","mpRcrvTbFmwymYgW79m8tE5ANWJEGhBq2s","mwcQ2Kd7fKqH9x7cWgMksmKy6UL8BYZFbc","mnR7bePTUyRvm4Vu4EkvYrbc7UbLF7aiwi","mqvktLDsBXL7WVLamv9XAaNw3mProXaah3","mhCKygbPwuUojtMXKn5ugoDzfTyMxFek6D","mhPGchVv6RRVAGBwGNNBzNpumQk2YGm9Gp","my1Qedk3CfmGta8LWKQ7AbjTZCiA55Yt2S","mwB5CuoASxBWoqXBrq7mLYFNdvSrYhRvgm","mperSDrmbXYiu6iwsKKuspm8aPMEphvPWT","mhxa7TrYpBtLUPYmNmy7JsUZk5V2REXVww","mn1yfnj9LoEy9CLHmzw56uSmeyadB4Hzr5","mg7ZjKofdu1PEHjvC4WUrDsoC3nryoNUMH","mqM9sEh2K6bLwzcu5p6Gxxc6qVzFekrTBz","mwrERKNjnPr8tpu3grMy8zgEH68f9sxJx8","mxbLagg9QeW3k1eU9WEPso47f9nSwLhfPu","myWQKwR4iH3vsrdqKpznCPb12EshFSHeQ6","mfo4DWwc97XDr3yu8C8UxBA9djH4CHD7kG","mj7nVSAaV48zHRiiNtE4UCUe2x78tC2Qjp","my5PR9y5a5V23ufKjJ3v8wJpf8DaB7uwiL","mzGiFCYG6bsuuuV22wWt1u7A8UvCNZ8e4Q","myt62zMyGwmHNiV1h9ML6TuzU8nCYvcGpy","mxxFkSeZm6D5E6wjopqa97vszv6rqs9UCD","n4Mw2mYzqNFL8C6M3RNVBxfBRwAN9hcjG6","msJRXNbQkHynga9eW6pFLqAs1eZhzFoWQZ","n2DBGhEALVhmkyL6LzMxdgRh4SF1Ke2Mw9","mpM3wMnFjRUTcDWLcd5DZ51TgeqFw5N2ZM","mfx8pr2V2momqz9St5bbCaHeQCwH41TXne","mswRM5kueZHKkWPweq4nyfFpJRiEQ6UTrj","mhuxUusT441up1qCuKH6dCbdvXNECY14nM","mh5RPyq3Czki5WgWajEvTfE92PWgCiCont","mwxwmMPD27HhiatihhSspcCj4N2LaBrzcj","mmLAdsaK8RUhP7yqhSJM9caW6hrRKisLac","mmT7jzFyYPU6UnVSJ1bjxfJVYN1AKhZWJa","mwKdHeoHC5CPmm9CPRwoiUhwPWMMrosU3e","n3ATQKG5hVCXybev6fjZdZotbT5ih6LFDP","mvYaUg6WrAJWrjVVZBd7nPoe8zXay1tV9i","mhyfefXY1E46vHcdtDiUvY6HfS7LMXtKAJ","mswLRozh5Dpm7M7srHsF6KM3zDFZTJEEVn","mprDv1gvszNaVn47TaWPGgCARWyeq5yD6J","mi9YQP1ju8UjVa3uGA8BHTC3odh3gBJ1QR","mtuVbP91A4c8de2swYdDGyjJFmXjmCHQdz","mvQnYSDVvP6km5cU5TN3aApPKGa5PmFcSw","mk3JiS44hpN4dnnoS45xpuNXoALcEQE4iY","mnSY6sVsCBnHe6PVVVFK6bV6tf3Ri1ykcG","mtsVQhKHxohGeNDPK1epp2DPKT2jmZRn6b","mh7Ur94RHTwgjGteiybQN7nhmWZRKWo9ou","mzLsZTGwRhALkrSC555Fgetym5XLhfpW8e","mfdPbWAXs2sMBWkwGW9KgwGEEjy7R4oWhf","mvJCVH63DnXrzRycMJs15i3MEFQ3ginVvP","mz1ts8kGKWNuyxLBk7vEzsL8og2EPp1Vce","mn31JAtD9YrFPFMJAgQCrd3vi8XZNEA43e","n4bAGQkxXirKau9KNCex7HDY49YnDgsp3g","msbszKYDW4qCB8ueShWEYBuHsfeEBc8fdq","n1Q2zUqpWkkhS28eAtX3deF8xNLUWN3bzP","msmrDofDLBV3pWhbVXhcJo3Qm8VxYuKBL6","mk8gb2D8JNiQijb41NjWSRKBLv7zSVs4j3","mu5BVNMJ5HNrh2FP4t98Qmhfx5T1Gr3isH","mkd7kigFhRAgLXhcDQ12194NDiVKqJrdzF","n2AJmJCtyDiZd66CN9S6RmzTVK9TsCUTzv","mtNoXBnrwBLfwqbJe1syBZwAAsk9E1LpSh","mmnjKUc85eX49Aqnbibo113yba9DqyUUxH","my31AvFqnaRXs2CQdz1t9TXNU1ahZr7kph","mwWNQuwD6u4SmpTxJb8HVoYNDrMap6PYCh","mo5aR4S9JYb3PQpot8wBwhQyEtNp6wsdZb","mjjNUNVcG7qpHQiWhU96MhQVip5Jvw1fME","n3Shrgfben2UAvgqhGo4L9eEpw2ZcQ8Gxf"]}',
				)
				.reply(
					200,
					'{"data":{"mvVAfs3MCDYg7HokDhL6pPuef6KZLPdUUz":true,"msy7ZqCfVFBuNAf4GJSEnrpc9HMpn6mPV2":false,"n4pMT65JrzLCfA6ErNX63yb6GvcA2oMwtA":false,"mjJ7AvduauMXmtj8AcxfkdJkjhYcKqChJR":false,"mm9gzxT8zh7Beo1wxmNKSgePXVSEYSrCrM":false,"mjTHjhtECpHPpTckxqUuEirexUoXnVa2C4":false,"mhn5Lm29KHQpSFb888Ne2N8sjCoTstAAAq":false,"mrHYgvzE2xAL7sxVfJDP4WuGUP181RvBr3":false,"mnL5PvKG4GXwX3AYLSx75S98vFeFteBJRq":false,"mn6RriDhuTh9DrXX8WwKmHBpMFkXpU4w4A":false,"msR3m6CyXZ9bTG5ooQDcbwEtzwgAsKrKDw":false,"n3kvzGysEJ3XuzecWaAtBTxjnpD4BZAiYe":false,"n2bKDbjXLj3QYLMfBmd9GVcy1c19wJUxWi":false,"mxyZfgBZo7goEiMFz4ZfXpWjqxGdfJnckQ":false,"mhThc9DvGgJZZoDf3JxE8mHpcTS8wBoiDH":false,"mzTxEzujzS2bMD9BWYck2U7k9m79grRnaw":false,"mpfthavUUarbK8vBkrLEqBX3SDaj8632Af":false,"moyKoZsCf6UP8X4HkRxdKmq5ihamCNpxon":false,"mksdPb37aU3QwvdHS3Q442PiPX1qxhquq3":false,"n4gPfaKpeLpTUyazt296bHf3hj6ZB7H2wc":false,"mzXqh3GSAkRF83HA9xXvgkCsUMPhtbpF47":false,"mvRPTy61Eu5FuQkKSD9RschXsCcgT7F9Ke":false,"mfnKdSFaXGTgjd67xZrPMrxamBxuk9JfwF":false,"miqgjnVTsheUs75EQ7W6MVN2ScvP7uB8MX":false,"mtqgfbjZ9tstZtr3jyVKNzjPsfvKgqwdsh":false,"mj6WUpsrEE1DKyyh6Tt4dL4Q6ovYMJXDqv":false,"n2GwVELhoFabFoideHVSfimb66wUGHPzmp":false,"mi55ngoeJQUmZ8ewxe799pQ744JkMbCjcr":false,"mtd1drZCsnBXSnNhHj74N42xrXdTNQefbG":false,"moAgQVoviA2D2aQV2jB9CRyjQF4KcWJg1t":false,"mtoy82b6JjSjU44YMm49bUW3kkrgcA7eEL":false,"mvXQdC1Jup75WNTry5zx7iaYb6UFWtgt4o":false,"moa9QDEacjkayZ5VbWTTfCNkjKAVxgiX7K":false,"moyESkaN1TDxtdcMFk5LTU8EcB7tP2eSgJ":false,"mpRcrvTbFmwymYgW79m8tE5ANWJEGhBq2s":false,"mwcQ2Kd7fKqH9x7cWgMksmKy6UL8BYZFbc":false,"mnR7bePTUyRvm4Vu4EkvYrbc7UbLF7aiwi":false,"mqvktLDsBXL7WVLamv9XAaNw3mProXaah3":false,"mhCKygbPwuUojtMXKn5ugoDzfTyMxFek6D":false,"mhPGchVv6RRVAGBwGNNBzNpumQk2YGm9Gp":false,"my1Qedk3CfmGta8LWKQ7AbjTZCiA55Yt2S":false,"mwB5CuoASxBWoqXBrq7mLYFNdvSrYhRvgm":false,"mperSDrmbXYiu6iwsKKuspm8aPMEphvPWT":false,"mhxa7TrYpBtLUPYmNmy7JsUZk5V2REXVww":false,"mn1yfnj9LoEy9CLHmzw56uSmeyadB4Hzr5":false,"mg7ZjKofdu1PEHjvC4WUrDsoC3nryoNUMH":false,"mqM9sEh2K6bLwzcu5p6Gxxc6qVzFekrTBz":false,"mwrERKNjnPr8tpu3grMy8zgEH68f9sxJx8":false,"mxbLagg9QeW3k1eU9WEPso47f9nSwLhfPu":false,"myWQKwR4iH3vsrdqKpznCPb12EshFSHeQ6":false,"mfo4DWwc97XDr3yu8C8UxBA9djH4CHD7kG":false,"mj7nVSAaV48zHRiiNtE4UCUe2x78tC2Qjp":false,"my5PR9y5a5V23ufKjJ3v8wJpf8DaB7uwiL":false,"mzGiFCYG6bsuuuV22wWt1u7A8UvCNZ8e4Q":false,"myt62zMyGwmHNiV1h9ML6TuzU8nCYvcGpy":false,"mxxFkSeZm6D5E6wjopqa97vszv6rqs9UCD":false,"n4Mw2mYzqNFL8C6M3RNVBxfBRwAN9hcjG6":false,"msJRXNbQkHynga9eW6pFLqAs1eZhzFoWQZ":false,"n2DBGhEALVhmkyL6LzMxdgRh4SF1Ke2Mw9":false,"mpM3wMnFjRUTcDWLcd5DZ51TgeqFw5N2ZM":false,"mfx8pr2V2momqz9St5bbCaHeQCwH41TXne":false,"mswRM5kueZHKkWPweq4nyfFpJRiEQ6UTrj":false,"mhuxUusT441up1qCuKH6dCbdvXNECY14nM":false,"mh5RPyq3Czki5WgWajEvTfE92PWgCiCont":false,"mwxwmMPD27HhiatihhSspcCj4N2LaBrzcj":false,"mmLAdsaK8RUhP7yqhSJM9caW6hrRKisLac":false,"mmT7jzFyYPU6UnVSJ1bjxfJVYN1AKhZWJa":false,"mwKdHeoHC5CPmm9CPRwoiUhwPWMMrosU3e":false,"n3ATQKG5hVCXybev6fjZdZotbT5ih6LFDP":false,"mvYaUg6WrAJWrjVVZBd7nPoe8zXay1tV9i":false,"mhyfefXY1E46vHcdtDiUvY6HfS7LMXtKAJ":false,"mswLRozh5Dpm7M7srHsF6KM3zDFZTJEEVn":false,"mprDv1gvszNaVn47TaWPGgCARWyeq5yD6J":false,"mi9YQP1ju8UjVa3uGA8BHTC3odh3gBJ1QR":false,"mtuVbP91A4c8de2swYdDGyjJFmXjmCHQdz":false,"mvQnYSDVvP6km5cU5TN3aApPKGa5PmFcSw":false,"mk3JiS44hpN4dnnoS45xpuNXoALcEQE4iY":false,"mnSY6sVsCBnHe6PVVVFK6bV6tf3Ri1ykcG":false,"mtsVQhKHxohGeNDPK1epp2DPKT2jmZRn6b":false,"mh7Ur94RHTwgjGteiybQN7nhmWZRKWo9ou":false,"mzLsZTGwRhALkrSC555Fgetym5XLhfpW8e":false,"mfdPbWAXs2sMBWkwGW9KgwGEEjy7R4oWhf":false,"mvJCVH63DnXrzRycMJs15i3MEFQ3ginVvP":false,"mz1ts8kGKWNuyxLBk7vEzsL8og2EPp1Vce":false,"mn31JAtD9YrFPFMJAgQCrd3vi8XZNEA43e":false,"n4bAGQkxXirKau9KNCex7HDY49YnDgsp3g":false,"msbszKYDW4qCB8ueShWEYBuHsfeEBc8fdq":false,"n1Q2zUqpWkkhS28eAtX3deF8xNLUWN3bzP":false,"msmrDofDLBV3pWhbVXhcJo3Qm8VxYuKBL6":false,"mk8gb2D8JNiQijb41NjWSRKBLv7zSVs4j3":false,"mu5BVNMJ5HNrh2FP4t98Qmhfx5T1Gr3isH":false,"mkd7kigFhRAgLXhcDQ12194NDiVKqJrdzF":false,"n2AJmJCtyDiZd66CN9S6RmzTVK9TsCUTzv":false,"mtNoXBnrwBLfwqbJe1syBZwAAsk9E1LpSh":false,"mmnjKUc85eX49Aqnbibo113yba9DqyUUxH":false,"my31AvFqnaRXs2CQdz1t9TXNU1ahZr7kph":false,"mwWNQuwD6u4SmpTxJb8HVoYNDrMap6PYCh":false,"mo5aR4S9JYb3PQpot8wBwhQyEtNp6wsdZb":false,"mjjNUNVcG7qpHQiWhU96MhQVip5Jvw1fME":false,"n3Shrgfben2UAvgqhGo4L9eEpw2ZcQ8Gxf":false}}',
					[],
				);

			nock("https://btc-test.payvo.com:443", { encodedQueryParams: true })
				.post(
					"/api/wallets/addresses",
					'{"addresses":["n3LhrsyE8g1Ga2XPGuXfRkaPcipevENLre","n1ii1xkSqM5zTyY4h5zpAnPi86csRbA5ar","mkEU1tHycuDj2XPcRMBWZHrBvHJXwkcBNR","my6MACmsGA3MXq73KJwnZwcNYwAYNXGGaM","mvY8me8vYkKUz8Qn3pFhionqYWDZeiC1hC","ms9QjBPWq7atAGtp4HrFRUhcuNU2QHj58z","mtkq8N81uLbazEszNZSij7ago4k6KkfjKk","mjZij3tVEKKFdyGcUTTkAVDR7jGhUfxEf7","mhub5yjwn8aktqw2C1hipdYNW83njAgymv","mjP4YPUBZZW6GaXJJ36W8gfTfxMCfuTvbP","n2khkbRh2pc8srDNeqM8uEy3n9APaL8KgV","mtBkrgNXdCX7gBVAugdtNqSq8L56EVV7Uw","mi5VbkBz7tjfg7AQ2oxxQWj78LDBzhrb3d","mhbNtdzhrxRLAuajTLYCzaec3DE79GLjwh","mhuacfeCHWSVweiu6KwDVrTGhsrnCQfTgz","mtbT1i9DnWaUMiWxUvSR42Ve56KbReKcgg","mowcx8DHsDBuhKSQ9XBpML9nZSSB2SyJDc","n2FJRGVUvWEk4rUzfJWkki5jqSg5bBwc98","n1nSwLjZ54S6k58KBwjdNDuqs1mZSCXx3z","moGqYcYarUUiLntbqEL3BBkq4XPuGBoVqN","muqrmFmmdHbbBsEqJMtL6RQm4RHPUYnFk2","mywJckScMZgPMhFmqfxGh7kDAV5cXqjX3r","mxujfFr43vVyNxLabh2F7CdFR9NAEVmUKa","muQRbM43NH5LSigqDDE1z96ygLadhUqAkS","myboc96HfByRuWpXcgvkCBaB9UUyJ9jXKK","mq5wovr1wwJpbCQHZ5T5CyftGCwze1DQDu","mktyYXvra2sribiZcBaTHxgyWqw2Jox3h9","mtJ5uCjqQ9Wi3tji6LXUyt8JhUetoYRumF","muDxFcQ4zhMKb4Zi6hYsVhkRNNZeG1CXtb","n4JzHYrRWJ4neKUs8aA3fhrdNstuzGdGRi","mpwKChjheNta7f2nfMrZtCsFVvTqnX4wu2","mvfYphsn7xAdrf8xAYDSskD5HYGe6BV8F5","mjf2x3fNeB65egmWgMhN4Uk9kCZRF6zSYF","mhC13KUAAi3M837GNu3CtmwaERKskLofS3","mpY4L4WHtXw7KSiZ6PDhZyTF5AhXK2F17X","mgUL2JxfUxtQ4yfMREqCUJDsv71SL3qav9","mz84bNXV2QHVAo82DFVzaymAWsNBn4oxXJ","mod4Whkw4T8P28ezhzmzLAqGCQTu8GXdg5","n3YrL12NVPcQdaeqxHzuNVqRGVAs8qHGfF","miEwLKjCjCLau1nNVQAsHQGjBuYgSK69dg","n42v5BSFfGZKEKDuU59yrur9eKSzg4F6QL","ms2WTyyd3QfrzouWcpmQ8LdhvwLchNogZc","mk5seBWzKpvkZayKcMmLnvfnJHH8ur4HeA","mip1uqSjVnrdNpgSxttgVdFgYRxwYNKcZP","n45q6F5LxC6VBUxdf6nuvp9ZwLGmBvSkfa","n4ZvH3QJ5b2b1yCqLCwuf2zpgtrUX1sGs2","n3rKjHbcp538Jr8n1V3PAZCbDQQyanuePZ","mr9gtRy2VAS78GejUiKgf4myszNPBHoLpV","muxcpyEWrtgAj96nQ9mUbuzQQb9ixDcFZS","mvSgDudA3dJZqA9VdXNv9rSaDBbii12odf","miUCCMdHSUMuqLakeJFnQNubCZiqtagT9V","myBsAAr9mNe1o13qXTA9RQRxVLbE1Cp96i","mt4BQPwHK9qYVyh6sE5Aq6Xm9YFyYSYTw8","mgYbtjCrroxWMbqXXQBos6dNNXfLMoG5ht","n1GtvUHv9mTU5MLcpDDydU4VwQcnvup3uB","mjaG5QmGTSkSXUCsfsRcG2CgERRFFQEfbb","myeyiLHwvy7GsTtHh6VFrRskMeZdqncSro","mx9RRciYgtqTR17CtmB8sZCuwdUesxU8X9","mxx8rKmbVh5bTmQJcip4XzZd3QSkqW44m9","mrWLJUo6HzfYQPXxMbba1Mh81FJ1jThwBV","mtgZJuqhnmzKq2Pqppyo7Bs5KXUBck9BQa","n4ZfnxeQBifbXP5VeoaDQ31eJ2YEePrAD3","mqsQmYqAttASHDRTSNtKvYt1JT95hr69hD","moHvYxq4UKhQ6rJGs3ggF6HjDC3Kt9RSd5","monmjReChadcQ28CsS2dT7cFt2voQrYDqv","mjorkR7WmVTEBprGY9pTCS7cbsSSHb48tq","msB8hgRB375MBJTL4zR89Bn2r1zYmHzVqo","mrzG17RdB7S2rWhVgaTMnmHzwpyLnrB7eE","mrvZPbrtuVtiu2JVFSPHAUeYPUrZVS3yrU","mpcNCGkruWiTCwJ9hTFHej65eEKHjYcUeQ","mjn917wD8SCTUYZekKajRRp9HP4MQL9SwK","mscG2nzgEuWyNU1f3HiWENydwPxMA5A57c","mmk4XeVpZSwJULzAEnA2hHV1eyE43QTNWb","myeA86s9hjuoNc562RqMrTQMbGKXYjW6jQ","mxovJt8LqTX1Q9t6CWy66sF5uzFJQWfhSE","mtHCRA5DQgr4d9pF3J9fPAL95cNurdRDPw","mummhXKqdB8MdS6c73MbBUb7jgPLqveXPo","mymahUdZ3LE6R926ocPjy71VcbkdFLnmtw","mr3WpZkETAM3ynUwP44sDPxjZ8X9FL5ihg","myi466NcvUwEgGiNzYeQyScNqhsNDU4JdZ","mtMQ8mWhcbrKL78yYdkGcHuU9TfCwGtDk7","mj5LmdsePJ4mbaKVSE37dof1GXeLpgrEc1","mxPtTaKJFdxDHHxqKzVZTf73CKgjcJtzAG","mjk1vbP9jzMfGc85CfTbAjxefFBwnRieo3","myR9FJitM5eDYzQvDnGXPXD7LFoXw91oAZ","n4q8fhk38s2rBfS2ZeAAiC3dfMP7X4p7F1","mpiVHCT9Fe6TCh5ZU862tpK6JhdBWoQkRs","mfsK8DnY6Px6NpxqUiCaAHHyMpaYPv67Gk","mpiQLtGkhRUQmo6kHQseAoqdq9WANgvpSJ","mx4cZn3XPRjejzC119buMKYjuRN85Vb5um","mz9VT4zPiH8vBAgKZn7Gf9VnRQstfEcnrX","miaYjb1WetR2MZK5r3zrFxRS8BA6pvrBkU","mtNHUh4G5EBe5KuWtwRsSZSnHQjiRDtMYE","mhGt72NEBz6GY5F7AqgiN1ZHu1mh3jTnU6","n4YN28XhZ9heUDWZ2tTGHmgqSW8mDVsoSr","n1cSBqiuLWygTK29maXmoPp45viXgzpXr8","mnq5grJzMVXehaMRn61Xwt7u5seqnmXcx8","mhoszJwb7jduLfgg18AKMrMBsLBq9WTpzG","mzi3gBmmhe9u8vzrabG2zyw9RYvidsvhsZ","mvzPPyHreLKmcMkm3rt24CDRiv2RfV2mJ9"]}',
				)
				.reply(
					200,
					'{"data":{"n3LhrsyE8g1Ga2XPGuXfRkaPcipevENLre":false,"n1ii1xkSqM5zTyY4h5zpAnPi86csRbA5ar":false,"mkEU1tHycuDj2XPcRMBWZHrBvHJXwkcBNR":false,"my6MACmsGA3MXq73KJwnZwcNYwAYNXGGaM":false,"mvY8me8vYkKUz8Qn3pFhionqYWDZeiC1hC":false,"ms9QjBPWq7atAGtp4HrFRUhcuNU2QHj58z":false,"mtkq8N81uLbazEszNZSij7ago4k6KkfjKk":false,"mjZij3tVEKKFdyGcUTTkAVDR7jGhUfxEf7":false,"mhub5yjwn8aktqw2C1hipdYNW83njAgymv":false,"mjP4YPUBZZW6GaXJJ36W8gfTfxMCfuTvbP":false,"n2khkbRh2pc8srDNeqM8uEy3n9APaL8KgV":false,"mtBkrgNXdCX7gBVAugdtNqSq8L56EVV7Uw":false,"mi5VbkBz7tjfg7AQ2oxxQWj78LDBzhrb3d":false,"mhbNtdzhrxRLAuajTLYCzaec3DE79GLjwh":false,"mhuacfeCHWSVweiu6KwDVrTGhsrnCQfTgz":false,"mtbT1i9DnWaUMiWxUvSR42Ve56KbReKcgg":false,"mowcx8DHsDBuhKSQ9XBpML9nZSSB2SyJDc":false,"n2FJRGVUvWEk4rUzfJWkki5jqSg5bBwc98":false,"n1nSwLjZ54S6k58KBwjdNDuqs1mZSCXx3z":false,"moGqYcYarUUiLntbqEL3BBkq4XPuGBoVqN":false,"muqrmFmmdHbbBsEqJMtL6RQm4RHPUYnFk2":false,"mywJckScMZgPMhFmqfxGh7kDAV5cXqjX3r":false,"mxujfFr43vVyNxLabh2F7CdFR9NAEVmUKa":false,"muQRbM43NH5LSigqDDE1z96ygLadhUqAkS":false,"myboc96HfByRuWpXcgvkCBaB9UUyJ9jXKK":false,"mq5wovr1wwJpbCQHZ5T5CyftGCwze1DQDu":false,"mktyYXvra2sribiZcBaTHxgyWqw2Jox3h9":false,"mtJ5uCjqQ9Wi3tji6LXUyt8JhUetoYRumF":false,"muDxFcQ4zhMKb4Zi6hYsVhkRNNZeG1CXtb":false,"n4JzHYrRWJ4neKUs8aA3fhrdNstuzGdGRi":false,"mpwKChjheNta7f2nfMrZtCsFVvTqnX4wu2":false,"mvfYphsn7xAdrf8xAYDSskD5HYGe6BV8F5":false,"mjf2x3fNeB65egmWgMhN4Uk9kCZRF6zSYF":false,"mhC13KUAAi3M837GNu3CtmwaERKskLofS3":false,"mpY4L4WHtXw7KSiZ6PDhZyTF5AhXK2F17X":false,"mgUL2JxfUxtQ4yfMREqCUJDsv71SL3qav9":false,"mz84bNXV2QHVAo82DFVzaymAWsNBn4oxXJ":false,"mod4Whkw4T8P28ezhzmzLAqGCQTu8GXdg5":false,"n3YrL12NVPcQdaeqxHzuNVqRGVAs8qHGfF":false,"miEwLKjCjCLau1nNVQAsHQGjBuYgSK69dg":false,"n42v5BSFfGZKEKDuU59yrur9eKSzg4F6QL":false,"ms2WTyyd3QfrzouWcpmQ8LdhvwLchNogZc":false,"mk5seBWzKpvkZayKcMmLnvfnJHH8ur4HeA":false,"mip1uqSjVnrdNpgSxttgVdFgYRxwYNKcZP":false,"n45q6F5LxC6VBUxdf6nuvp9ZwLGmBvSkfa":false,"n4ZvH3QJ5b2b1yCqLCwuf2zpgtrUX1sGs2":false,"n3rKjHbcp538Jr8n1V3PAZCbDQQyanuePZ":false,"mr9gtRy2VAS78GejUiKgf4myszNPBHoLpV":false,"muxcpyEWrtgAj96nQ9mUbuzQQb9ixDcFZS":false,"mvSgDudA3dJZqA9VdXNv9rSaDBbii12odf":false,"miUCCMdHSUMuqLakeJFnQNubCZiqtagT9V":false,"myBsAAr9mNe1o13qXTA9RQRxVLbE1Cp96i":false,"mt4BQPwHK9qYVyh6sE5Aq6Xm9YFyYSYTw8":false,"mgYbtjCrroxWMbqXXQBos6dNNXfLMoG5ht":false,"n1GtvUHv9mTU5MLcpDDydU4VwQcnvup3uB":false,"mjaG5QmGTSkSXUCsfsRcG2CgERRFFQEfbb":false,"myeyiLHwvy7GsTtHh6VFrRskMeZdqncSro":false,"mx9RRciYgtqTR17CtmB8sZCuwdUesxU8X9":false,"mxx8rKmbVh5bTmQJcip4XzZd3QSkqW44m9":false,"mrWLJUo6HzfYQPXxMbba1Mh81FJ1jThwBV":false,"mtgZJuqhnmzKq2Pqppyo7Bs5KXUBck9BQa":false,"n4ZfnxeQBifbXP5VeoaDQ31eJ2YEePrAD3":false,"mqsQmYqAttASHDRTSNtKvYt1JT95hr69hD":false,"moHvYxq4UKhQ6rJGs3ggF6HjDC3Kt9RSd5":false,"monmjReChadcQ28CsS2dT7cFt2voQrYDqv":false,"mjorkR7WmVTEBprGY9pTCS7cbsSSHb48tq":false,"msB8hgRB375MBJTL4zR89Bn2r1zYmHzVqo":false,"mrzG17RdB7S2rWhVgaTMnmHzwpyLnrB7eE":false,"mrvZPbrtuVtiu2JVFSPHAUeYPUrZVS3yrU":false,"mpcNCGkruWiTCwJ9hTFHej65eEKHjYcUeQ":false,"mjn917wD8SCTUYZekKajRRp9HP4MQL9SwK":false,"mscG2nzgEuWyNU1f3HiWENydwPxMA5A57c":false,"mmk4XeVpZSwJULzAEnA2hHV1eyE43QTNWb":false,"myeA86s9hjuoNc562RqMrTQMbGKXYjW6jQ":false,"mxovJt8LqTX1Q9t6CWy66sF5uzFJQWfhSE":false,"mtHCRA5DQgr4d9pF3J9fPAL95cNurdRDPw":false,"mummhXKqdB8MdS6c73MbBUb7jgPLqveXPo":false,"mymahUdZ3LE6R926ocPjy71VcbkdFLnmtw":false,"mr3WpZkETAM3ynUwP44sDPxjZ8X9FL5ihg":false,"myi466NcvUwEgGiNzYeQyScNqhsNDU4JdZ":false,"mtMQ8mWhcbrKL78yYdkGcHuU9TfCwGtDk7":false,"mj5LmdsePJ4mbaKVSE37dof1GXeLpgrEc1":false,"mxPtTaKJFdxDHHxqKzVZTf73CKgjcJtzAG":false,"mjk1vbP9jzMfGc85CfTbAjxefFBwnRieo3":false,"myR9FJitM5eDYzQvDnGXPXD7LFoXw91oAZ":false,"n4q8fhk38s2rBfS2ZeAAiC3dfMP7X4p7F1":false,"mpiVHCT9Fe6TCh5ZU862tpK6JhdBWoQkRs":false,"mfsK8DnY6Px6NpxqUiCaAHHyMpaYPv67Gk":false,"mpiQLtGkhRUQmo6kHQseAoqdq9WANgvpSJ":false,"mx4cZn3XPRjejzC119buMKYjuRN85Vb5um":false,"mz9VT4zPiH8vBAgKZn7Gf9VnRQstfEcnrX":false,"miaYjb1WetR2MZK5r3zrFxRS8BA6pvrBkU":false,"mtNHUh4G5EBe5KuWtwRsSZSnHQjiRDtMYE":false,"mhGt72NEBz6GY5F7AqgiN1ZHu1mh3jTnU6":false,"n4YN28XhZ9heUDWZ2tTGHmgqSW8mDVsoSr":false,"n1cSBqiuLWygTK29maXmoPp45viXgzpXr8":false,"mnq5grJzMVXehaMRn61Xwt7u5seqnmXcx8":false,"mhoszJwb7jduLfgg18AKMrMBsLBq9WTpzG":false,"mzi3gBmmhe9u8vzrabG2zyw9RYvidsvhsZ":false,"mvzPPyHreLKmcMkm3rt24CDRiv2RfV2mJ9":false}}',
					[],
				);

			nock("https://btc-test.payvo.com:443", { encodedQueryParams: true })
				.post("/api/wallets", { addresses: ["mvVAfs3MCDYg7HokDhL6pPuef6KZLPdUUz"] })
				.reply(
					200,
					'{"data":{"balance":100000,"address":["mvVAfs3MCDYg7HokDhL6pPuef6KZLPdUUz"],"publicKey":"figure this out"}}',
					[],
				);

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
				createService(SignedTransactionData).configure("id", "transactionPayload", ""),
			]);

			expect(result).toEqual({
				accepted: ["id"],
				rejected: [],
				errors: {},
			});
		});

		it("should fail", async () => {
			nock("https://btc-test.payvo.com")
				.post("/api/transactions")
				.reply(200, require(`${__dirname}/../test/fixtures/client/broadcast-failure.json`));

			const result = await subject.broadcast([
				createService(SignedTransactionData).configure("id", "transactionPayload", ""),
			]);

			expect(result).toEqual({
				accepted: [],
				rejected: ["id"],
				errors: {
					id: "bad-txns-in-belowout, value in (0.00041265) < value out (1.00) (code 16)",
				},
			});
		});
	});
});
