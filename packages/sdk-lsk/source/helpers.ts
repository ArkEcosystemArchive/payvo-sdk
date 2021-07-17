import { Coins } from "@payvo/sdk";

export const isTest = (configRepository: Coins.ConfigRepository): boolean =>
	configRepository.get(Coins.ConfigKey.NetworkType) === "test";

export const calculateBalanceLockedInVotes = (votes = {}) =>
	Object.values(votes).reduce((total, vote: any) => total + vote.confirmed, 0);

export const calculateBalanceLockedInUnvotes = (unlocking = []) =>
	unlocking.reduce((acc, vote: any) => acc + parseInt(vote.amount, 10), 0);

export const isBlockHeightReached = (unlockHeight, currentBlockHeight) => currentBlockHeight >= unlockHeight;

export const getUnlockableUnlockObjects = (unlocking = [], currentBlockHeight = 0) =>
	unlocking
		.filter((vote: any) => isBlockHeightReached(vote.height.end, currentBlockHeight))
		.map((vote: any) => ({
			delegateAddress: vote.delegateAddress,
			amount: vote.amount,
			unvoteHeight: Number(vote.height.start),
		}));

export const calculateUnlockableBalance = (unlocking = [], currentBlockHeight = 0) =>
	unlocking.reduce(
		(sum, vote: any) =>
			isBlockHeightReached(vote.height.end, currentBlockHeight) ? sum + parseInt(vote.amount, 10) : sum,
		0,
	);

export const calculateBalanceUnlockableInTheFuture = (unlocking = [], currentBlockHeight = 0) =>
	unlocking.reduce(
		(sum, vote: any) =>
			!isBlockHeightReached(vote.height.end, currentBlockHeight) ? sum + parseInt(vote.amount, 10) : sum,
		0,
	);
