import assert from 'assert'
import BigInteger from 'bigi';
import aes from 'browserify-aes';
import bs58check from 'bs58check';
import xor from 'buffer-xor/inplace';
import createHash from 'create-hash';
import ecurve from 'ecurve';
import { Buffer } from 'buffer';
import scrypt from 'scryptsy';

const curve = ecurve.getCurveByName('secp256k1');

// constants
const SCRYPT_PARAMS = {
	N: 16_384,
	p: 8,
	r: 8,
};

const NULL = Buffer.alloc(0)

function hash160 (buffer) {
	let hash
	try {
		hash = createHash('rmd160')
	} catch {
		hash = createHash('ripemd160')
	}
	return hash.update(
		createHash('sha256').update(buffer).digest()
	).digest()
}

function hash256 (buffer) {
	return createHash('sha256').update(
		createHash('sha256').update(buffer).digest()
	).digest()
}

function getAddress (d, compressed) {
	const Q = curve.G.multiply(d).getEncoded(compressed)
	const hash = hash160(Q)
	const payload = Buffer.allocUnsafe(21)
	payload.writeUInt8(0x00, 0) // XXX TODO FIXME bitcoin only??? damn you BIP38
	hash.copy(payload, 1)

	return bs58check.encode(payload)
}

function prepareEncryptRaw (buffer, compressed, passphrase, scryptParameters) {
	if (buffer.length !== 32) {throw new Error('Invalid private key length')}

	const d = BigInteger.fromBuffer(buffer)
	const address = getAddress(d, compressed)
	const secret = Buffer.from(passphrase.normalize('NFC'), 'utf8')
	const salt = hash256(address).slice(0, 4)

	const N = scryptParameters.N
	const r = scryptParameters.r
	const p = scryptParameters.p

	return {
		N,
		p,
		r,
		salt,
		secret
	}
}

function finishEncryptRaw (buffer, compressed, salt, scryptBuf) {
	const derivedHalf1 = scryptBuf.slice(0, 32)
	const derivedHalf2 = scryptBuf.slice(32, 64)

	const xorBuf = xor(derivedHalf1, buffer)
	const cipher = aes.createCipheriv('aes-256-ecb', derivedHalf2, NULL)
	cipher.setAutoPadding(false)
	cipher.end(xorBuf)

	const cipherText = cipher.read()

	// 0x01 | 0x42 | flagByte | salt (4) | cipherText (32)
	const result = Buffer.allocUnsafe(7 + 32)
	result.writeUInt8(0x01, 0)
	result.writeUInt8(0x42, 1)
	result.writeUInt8(compressed ? 0xe0 : 0xc0, 2)
	salt.copy(result, 3)
	cipherText.copy(result, 7)

	return result
}

async function encryptRawAsync (buffer, compressed, passphrase, progressCallback, scryptParameters, promiseInterval) {
	scryptParameters = scryptParameters || SCRYPT_PARAMS
	const {
		secret,
		salt,
		N,
		r,
		p
	} = prepareEncryptRaw(buffer, compressed, passphrase, scryptParameters)

	const scryptBuf = await scrypt.async(secret, salt, N, r, p, 64, progressCallback, promiseInterval)

	return finishEncryptRaw(buffer, compressed, salt, scryptBuf)
}

function encryptRaw (buffer, compressed, passphrase, progressCallback, scryptParameters) {
	scryptParameters = scryptParameters || SCRYPT_PARAMS
	const {
		secret,
		salt,
		N,
		r,
		p
	} = prepareEncryptRaw(buffer, compressed, passphrase, scryptParameters)

	const scryptBuf = scrypt(secret, salt, N, r, p, 64, progressCallback)

	return finishEncryptRaw(buffer, compressed, salt, scryptBuf)
}

async function encryptAsync (buffer, compressed, passphrase, progressCallback, scryptParameters, promiseInterval) {
	return bs58check.encode(await encryptRawAsync(buffer, compressed, passphrase, progressCallback, scryptParameters, promiseInterval))
}

function encrypt (buffer, compressed, passphrase, progressCallback, scryptParameters) {
	return bs58check.encode(encryptRaw(buffer, compressed, passphrase, progressCallback, scryptParameters))
}

function prepareDecryptRaw (buffer, progressCallback, scryptParameters) {
	// 39 bytes: 2 bytes prefix, 37 bytes payload
	if (buffer.length !== 39) {throw new Error('Invalid BIP38 data length')}
	if (buffer.readUInt8(0) !== 0x01) {throw new Error('Invalid BIP38 prefix')}

	// check if BIP38 EC multiply
	const type = buffer.readUInt8(1)
	if (type === 0x43) {return { decryptEC: true }}
	if (type !== 0x42) {throw new Error('Invalid BIP38 type')}

	const flagByte = buffer.readUInt8(2)
	const compressed = flagByte === 0xe0
	if (!compressed && flagByte !== 0xc0) {throw new Error('Invalid BIP38 compression flag')}

	const N = scryptParameters.N
	const r = scryptParameters.r
	const p = scryptParameters.p

	const salt = buffer.slice(3, 7)
	return {
		N,
		compressed,
		p,
		r,
		salt
	}
}

