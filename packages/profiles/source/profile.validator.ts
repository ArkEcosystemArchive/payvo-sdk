import Joi from "joi";

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
		const { error, value } = Joi.object({
			contacts: Joi.object().pattern(
				Joi.string().uuid(),
				Joi.object({
					addresses: Joi.array()
						.min(1)
						.items(
							Joi.object({
								address: Joi.string().required(),
								coin: Joi.string().required(),
								id: Joi.string().required(),
								network: Joi.string().required(),
							}),
						),
					id: Joi.string().required(),
					name: Joi.string().required(),
					starred: Joi.boolean().required(),
				}),
			),
			data: Joi.object({
				[ProfileData.LatestMigration]: Joi.string(),
				[ProfileData.HasCompletedIntroductoryTutorial]: Joi.boolean(),
				[ProfileData.HasAcceptedManualInstallationDisclaimer]: Joi.boolean(),
			}).required(),
			exchangeTransactions: Joi.object()
				.pattern(
					Joi.string().uuid(),
					Joi.object({
						createdAt: Joi.number().required(),
						id: Joi.string().required(),
						input: Joi.object({
							address: Joi.string().required(),
							amount: Joi.number().required(),
							hash: Joi.string(),
							ticker: Joi.string().required(),
						}).required(),
						orderId: Joi.string().required(),
						output: Joi.object({
							address: Joi.string().required(),
							amount: Joi.number().required(),
							hash: Joi.string(),
							ticker: Joi.string().required(),
						}).required(),
						provider: Joi.string().required(),
						status: Joi.number().required(),
					}),
				)
				.required(),
			hosts: Joi.object().default({}),
			id: Joi.string().required(),
			networks: Joi.object().default({}),
			notifications: Joi.object()
				.pattern(
					Joi.string().uuid(),
					Joi.object({
						action: Joi.string(),
						body: Joi.string(),
						icon: Joi.string(),
						id: Joi.string().required(),
						meta: Joi.object(),
						name: Joi.string(),
						read_at: Joi.number(),
						type: Joi.string(),
					}),
				)
				.required(),
			plugins: Joi.object()
				.pattern(
					Joi.string().uuid(),
					Joi.object({
						id: Joi.string().required(),
						isEnabled: Joi.boolean().required(),
						name: Joi.string().required(),
						permissions: Joi.array().items(Joi.string()).required(),
						urls: Joi.array().items(Joi.string()).required(),
						version: Joi.string().required(),
					}),
				)
				.required(),
			// @TODO: assert specific values for enums
			settings: Joi.object({
				[ProfileSetting.AccentColor]: Joi.string().required(),
				[ProfileSetting.AdvancedMode]: Joi.boolean().required(),
				[ProfileSetting.AutomaticSignOutPeriod]: Joi.number().required(),
				[ProfileSetting.Avatar]: Joi.string(),
				[ProfileSetting.Bip39Locale]: Joi.string().required(),
				[ProfileSetting.DashboardConfiguration]: Joi.object(),
				[ProfileSetting.DashboardTransactionHistory]: Joi.boolean().required(),
				[ProfileSetting.DoNotShowFeeWarning]: Joi.boolean().required(),
				[ProfileSetting.ErrorReporting]: Joi.boolean().required(),
				[ProfileSetting.FallbackToDefaultNodes]: Joi.boolean().required(),
				[ProfileSetting.ExchangeCurrency]: Joi.string().required(),
				[ProfileSetting.Locale]: Joi.string().required(),
				[ProfileSetting.MarketProvider]: Joi.string().allow("coincap", "cryptocompare", "coingecko").required(),
				[ProfileSetting.Name]: Joi.string().required(),
				[ProfileSetting.NewsFilters]: Joi.string(),
				[ProfileSetting.Password]: Joi.string(),
				[ProfileSetting.Theme]: Joi.string().required(),
				[ProfileSetting.TimeFormat]: Joi.string().required(),
				[ProfileSetting.UseExpandedTables]: Joi.boolean().default(false),
				[ProfileSetting.UseNetworkWalletNames]: Joi.boolean().default(false),
				[ProfileSetting.UseTestNetworks]: Joi.boolean().default(false),
			}).required(),
			wallets: Joi.object().pattern(
				Joi.string().uuid(),
				Joi.object({
					data: Joi.object().required(),
					id: Joi.string().required(),
					settings: Joi.object().required(),
				}),
			),
		}).validate(data, { allowUnknown: true, stripUnknown: true });

		if (error !== undefined) {
			throw error;
		}

		return value as IProfileData;
	}
}
