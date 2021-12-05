import yup from "yup";

import { IProfileData, IProfileValidator, ProfileData, ProfileSetting } from "./contracts.js";

export class ProfileValidator implements IProfileValidator {
	/**
	 * Validate the profile data.
	 *
	 * @param {IProfileData} [data]
	 * @return {Promise<IProfileData>}
	 * @memberof Profile
	 */
	public validate(data: IProfileData): IProfileData {
		const { error, value } = yup.object({
			id: yup.string().required(),
			contacts: yup.object().pattern(
				yup.string().uuid(),
				yup.object({
					id: yup.string().required(),
					name: yup.string().required(),
					addresses: yup.array()
						.min(1)
						.items(
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
			exchangeTransactions: yup.object()
				.pattern(
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
			notifications: yup.object()
				.pattern(
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
			plugins: yup.object()
				.pattern(
					yup.string().uuid(),
					yup.object({
						id: yup.string().required(),
						name: yup.string().required(),
						version: yup.string().required(),
						isEnabled: yup.boolean().required(),
						permissions: yup.array().items(yup.string()).required(),
						urls: yup.array().items(yup.string()).required(),
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
				[ProfileSetting.MarketProvider]: yup.string().allow("coincap", "cryptocompare", "coingecko").required(),
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
			wallets: yup.object().pattern(
				yup.string().uuid(),
				yup.object({
					id: yup.string().required(),
					data: yup.object().required(),
					settings: yup.object().required(),
				}),
			),
		}).validate(data, { stripUnknown: true, allowUnknown: true });

		if (error !== undefined) {
			throw error;
		}

		return value as IProfileData;
	}
}
