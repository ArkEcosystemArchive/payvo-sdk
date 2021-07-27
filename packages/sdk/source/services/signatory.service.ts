/* istanbul ignore file */

import { inject, injectable } from "../ioc";
import { BindingType } from "../ioc/service-provider.contract";
import {
	ConfirmationMnemonicSignatory,
	ConfirmationWIFSignatory,
	LedgerSignatory,
	MnemonicSignatory,
	MultiSignatureSignatory,
	PrivateKeySignatory,
	SecretSignatory,
	Signatory,
	WIFSignatory,
} from "../signatories";
import { AddressService } from "./address.contract";
import { ExtendedAddressService } from "./extended-address.contract";
import { KeyPairService } from "./key-pair.contract";
import { MultiSignatureAsset } from "./multi-signature.contract";
import { PrivateKeyService } from "./private-key.contract";
import { PublicKeyService } from "./public-key.contract";
import { IdentityOptions } from "./shared.contract";
import { SignatoryService } from "./signatory.contract";
import { WIFService } from "./wif.contract";

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
				signingKey: mnemonic,
				address: (await this.addressService.fromMnemonic(mnemonic, options)).address,
				publicKey: (await this.publicKeyService.fromMnemonic(mnemonic, options)).publicKey,
				privateKey: (await this.privateKeyService.fromMnemonic(mnemonic, options)).privateKey,
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
				signingKey,
				confirmKey,
				address: (await this.addressService.fromMnemonic(signingKey, options)).address,
				publicKey: (await this.publicKeyService.fromMnemonic(signingKey, options)).publicKey,
				privateKey: (await this.privateKeyService.fromMnemonic(signingKey, options)).privateKey,
			}),
			options?.multiSignature,
		);
	}

	public async wif(primary: string, options?: IdentityOptions): Promise<Signatory> {
		return new Signatory(
			new WIFSignatory({
				signingKey: primary,
				address: (await this.addressService.fromWIF(primary)).address,
				publicKey: (await this.publicKeyService.fromWIF(primary)).publicKey,
				privateKey: (await this.privateKeyService.fromWIF(primary)).privateKey,
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
				signingKey,
				confirmKey,
				address: (await this.addressService.fromWIF(signingKey)).address,
				publicKey: (await this.publicKeyService.fromWIF(signingKey)).publicKey,
				privateKey: (await this.privateKeyService.fromWIF(signingKey)).privateKey,
			}),
			options?.multiSignature,
		);
	}

	public async privateKey(privateKey: string, options?: IdentityOptions): Promise<Signatory> {
		return new Signatory(
			new PrivateKeySignatory({
				signingKey: privateKey,
				address: (await this.addressService.fromPrivateKey(privateKey, options)).address,
			}),
			options?.multiSignature,
		);
	}

	public async multiSignature(asset: MultiSignatureAsset, options?: IdentityOptions): Promise<Signatory> {
		return new Signatory(
			new MultiSignatureSignatory(
				asset,
				(await this.addressService.fromMultiSignature(asset.min, asset.publicKeys)).address,
			),
			options?.multiSignature ?? asset,
		);
	}

	public async ledger(path: string, options?: IdentityOptions): Promise<Signatory> {
		return new Signatory(new LedgerSignatory(path), options?.multiSignature);
	}

	public async secret(secret: string, options?: IdentityOptions): Promise<Signatory> {
		return new Signatory(
			new SecretSignatory({
				signingKey: secret,
				address: (await this.addressService.fromSecret(secret)).address,
				publicKey: (await this.publicKeyService.fromSecret(secret)).publicKey,
				privateKey: (await this.privateKeyService.fromSecret(secret)).privateKey,
			}),
			options?.multiSignature,
		);
	}
}
