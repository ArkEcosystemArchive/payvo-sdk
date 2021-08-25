import { BigNumber } from "@payvo/helpers";

export const calculateBalanceLockedInVotes = (votes): string =>
	votes.reduce((total: BigNumber, { amount }) => total.plus(amount), BigNumber.ZERO).toString();

export const calculateBalanceLockedInUnvotes = (unlocking): string =>
	unlocking.reduce((acc: BigNumber, { amount }) => acc.plus(parseInt(amount, 10)), BigNumber.ZERO).toString();

export const isBlockHeightReached = (unlockHeight: number, currentBlockHeight: number): boolean =>
	currentBlockHeight >= unlockHeight;

export const calculateUnlockableBalance = (unlocking, currentBlockHeight: number = 0): number =>
	unlocking.reduce(
		(sum, vote: any) =>
			isBlockHeightReached(vote.height.end, currentBlockHeight) ? sum + parseInt(vote.amount, 10) : sum,
		0,
	);

export const calculateUnlockableBalanceInTheFuture = (unlocking, currentBlockHeight: number = 0): number =>
	unlocking.reduce(
		(sum, vote: any) =>
			!isBlockHeightReached(vote.height.end, currentBlockHeight) ? sum + parseInt(vote.amount, 10) : sum,
		0,
	);

export const isTransfer = ({ assetID, moduleID }: Record<string, any>): boolean => moduleID === 2 && assetID === 0;

export const isMultiSignatureRegistration = ({ assetID, moduleID }: Record<string, any>): boolean =>
	moduleID === 4 && assetID === 0;

export const isDelegateRegistration = ({ assetID, moduleID }: Record<string, any>): boolean =>
	moduleID === 5 && assetID === 0;

export const isVote = ({ assetID, moduleID }: Record<string, any>): boolean => moduleID === 5 && assetID === 1;

export const isUnlockToken = ({ assetID, moduleID }: Record<string, any>): boolean => moduleID === 5 && assetID === 2;
