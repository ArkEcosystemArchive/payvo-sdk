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

export const isTransfer = ({ assetID, moduleID }: Record<string, any>): boolean => moduleID === 2 && assetID === 0;

export const isMultiSignatureRegistration = ({ assetID, moduleID }: Record<string, any>): boolean =>
	moduleID === 4 && assetID === 0;

export const isDelegateRegistration = ({ assetID, moduleID }: Record<string, any>): boolean =>
	moduleID === 5 && assetID === 0;

export const isVote = ({ assetID, moduleID }: Record<string, any>): boolean => moduleID === 5 && assetID === 1;
