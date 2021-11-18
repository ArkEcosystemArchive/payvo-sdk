/* istanbul ignore file */

import { inject, injectable } from "../ioc/index.js";
import { BindingType } from "../ioc/service-provider.contract.js";
import {
	ConfirmationMnemonicSignatory,
	ConfirmationSecretSignatory,
	ConfirmationWIFSignatory,
	LedgerSignatory,
	MnemonicSignatory,
	MultiSignatureSignatory,
	PrivateKeySignatory,
	SecretSignatory,
	Signatory,
	WIFSignatory,
} from "../signatories";
import { AddressService } from "./address.contract.js";
import { ExtendedAddressService } from "./extended-address.contract.js";
import { KeyPairService } from "./key-pair.contract.js";
import { MultiSignatureAsset } from "./multi-signature.contract.js";
import { PrivateKeyService } from "./private-key.contract.js";
import { PublicKeyService } from "./public-key.contract.js";
import { IdentityOptions } from "./shared.contract.js";
import { SignatoryService } from "./signatory.contract.js";
import { WIFService } from "./wif.contract.js";

@injectable()
export class AbstractSignatoryService implements SignatoryService {
	@inject(BindingType.AddressService)
	protected readonly addressService!: AddressService;

	@inject(BindingType.ExtendedAddressService)
	protected readonly extendedAddressService!: ExtendedAddressService;

	@inject(BindingType.KeyPairService)
	protected readonly keyPairService!: KeyPairService;

	@inject(BindingType.PrivateKeyService)
	protected readonly privateKeyService!: PrivateKeyService;

	@inject(BindingType.PublicKeyService)
	protected readonly publicKeyService!: PublicKeyService;

	@inject(BindingType.WIFService)
	protected readonly wifService!: WIFService;

	public async mnemonic(mnemonic: string, options?: IdentityOptions): Promise<Signatory> {
		return new Signatory(
			new MnemonicSignatory({
				address: (await this.addressService.fromMnemonic(mnemonic, options)).address,
				options,
				privateKey: (await this.privateKeyService.fromMnemonic(mnemonic, options)).privateKey,
				publicKey: (await this.publicKeyService.fromMnemonic(mnemonic, options)).publicKey,
				signingKey: mnemonic,
			}),
			options?.multiSignature,
		);
	}

	public async confirmationMnemonic(
		signingKey: string,
		confirmKey: string,
		options?: IdentityOptions,
	): Promise<Signatory> {
		return new Signatory(
			new ConfirmationMnemonicSignatory({
				address: (await this.addressService.fromMnemonic(signingKey, options)).address,
				confirmKey,
				privateKey: (await this.privateKeyService.fromMnemonic(signingKey, options)).privateKey,
				publicKey: (await this.publicKeyService.fromMnemonic(signingKey, options)).publicKey,
				signingKey,
			}),
			options?.multiSignature,
		);
	}

	public async wif(primary: string, options?: IdentityOptions): Promise<Signatory> {
		return new Signatory(
			new WIFSignatory({
				address: (await this.addressService.fromWIF(primary)).address,
				options,
				privateKey: (await this.privateKeyService.fromWIF(primary)).privateKey,
				publicKey: (await this.publicKeyService.fromWIF(primary)).publicKey,
				signingKey: primary,
			}),
			options?.multiSignature,
		);
	}

	public async confirmationWIF(
		signingKey: string,
		confirmKey: string,
		options?: IdentityOptions,
	): Promise<Signatory> {
		return new Signatory(
			new ConfirmationWIFSignatory({
				address: (await this.addressService.fromWIF(signingKey)).address,
				confirmKey,
				privateKey: (await this.privateKeyService.fromWIF(signingKey)).privateKey,
				publicKey: (await this.publicKeyService.fromWIF(signingKey)).publicKey,
				signingKey,
			}),
			options?.multiSignature,
		);
	}

	public async privateKey(privateKey: string, options?: IdentityOptions): Promise<Signatory> {
		return new Signatory(
			new PrivateKeySignatory({
				address: (await this.addressService.fromPrivateKey(privateKey, options)).address,
				options,
				signingKey: privateKey,
			}),
			options?.multiSignature,
		);
	}

	public async multiSignature(asset: MultiSignatureAsset, options?: IdentityOptions): Promise<Signatory> {
		return new Signatory(
			new MultiSignatureSignatory(
				asset,
				(
					await this.addressService.fromMultiSignature({ min: asset.min, publicKeys: asset.publicKeys })
				).address,
			),
			options?.multiSignature ?? asset,
		);
	}

	public async ledger(path: string, options?: IdentityOptions): Promise<Signatory> {
		return new Signatory(new LedgerSignatory({ options, signingKey: path }), options?.multiSignature);
	}

	public async secret(secret: string, options?: IdentityOptions): Promise<Signatory> {
		return new Signatory(
			new SecretSignatory({
				address: (await this.addressService.fromSecret(secret)).address,
				options,
				privateKey: (await this.privateKeyService.fromSecret(secret)).privateKey,
				publicKey: (await this.publicKeyService.fromSecret(secret)).publicKey,
				signingKey: secret,
			}),
			options?.multiSignature,
		);
	}

	public async confirmationSecret(
		signingKey: string,
		confirmKey: string,
		options?: IdentityOptions,
	): Promise<Signatory> {
		return new Signatory(
			new ConfirmationSecretSignatory({
				address: (await this.addressService.fromSecret(signingKey)).address,
				confirmKey,
				privateKey: (await this.privateKeyService.fromSecret(signingKey)).privateKey,
				publicKey: (await this.publicKeyService.fromSecret(signingKey)).publicKey,
				signingKey,
			}),
			options?.multiSignature,
		);
	}

	/**
	 * This signatory should only be used for testing and fee calculations.
	 */
	public async stub(mnemonic: string): Promise<Signatory> {
		return new Signatory(
			new MnemonicSignatory({
				address: "address",
				privateKey: "privateKey",
				publicKey: "publicKey",
				signingKey: mnemonic,
			}),
		);
	}
}