function finishDecryptRaw (buffer, salt: Buffer, compressed, scryptBuf) {
	const derivedHalf1 = scryptBuf.slice(0, 32)
	const derivedHalf2 = scryptBuf.slice(32, 64)

	const privKeyBuf = buffer.slice(7, 7 + 32)
	const decipher = aes.createDecipheriv('aes-256-ecb', derivedHalf2, NULL)
	decipher.setAutoPadding(false)
	decipher.end(privKeyBuf)

	const plainText = decipher.read()
	const privateKey = xor(derivedHalf1, plainText)

	// verify salt matches address
	const d = BigInteger.fromBuffer(privateKey)
	const address = getAddress(d, compressed)
	const checksum = hash256(address).slice(0, 4)

	assert.deepStrictEqual(salt, checksum)

	return {
		compressed: compressed,
		privateKey: privateKey
	}
}

async function decryptRawAsync (buffer, passphrase, progressCallback, scryptParameters, promiseInterval) {
	scryptParameters = scryptParameters || SCRYPT_PARAMS
	const {
		salt,
		compressed,
		N,
		r,
		p,
		decryptEC
	} = prepareDecryptRaw(buffer, progressCallback, scryptParameters)
	if (decryptEC === true) {return decryptECMultAsync(buffer, passphrase, progressCallback, scryptParameters, promiseInterval)}

	const scryptBuf = await scrypt.async(passphrase.normalize('NFC'), salt, N, r, p, 64, progressCallback, promiseInterval)
	return finishDecryptRaw(buffer, salt, compressed, scryptBuf)
}

// some of the techniques borrowed from: https://github.com/pointbiz/bitaddress.org
function decryptRaw (buffer, passphrase, progressCallback, scryptParameters) {
	scryptParameters = scryptParameters || SCRYPT_PARAMS
	const {
		salt,
		compressed,
		N,
		r,
		p,
		decryptEC
	} = prepareDecryptRaw(buffer, progressCallback, scryptParameters)
	if (decryptEC === true) {return decryptECMult(buffer, passphrase, progressCallback, scryptParameters)}
	const scryptBuf = scrypt(passphrase.normalize('NFC'), salt, N, r, p, 64, progressCallback)
	return finishDecryptRaw(buffer, salt, compressed, scryptBuf)
}

async function decryptAsync (string, passphrase, progressCallback, scryptParameters, promiseInterval) {
	return decryptRawAsync(bs58check.decode(string), passphrase, progressCallback, scryptParameters, promiseInterval)
}

function decrypt (string, passphrase, progressCallback, scryptParameters) {
	return decryptRaw(bs58check.decode(string), passphrase, progressCallback, scryptParameters)
}

function prepareDecryptECMult (buffer, passphrase, progressCallback, scryptParameters) {
	const flag = buffer.readUInt8(1)
	const compressed = (flag & 0x20) !== 0
	const hasLotSeq = (flag & 0x04) !== 0

	assert.strictEqual((flag & 0x24), flag, 'Invalid private key.')

	const addressHash = buffer.slice(2, 6)
	const ownerEntropy = buffer.slice(6, 14)
	let ownerSalt

	// 4 bytes ownerSalt if 4 bytes lot/sequence
	if (hasLotSeq) {
		ownerSalt = ownerEntropy.slice(0, 4)

		// else, 8 bytes ownerSalt
	} else {
		ownerSalt = ownerEntropy
	}

	const encryptedPart1 = buffer.slice(14, 22) // First 8 bytes
	const encryptedPart2 = buffer.slice(22, 38) // 16 bytes

	const N = scryptParameters.N
	const r = scryptParameters.r
	const p = scryptParameters.p
	return {
		N,
		addressHash,
		compressed,
		encryptedPart1,
		encryptedPart2,
		hasLotSeq,
		ownerEntropy,
		ownerSalt,
		p,
		r
	}
}

function getPassIntAndPoint (preFactor, ownerEntropy, hasLotSeq) {
	let passFactor
	if (hasLotSeq) {
		const hashTarget = Buffer.concat([preFactor, ownerEntropy])
		passFactor = hash256(hashTarget)
	} else {
		passFactor = preFactor
	}
	const passInt = BigInteger.fromBuffer(passFactor)
	return {
		passInt,
		passPoint: curve.G.multiply(passInt).getEncoded(true)
	}
}

function finishDecryptECMult (seedBPass, encryptedPart1, encryptedPart2, passInt, compressed) {
	const derivedHalf1 = seedBPass.slice(0, 32)
	const derivedHalf2 = seedBPass.slice(32, 64)

	const decipher = aes.createDecipheriv('aes-256-ecb', derivedHalf2, Buffer.alloc(0))
	decipher.setAutoPadding(false)
	decipher.end(encryptedPart2)

	const decryptedPart2 = decipher.read()
	const temporary = xor(decryptedPart2, derivedHalf1.slice(16, 32))
	const seedBPart2 = temporary.slice(8, 16)

	const decipher2 = aes.createDecipheriv('aes-256-ecb', derivedHalf2, Buffer.alloc(0))
	decipher2.setAutoPadding(false)
	decipher2.write(encryptedPart1) // first 8 bytes
	decipher2.end(temporary.slice(0, 8)) // last 8 bytes

	const seedBPart1 = xor(decipher2.read(), derivedHalf1.slice(0, 16))
	const seedB = Buffer.concat([seedBPart1, seedBPart2], 24)
	const factorB = BigInteger.fromBuffer(hash256(seedB))

	// d = passFactor * factorB (mod n)
	const d = passInt.multiply(factorB).mod(curve.n)

	return {
		compressed: compressed,
		privateKey: d.toBuffer(32)
	}
}

