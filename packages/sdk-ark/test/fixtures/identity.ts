import { Identities } from "@arkecosystem/crypto";

export const identity = {
	// Standard
	privateKey: "e2511a6022953eb399fbd48f84619c04c894f735aee107b02a7690075ae67617",
	publicKey: "030fde54605c5d53436217a2849d276376d0b0f12c71219cd62b0a4539e1e75acd",
	address: "D6i8P5N44rFto6M6RALyUXLLs7Q1A1WREW",
	wif: "SHA89yQdW3bLFYyCvEBpn7ngYNR8TEojGCC1uAJjT5esJPm1NiG3",
	mnemonic: "bomb open frame quit success evolve gain donate prison very rent later",
	// Multi Signature
	multiSignature: {
		min: 3,
		publicKeys: ["secret 1", "secret 2", "secret 3"].map((secret) => Identities.PublicKey.fromPassphrase(secret)),
	},
	multiSignatureAddress: "DMS861mLRrtH47QUMVif3C2rBCAdHbmwsi",
	multiSignaturePublicKey: "0279f05076556da7173610a7676399c3620276ebbf8c67552ad3b1f26ec7627794",
};

export const identityByLocale = {
	french: {
		wif: "SGMg3EzkqWrYJHUQNQ3rWtt8skv9VWHa6bUAzgfTYTUiYZNrqWK1",
		privateKey: "ca6bc86f1ba22a25556fb3db912b24e4dedc39f8031ca7dd8ab3ee49fae2fe45",
		publicKey: "02e219a960fb9e2f052036c2f41fb2f4ad51dcc1e6bf293e25a68cb1b8e9c3b0de",
		address: "DJoeLnqjVKHCDnDqKVhoq7TwDbvqk3fHk6",
		mnemonic:
			"arbitre dauphin révolte riposter fatigue rotatif exécuter ravager renvoi automne boiser bistouri caneton sélectif chose achat tumulte prospère léger effigie buffle microbe oxyde appareil",
	},
};
