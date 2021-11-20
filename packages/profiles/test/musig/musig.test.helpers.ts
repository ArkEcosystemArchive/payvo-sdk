import { mnemonics as testMnemonics } from "../fixtures/identity";
import nock from "nock";
import { IReadWriteWallet } from "../../source/wallet.contract";
import { IProfile } from "../../source/profile.contract";
import { BigNumber } from "@payvo/sdk-helpers";

interface Wallet {
	wallet: IReadWriteWallet;
	mnemonic: string;
}

export const generateWalletsFromMnemonics = async ({
	profile,
	coinId,
	networkId,
	mnemonics,
}: {
	profile: IProfile;
	coinId: string;
	networkId: string;
	mnemonics: string[];
}): Promise<Wallet[]> => {
	const wallets: Wallet[] = [];

	for (const mnemonic of mnemonics) {
		const wallet = await profile.walletFactory().fromMnemonicWithBIP39({
			coin: coinId,
			network: networkId,
			mnemonic,
		});

		wallets.push({
			wallet,
			mnemonic,
		});
	}

	return wallets;
};

export const generateWallets = async ({
	numberOfWallets,
	profile,
	coinId,
	networkId,
}: {
	numberOfWallets: number;
	profile: IProfile;
	coinId: string;
	networkId: string;
}) => {
	const mnemonics = testMnemonics[networkId].slice(0, numberOfWallets);
	const wallets = await generateWalletsFromMnemonics({ profile, coinId, networkId, mnemonics });
	const publicKeys = wallets.map(({ wallet }) => wallet.publicKey()) as string[];

	return {
		mnemonics,
		publicKeys,
		wallets,
	};
};

export const generateRegistrationTransactionData = async ({
	wallet,
	minSignatures,
	publicKeys = [],
	optionalKeys = [],
	mandatoryKeys = [],
	timestamp,
}: {
	wallet: Wallet;
	minSignatures: number;
	timestamp?: number;
	publicKeys?: string[];
	mandatoryKeys?: string[];
	optionalKeys?: string[];
}) => {
	let transactionData: any;

	if (wallet.wallet.network().id() === "ark.devnet") {
		transactionData = {
			nonce: wallet.wallet.nonce().plus(1).toString(),
			fee: 5,
			signatory: await wallet.wallet.coin().signatory().mnemonic(wallet.mnemonic),
			data: {
				senderPublicKey: wallet.wallet.publicKey(),
				publicKeys,
				min: minSignatures,
			},
			timestamp,
		};
	}

	if (wallet.wallet.network().id() === "lsk.testnet") {
		transactionData = {
			nonce: wallet.wallet.nonce().plus(1).toString(),
			fee: 5,
			signatory: await wallet.wallet.coin().signatory().mnemonic(wallet.mnemonic),
			data: {
				senderPublicKey: wallet.wallet.publicKey(),
				numberOfSignatures: minSignatures,
				mandatoryKeys,
				optionalKeys,
			},
			timestamp,
		};
	}

	const fee = BigNumber.make(transactionData.fee)
		.times([...publicKeys, ...mandatoryKeys, ...optionalKeys].length)
		.plus(transactionData.fee);
	transactionData.fee = fee.toNumber();

	return { transactionData, fee };
};

export const createMusigRegistrationFixture = ({
	uuid,
	publicKeys = [],
	mandatoryKeys = [],
	optionalKeys = [],
	signatures,
	signature,
	min = 2,
	wallet,
	fee,
	timestamp,
}: {
	uuid: string;
	publicKeys?: string[];
	mandatoryKeys?: string[];
	optionalKeys?: string[];
	signatures: string[];
	signature?: string;
	min: number;
	wallet: IReadWriteWallet;
	fee?: string;
	timestamp?: number;
}) => {
	if (wallet.network().id() === "ark.devnet") {
		return {
			data: {
				id: uuid,
				version: 2,
				type: 4,
				// Make sure fee is enough to avoid side-effects in wallet statuses (isAwaitingOurSignature, isAwaitingOtherSignatures etc)
				fee: fee || "1500000000",
				senderPublicKey: wallet.publicKey(),
				typeGroup: 1,
				nonce: wallet.nonce().plus(1).toString(),
				signatures,
				amount: "0",
				asset: {
					multiSignature: {
						publicKeys,
						min,
					},
				},
				multiSignature: {
					publicKeys,
					min,
				},
				signature,
			},
			multisigAsset: {
				publicKeys,
				min,
			},
			id: uuid,
			timestampReceived: timestamp,
		};
	}

	if (wallet.network().id() === "lsk.testnet") {
		return {
			data: {
				id: uuid,
				moduleID: 4,
				assetID: 0,
				asset: {
					numberOfSignatures: min,
					mandatoryKeys,
					optionalKeys,
				},
				nonce: wallet.nonce().plus(1).toString(),
				senderPublicKey: wallet.publicKey(),
				// Make sure fee is enough to avoid side-effects in wallet statuses (isAwaitingOurSignature, isAwaitingOtherSignatures etc)
				fee: fee || "1500000000",
				signatures,
				multiSignature: {
					numberOfSignatures: min,
					mandatoryKeys,
					optionalKeys,
				},
				timestamp,
			},
			multiSignature: {
				numberOfSignatures: min,
				mandatoryKeys,
				optionalKeys,
			},
			id: uuid,
		};
	}

	throw new Error(`Fixture for [${wallet.network().id()}] is missing`);
};

export const mockMusigServer = ({ url }: { url: string }) => {
	const mockResponse: Record<string, any> = {
		delete: { result: [] },
		store: { result: { id: undefined } },
		show: { result: { id: undefined } },
		ready: { result: [] },
		pending: { result: [] },
	};

	nock(url)
		.post("/", ({ method }) => method === "delete")
		.reply(200, () => mockResponse.delete)
		.post("/", ({ method }) => method === "store")
		.reply(200, () => mockResponse.store)
		.post("/", ({ method }) => method === "show")
		.reply(200, () => mockResponse.show)
		.post("/", ({ method, params }) => method === "list" && params.state === "pending")
		.reply(200, () => mockResponse.pending)
		.post("/", ({ method, params }) => method === "list" && params.state === "ready")
		.reply(200, () => mockResponse.ready)
		.persist();

	const mockServerResponse = (key: string, fixture: any) => {
		mockResponse[key].result = fixture;
	};

	return {
		mockServerResponse,
		resetServerResponseMocks: () => {
			mockServerResponse("delete", []);
			mockServerResponse("store", { id: undefined });
			mockServerResponse("show", { id: undefined });
			mockServerResponse("ready", []);
			mockServerResponse("pending", []);
		},
	};
};
