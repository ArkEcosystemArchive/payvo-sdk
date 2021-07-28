export const calculateBalanceLockedInVotes = (votes): number =>
	votes.reduce((total: number, { amount }) => total + amount, 0);

export const calculateBalanceLockedInUnvotes = (unlocking): number =>
	unlocking.reduce((acc, { amount }) => acc + parseInt(amount, 10), 0);

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