async function decryptECMultAsync (buffer, passphrase, progressCallback, scryptParameters, promiseInterval) {
	buffer = buffer.slice(1) // FIXME: we can avoid this
	passphrase = Buffer.from(passphrase.normalize('NFC'), 'utf8')
	scryptParameters = scryptParameters || SCRYPT_PARAMS
	const {
		addressHash,
		encryptedPart1,
		encryptedPart2,
		ownerEntropy,
		ownerSalt,
		hasLotSeq,
		compressed,
		N,
		r,
		p
	} = prepareDecryptECMult(buffer, passphrase, progressCallback, scryptParameters)

	const preFactor = await scrypt.async(passphrase, ownerSalt, N, r, p, 32, progressCallback, promiseInterval)

	const {
		passInt,
		passPoint
	} = getPassIntAndPoint(preFactor, ownerEntropy, hasLotSeq)

	const seedBPass = await scrypt.async(passPoint, Buffer.concat([addressHash, ownerEntropy]), 1024, 1, 1, 64, undefined, promiseInterval)

	return finishDecryptECMult(seedBPass, encryptedPart1, encryptedPart2, passInt, compressed)
}

function decryptECMult (buffer, passphrase, progressCallback, scryptParameters) {
	buffer = buffer.slice(1) // FIXME: we can avoid this
	passphrase = Buffer.from(passphrase.normalize('NFC'), 'utf8')
	scryptParameters = scryptParameters || SCRYPT_PARAMS
	const {
		addressHash,
		encryptedPart1,
		encryptedPart2,
		ownerEntropy,
		ownerSalt,
		hasLotSeq,
		compressed,
		N,
		r,
		p
	} = prepareDecryptECMult(buffer, passphrase, progressCallback, scryptParameters)
	const preFactor = scrypt(passphrase, ownerSalt, N, r, p, 32, progressCallback)

	const {
		passInt,
		passPoint
	} = getPassIntAndPoint(preFactor, ownerEntropy, hasLotSeq)

	const seedBPass = scrypt(passPoint, Buffer.concat([addressHash, ownerEntropy]), 1024, 1, 1, 64)

	return finishDecryptECMult(seedBPass, encryptedPart1, encryptedPart2, passInt, compressed)
}

function verify (string) {
	const decoded = bs58check.decodeUnsafe(string)
	if (!decoded) {return false}

	if (decoded.length !== 39) {return false}
	if (decoded.readUInt8(0) !== 0x01) {return false}

	const type = decoded.readUInt8(1)
	const flag = decoded.readUInt8(2)

	// encrypted WIF
	if (type === 0x42) {
		if (flag !== 0xc0 && flag !== 0xe0) {return false}

		// EC mult
	} else if (type === 0x43) {
		if ((flag & ~0x24)) {return false}
	} else {
		return false
	}

	return true
}

/**
 * Implements all functionality that is required to encrypt and decrypt a
 * passphrase-protected private key in compliance with BIP38 specifications.
 *
 * @see {@link https://github.com/bitcoin/bips/blob/master/bip-0038.mediawiki}
 *
 * @export
 * @class BIP38
 */
export class BIP38 {
	/**
	 * Encrypts a private key using the given mnemonic passphrase.
	 *
	 * @static
	 * @param {Buffer} privateKey
	 * @param {string} mnemonic
	 * @param {boolean} [compressed=true]
	 * @returns {string}
	 * @memberof BIP38
	 */
	public static encrypt(privateKey: string | Buffer, mnemonic: string, compressed = true): string {
		return encrypt(
			Buffer.isBuffer(privateKey) ? privateKey : Buffer.from(privateKey, "hex"),
			compressed,
			mnemonic,
			undefined,
			undefined,
		);
	}

	/**
	 * Decrypts an encrypted private key using the given mnemonic passphrase.
	 *
	 * @static
	 * @param {string} value
	 * @param {string} mnemonic
	 * @returns {{ compressed: boolean; privateKey: string }}
	 * @memberof BIP38
	 */
	public static decrypt(value: string, mnemonic: string): { compressed: boolean; privateKey: string } {
		const { compressed, privateKey } = decrypt(value, mnemonic, undefined, undefined);

		return { compressed, privateKey: privateKey.toString("hex") };
	}

	/**
	 * Verifies if the given value has been encrypted with BIP38.
	 *
	 * @static
	 * @param {string} value
	 * @returns {boolean}
	 * @memberof BIP38
	 */
	public static verify(value: string): boolean {
		return verify(value);
	}
}
