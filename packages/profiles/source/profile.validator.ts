import yup from 'yup'
import BaseSchema, { CastOptions } from 'yup/lib/schema'
import { AnyObject, Callback, InternalOptions } from 'yup/lib/types'
import runTests from 'yup/lib/util/runTests'

import { IProfileData, IProfileValidator, ProfileData, ProfileSetting } from "./contracts.js";
import { MapSchema } from './helpers/yup.js';

export class ProfileValidator implements IProfileValidator {
	public validate(data: IProfileData): IProfileData {
		return yup.object({
			id: yup.string().required(),
			contacts: new MapSchema(
				yup.string().uuid(),
				yup.object({
					id: yup.string().required(),
					name: yup.string().required(),
					addresses: yup.array()
						.min(1)
						.of(
							yup.object({
								id: yup.string().required(),
								coin: yup.string().required(),
								network: yup.string().required(),
								address: yup.string().required(),
							}),
						),
					starred: yup.boolean().required(),
				}),
			),
			data: yup.object({
				[ProfileData.LatestMigration]: yup.string(),
				[ProfileData.HasCompletedIntroductoryTutorial]: yup.boolean(),
				[ProfileData.HasAcceptedManualInstallationDisclaimer]: yup.boolean(),
			}).required(),
			exchangeTransactions: new MapSchema(
				yup.string().uuid(),
				yup.object({
					id: yup.string().required(),
					orderId: yup.string().required(),
					provider: yup.string().required(),
					input: yup.object({
						address: yup.string().required(),
						amount: yup.number().required(),
						ticker: yup.string().required(),
						hash: yup.string(),
					}).required(),
					output: yup.object({
						address: yup.string().required(),
						amount: yup.number().required(),
						ticker: yup.string().required(),
						hash: yup.string(),
					}).required(),
					status: yup.number().required(),
					createdAt: yup.number().required(),
				}),
			)
				.required(),
			notifications: new MapSchema(
				yup.string().uuid(),
				yup.object({
					id: yup.string().required(),
					icon: yup.string(),
					name: yup.string(),
					body: yup.string(),
					type: yup.string(),
					action: yup.string(),
					read_at: yup.number(),
					meta: yup.object(),
				}),
			)
				.required(),
			plugins: new MapSchema(
				yup.string().uuid(),
				yup.object({
					id: yup.string().required(),
					name: yup.string().required(),
					version: yup.string().required(),
					isEnabled: yup.boolean().required(),
					permissions: yup.array().of(yup.string()).required(),
					urls: yup.array().of(yup.string()).required(),
				}),
			)
				.required(),
			// @TODO: assert specific values for enums
			settings: yup.object({
				[ProfileSetting.AccentColor]: yup.string().required(),
				[ProfileSetting.AdvancedMode]: yup.boolean().required(),
				[ProfileSetting.AutomaticSignOutPeriod]: yup.number().required(),
				[ProfileSetting.Avatar]: yup.string(),
				[ProfileSetting.Bip39Locale]: yup.string().required(),
				[ProfileSetting.DashboardConfiguration]: yup.object(),
				[ProfileSetting.DashboardTransactionHistory]: yup.boolean().required(),
				[ProfileSetting.DoNotShowFeeWarning]: yup.boolean().required(),
				[ProfileSetting.ErrorReporting]: yup.boolean().required(),
				[ProfileSetting.ExchangeCurrency]: yup.string().required(),
				[ProfileSetting.Locale]: yup.string().required(),
				[ProfileSetting.MarketProvider]: yup.string().oneOf(["coincap", "cryptocompare", "coingecko"]).required(),
				[ProfileSetting.Name]: yup.string().required(),
				[ProfileSetting.NewsFilters]: yup.string(),
				[ProfileSetting.Password]: yup.string(),
				[ProfileSetting.ScreenshotProtection]: yup.boolean().default(false),
				[ProfileSetting.Theme]: yup.string().required(),
				[ProfileSetting.TimeFormat]: yup.string().required(),
				[ProfileSetting.UseExpandedTables]: yup.boolean().default(false),
				[ProfileSetting.UseNetworkWalletNames]: yup.boolean().default(false),
				[ProfileSetting.UseTestNetworks]: yup.boolean().default(false),
			}).required(),
			wallets:
				new MapSchema(
					yup.string().uuid(),
					yup.object({
						id: yup.string().required(),
						data: yup.object().required(),
						settings: yup.object().required(),
					})
				),
		}).validateSync(data, { stripUnknown: true }) as IProfileData;
	}
}
