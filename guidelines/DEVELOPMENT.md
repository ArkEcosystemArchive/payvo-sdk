# Development

There's a myriad of things to keep in mind when integrating a new coin. This document will list what has to be kept in mind and what things need to be taken care of after the coin has been implemented.

## Requirements

1. Every coin should handle of its behaviours internally. No coin-specific behaviours can be leaked.
2. Coin-specific behaviours that are not shared with other coins should not be implemented. An example of this is a transaction type that no other coin supports.
3. If retrieving transaction history or wallet data is difficult via official APIs, consider a custom indexer like we have for BTC and ETH. We reduce overhead on the client-side as much as possible so sometimes a middleman like a custom indexer and API are the appropriate solution.

## Profiles

The SDK is primarily consumed by the [@payvo/sdk-profiles](https://github.com/PayvoHQ/profiles) package. This package is responsible for providing a unified interface for interacting with all available coins and serves as the backend for the [Payvo Wallet](https://github.com/PayvoHQ/wallet).

Every time a new coin has been implemented it needs to be added to the profiles package as a development dependency. After this has been done a few tests need to be updated to ensure that the coin behaves as expected. This might seem redundant because each coin already has a suite of tests but the way it is consumed might reveal missing or faulty behaviours.

### Wallet Factory

> The [wallet factory](https://github.com/PayvoHQ/profiles/blob/master/source/wallet.factory.test.ts) will need a new section for `describe("TICKER", () => { ... });`.

This section should test all methods, also ones that will only throw exceptions. BTC for example has support for BIP49 and BIP84 but no other coins will support this. This means that your new coin should still test calls to these methods but assert that they throw the appropriate exceptions.

### Transaction Service

> The [transaction service](https://github.com/PayvoHQ/profiles/blob/master/source/wallet-transaction.service.test.ts) will need a new section for `describe("TICKER", () => { ... });`.

The transaction service is responsible for all things transaction signing and broadcasting. Ensuring that this service works as expected is critical to ensure that no loss of funds is possible. This could be caused by the wrong normalisation of amounts and fees or using the wrong value as recipient.

If a transaction type is not supported the method should be tested and expect an exception to be thrown. If there are any special behaviours like transacting funds based on a smart contract address they should be tested on top of the native token, like for example with ETH and ERC20. Both of those need to be tested to ensure that transferring ERC20 works.

## How to effectively test

Tests are great but if they aren't thorough you'll lack confidence in them. To test effectively you should make as many reasonable assertions as possible and create abstractions if possible. Lets look at an example.

**Bad**

Writing tests in this way is acceptable but will get unwieldy fast because of the duplication that needs to be kept track of.

```ts
describe("ARK", () => {
	it("should create a transfer", async () => {
		const id = await subject.signTransfer({
			signatory: new Signatories.Signatory(
				new Signatories.MnemonicSignatory({
					signingKey: "bomb open frame quit success evolve gain donate prison very rent later",
					address: "D6i8P5N44rFto6M6RALyUXLLs7Q1A1WREW",
					publicKey: "publicKey",
					privateKey: "privateKey",
				}),
			),
			data: {
				amount: 1,
				to: "D6i8P5N44rFto6M6RALyUXLLs7Q1A1WREW",
			},
		});

		expect(id).toBeString();
		expect(subject.signed()).toContainKey(id);
		expect(subject.transaction(id)).toMatchInlineSnapshot(`ExtendedSignedTransactionData {}`);
		expect(subject.transaction(id).sender()).toBe("lskw6h7zzen4f7n8k4ntwd9qtv62gexzv2rh7cb6h");
		expect(subject.transaction(id).recipient()).toBe("lskw6h7zzen4f7n8k4ntwd9qtv62gexzv2rh7cb6h");
		expect(subject.transaction(id).isTransfer()).toBeTrue();
		expect(subject.transaction(id).isSecondSignature()).toBeFalse();
		expect(subject.transaction(id).isDelegateRegistration()).toBeFalse();
		expect(subject.transaction(id).isVoteCombination()).toBeFalse();
		expect(subject.transaction(id).isVote()).toBeFalse();
		expect(subject.transaction(id).isUnvote()).toBeFalse();
		expect(subject.transaction(id).isMultiSignatureRegistration()).toBeFalse();
		expect(subject.transaction(id).isIpfs()).toBeFalse();
		expect(subject.transaction(id).isMultiPayment()).toBeFalse();
		expect(subject.transaction(id).isDelegateResignation()).toBeFalse();
		expect(subject.transaction(id).isHtlcLock()).toBeFalse();
		expect(subject.transaction(id).isHtlcClaim()).toBeFalse();
		expect(subject.transaction(id).isHtlcRefund()).toBeFalse();
		expect(subject.transaction(id).isMagistrate()).toBeFalse();
		expect(subject.transaction(id).usesMultiSignature()).toBeFalse();
	});
});

describe("LSK", () => {
	it("should create a transfer", async () => {
		const id = await subject.signTransfer({
			signatory: new Signatories.Signatory(
				new Signatories.MnemonicSignatory({
					signingKey: "bomb open frame quit success evolve gain donate prison very rent later",
					address: "lskw6h7zzen4f7n8k4ntwd9qtv62gexzv2rh7cb6h",
					publicKey: "39b49ead71b16c0b0330a6ba46c57183819936bfdf789dfd2452df4dc04f5a2a",
					privateKey: "e2511a6022953eb399fbd48f84619c04c894f735aee107b02a7690075ae67617",
				}),
			),
			data: {
				amount: 1,
				to: "lskw6h7zzen4f7n8k4ntwd9qtv62gexzv2rh7cb6h",
			},
		});

		expect(id).toBeString();
		expect(subject.signed()).toContainKey(id);
		expect(subject.transaction(id)).toMatchInlineSnapshot(`ExtendedSignedTransactionData {}`);
		expect(subject.transaction(id).sender()).toBe("lskw6h7zzen4f7n8k4ntwd9qtv62gexzv2rh7cb6h");
		expect(subject.transaction(id).recipient()).toBe("lskw6h7zzen4f7n8k4ntwd9qtv62gexzv2rh7cb6h");
		expect(subject.transaction(id).isTransfer()).toBeTrue();
		expect(subject.transaction(id).isSecondSignature()).toBeFalse();
		expect(subject.transaction(id).isDelegateRegistration()).toBeFalse();
		expect(subject.transaction(id).isVoteCombination()).toBeFalse();
		expect(subject.transaction(id).isVote()).toBeFalse();
		expect(subject.transaction(id).isUnvote()).toBeFalse();
		expect(subject.transaction(id).isMultiSignatureRegistration()).toBeFalse();
		expect(subject.transaction(id).isIpfs()).toBeFalse();
		expect(subject.transaction(id).isMultiPayment()).toBeFalse();
		expect(subject.transaction(id).isDelegateResignation()).toBeFalse();
		expect(subject.transaction(id).isHtlcLock()).toBeFalse();
		expect(subject.transaction(id).isHtlcClaim()).toBeFalse();
		expect(subject.transaction(id).isHtlcRefund()).toBeFalse();
		expect(subject.transaction(id).isMagistrate()).toBeFalse();
		expect(subject.transaction(id).usesMultiSignature()).toBeFalse();
	});
});
```

**Good**

This way of writing tests is better for repetitive tests that need to be run for every coin and also make it easier to add new coins because you just need to provide a few paramteres instead of copy-pasting or writing an entire test again. This kind of construct also avoids that expectations for the same behaviours between different tests get out of sync and thus cause bugs to slip through.

```ts
describe.each([
	[
		"ARK",
		{
			signatory: new Signatories.Signatory(
				new Signatories.MnemonicSignatory({
					signingKey: "bomb open frame quit success evolve gain donate prison very rent later",
					address: "D6i8P5N44rFto6M6RALyUXLLs7Q1A1WREW",
					publicKey: "39b49ead71b16c0b0330a6ba46c57183819936bfdf789dfd2452df4dc04f5a2a",
					privateKey: "e2511a6022953eb399fbd48f84619c04c894f735aee107b02a7690075ae67617",
				}),
			),
			data: {
				amount: 1,
				to: "D6i8P5N44rFto6M6RALyUXLLs7Q1A1WREW",
			},
		},
		"D6i8P5N44rFto6M6RALyUXLLs7Q1A1WREW",
		"D6i8P5N44rFto6M6RALyUXLLs7Q1A1WREW",
	],
	[
		"LSK",
		{
			signatory: new Signatories.Signatory(
				new Signatories.MnemonicSignatory({
					signingKey: "bomb open frame quit success evolve gain donate prison very rent later",
					address: "lskw6h7zzen4f7n8k4ntwd9qtv62gexzv2rh7cb6h",
					publicKey: "39b49ead71b16c0b0330a6ba46c57183819936bfdf789dfd2452df4dc04f5a2a",
					privateKey: "e2511a6022953eb399fbd48f84619c04c894f735aee107b02a7690075ae67617",
				}),
			),
			data: {
				amount: 1,
				to: "lskw6h7zzen4f7n8k4ntwd9qtv62gexzv2rh7cb6h",
			},
		},
		"lskw6h7zzen4f7n8k4ntwd9qtv62gexzv2rh7cb6h",
		"lskw6h7zzen4f7n8k4ntwd9qtv62gexzv2rh7cb6h",
	],
])(() => {
	it("should create a transfer for %s", async (coin: string, input: object, sender: string, recipient: string): Promise<void> => {
		const id: string = await subject.signTransfer(input);

		expect(id).toBeString();
		expect(subject.signed()).toContainKey(id);
		expect(subject.transaction(id)).toBeInstanceOf(ExtendedSignedTransactionData);
		expect(subject.transaction(id).sender()).toBe(sender);
		expect(subject.transaction(id).recipient()).toBe(recipient);
		expect(subject.transaction(id).isTransfer()).toBeTrue();
		expect(subject.transaction(id).isSecondSignature()).toBeFalse();
		expect(subject.transaction(id).isDelegateRegistration()).toBeFalse();
		expect(subject.transaction(id).isVoteCombination()).toBeFalse();
		expect(subject.transaction(id).isVote()).toBeFalse();
		expect(subject.transaction(id).isUnvote()).toBeFalse();
		expect(subject.transaction(id).isMultiSignatureRegistration()).toBeFalse();
		expect(subject.transaction(id).isIpfs()).toBeFalse();
		expect(subject.transaction(id).isMultiPayment()).toBeFalse();
		expect(subject.transaction(id).isDelegateResignation()).toBeFalse();
		expect(subject.transaction(id).isHtlcLock()).toBeFalse();
		expect(subject.transaction(id).isHtlcClaim()).toBeFalse();
		expect(subject.transaction(id).isHtlcRefund()).toBeFalse();
		expect(subject.transaction(id).isMagistrate()).toBeFalse();
		expect(subject.transaction(id).usesMultiSignature()).toBeFalse();
	});
});
```

**Note**

For this construct to work you'll need to declare all HTTP mocks in `beforeAll` because you won't be able to create mocks on a per-test basis without some workarounds.
