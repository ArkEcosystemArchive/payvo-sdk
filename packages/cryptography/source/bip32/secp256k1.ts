// Based on https://github.com/sclihuiming/tiny-bip32/blob/main/ts-src/tiny-secp256k1/secp256k1.js

import BN from "bn.js";
import elliptic from "elliptic";

import { deterministicGenerate } from "./rfc6979.js";

const EC = elliptic.ec;
const secp256k1 = new EC("secp256k1");

const ZERO32 = Buffer.alloc(32, 0);
const EC_GROUP_ORDER = Buffer.from("fffffffffffffffffffffffffffffffebaaedce6af48a03bbfd25e8cd0364141", "hex");
const EC_P = Buffer.from("fffffffffffffffffffffffffffffffffffffffffffffffffffffffefffffc2f", "hex");

const n = secp256k1.curve.n;
const nDiv2 = n.shrn(1);
const G = secp256k1.curve.g;

const THROW_BAD_PRIVATE = "Expected Private";
const THROW_BAD_POINT = "Expected Point";
const THROW_BAD_TWEAK = "Expected Tweak";
const THROW_BAD_HASH = "Expected Hash";
const THROW_BAD_SIGNATURE = "Expected Signature";
const THROW_BAD_EXTRA_DATA = "Expected Extra Data (32 bytes)";

const isScalar = (x) => Buffer.isBuffer(x) && x.length === 32;

const isOrderScalar = (x) => {
	if (!isScalar(x)) {
		return false;
	}

	return x.compare(EC_GROUP_ORDER) < 0; // < G
};

const isPoint = (p) => {
	if (!Buffer.isBuffer(p)) {
		return false;
	}

	if (p.length < 33) {
		return false;
	}

	const t = p[0];
	const x = p.slice(1, 33);

	if (x.compare(ZERO32) === 0) {
		return false;
	}

	if (x.compare(EC_P) >= 0) {
		return false;
	}

	if ((t === 0x02 || t === 0x03) && p.length === 33) {
		try {
			decodeFrom(p);
		} catch {
			return false;
		} // TODO: temporary

		return true;
	}

	const y = p.slice(33);

	if (y.compare(ZERO32) === 0) {
		return false;
	}

	if (y.compare(EC_P) >= 0) {
		return false;
	}

	if (t === 0x04 && p.length === 65) {
		return true;
	}

	return false;
};

const __isPointCompressed = (p) => p[0] !== 0x04;

const isPointCompressed = (p) => {
	if (!isPoint(p)) {
		return false;
	}

	return __isPointCompressed(p);
};

const isPrivate = (x) => {
	if (!isScalar(x)) {
		return false;
	}

	return (
		x.compare(ZERO32) > 0 && x.compare(EC_GROUP_ORDER) < 0 // > 0
	); // < G
};

const isSignature = (value) => {
	const r = value.slice(0, 32);
	const s = value.slice(32, 64);

	return (
		Buffer.isBuffer(value) && value.length === 64 && r.compare(EC_GROUP_ORDER) < 0 && s.compare(EC_GROUP_ORDER) < 0
	);
};

const assumeCompression = (value, pubkey?) => {
	if (value === undefined && pubkey !== undefined) {
		return __isPointCompressed(pubkey);
	}

	if (value === undefined) {
		return true;
	}

	return value;
};

const fromBuffer = (d) => new BN(d);

const toBuffer = (d) => d.toArrayLike(Buffer, "be", 32);

const decodeFrom = (P) => secp256k1.curve.decodePoint(P);

const getEncoded = (P, compressed) => Buffer.from(P._encode(compressed));

const pointAdd = (pA, pB, __compressed) => {
	if (!isPoint(pA)) {
		throw new TypeError(THROW_BAD_POINT);
	}
	if (!isPoint(pB)) {
		throw new TypeError(THROW_BAD_POINT);
	}

	const a = decodeFrom(pA);
	const b = decodeFrom(pB);
	const pp = a.add(b);

	if (pp.isInfinity()) {
		return null;
	}

	const compressed = assumeCompression(__compressed, pA);

	return getEncoded(pp, compressed);
};

const pointAddScalar = (p, tweak, __compressed) => {
	if (!isPoint(p)) {
		throw new TypeError(THROW_BAD_POINT);
	}

	if (!isOrderScalar(tweak)) {
		throw new TypeError(THROW_BAD_TWEAK);
	}

	const compressed = assumeCompression(__compressed, p);
	const pp = decodeFrom(p);

	if (tweak.compare(ZERO32) === 0) {
		return getEncoded(pp, compressed);
	}

	const tt = fromBuffer(tweak);
	const qq = G.mul(tt);
	const uu = pp.add(qq);

	if (uu.isInfinity()) {
		return null;
	}

	return getEncoded(uu, compressed);
};

const pointCompress = (p, __compressed) => {
	if (!isPoint(p)) {
		throw new TypeError(THROW_BAD_POINT);
	}

	const pp = decodeFrom(p);

	if (pp.isInfinity()) {
		throw new TypeError(THROW_BAD_POINT);
	}

	const compressed = assumeCompression(__compressed, p);

	return getEncoded(pp, compressed);
};

const pointFromScalar = (d, __compressed): Buffer => {
	if (!isPrivate(d)) {
		throw new TypeError(THROW_BAD_PRIVATE);
	}

	const dd = fromBuffer(d);
	const pp = G.mul(dd);

	if (pp.isInfinity()) {
		throw new Error("Point is infinity.");
	}

	const compressed = assumeCompression(__compressed);

	return getEncoded(pp, compressed);
};

const pointMultiply = (p, tweak, __compressed) => {
	if (!isPoint(p)) {
		throw new TypeError(THROW_BAD_POINT);
	}

	if (!isOrderScalar(tweak)) {
		throw new TypeError(THROW_BAD_TWEAK);
	}

	const compressed = assumeCompression(__compressed, p);
	const pp = decodeFrom(p);
	const tt = fromBuffer(tweak);
	const qq = pp.mul(tt);

	if (qq.isInfinity()) {
		return null;
	}

	return getEncoded(qq, compressed);
};

const privateAdd = (d, tweak) => {
	if (!isPrivate(d)) {
		throw new TypeError(THROW_BAD_PRIVATE);
	}

	if (!isOrderScalar(tweak)) {
		throw new TypeError(THROW_BAD_TWEAK);
	}

	const dd = fromBuffer(d);
	const tt = fromBuffer(tweak);
	const dt = toBuffer(dd.add(tt).umod(n));

	if (!isPrivate(dt)) {
		return null;
	}

	return dt;
};

const privateSub = (d, tweak) => {
	if (!isPrivate(d)) {
		throw new TypeError(THROW_BAD_PRIVATE);
	}

	if (!isOrderScalar(tweak)) {
		throw new TypeError(THROW_BAD_TWEAK);
	}

	const dd = fromBuffer(d);
	const tt = fromBuffer(tweak);
	const dt = toBuffer(dd.sub(tt).umod(n));

	if (!isPrivate(dt)) {
		return null;
	}

	return dt;
};

const sign = (hash, x, addData?) => {
	if (!isScalar(hash)) {
		throw new TypeError(THROW_BAD_HASH);
	}

	if (!isPrivate(x)) {
		throw new TypeError(THROW_BAD_PRIVATE);
	}

	if (addData !== undefined && !isScalar(addData)) {
		throw new TypeError(THROW_BAD_EXTRA_DATA);
	}

	const d = fromBuffer(x);
	const e = fromBuffer(hash);

	let r, s;
	const checkSig = function (k) {
		const kI = fromBuffer(k);
		const Q = G.mul(kI);

		if (Q.isInfinity()) {
			return false;
		}

		r = Q.x.umod(n);

		if (r.isZero() === 0) {
			return false;
		}

		s = kI
			.invm(n)
			.mul(e.add(d.mul(r)))
			.umod(n);

		if (s.isZero() === 0) {
			return false;
		}

		return true;
	};

	deterministicGenerate(hash, x, checkSig, isPrivate, addData);

	// enforce low S values, see bip62: 'low s values in signatures'
	if (s.cmp(nDiv2) > 0) {
		s = n.sub(s);
	}

	const buffer = Buffer.allocUnsafe(64);
	toBuffer(r).copy(buffer, 0);
	toBuffer(s).copy(buffer, 32);

	return buffer;
};

const signWithEntropy = (hash, x, addData) => sign(hash, x, addData);

const verify = (hash, q, signature, strict?) => {
	if (!isScalar(hash)) {
		throw new TypeError(THROW_BAD_HASH);
	}

	if (!isPoint(q)) {
		throw new TypeError(THROW_BAD_POINT);
	}

	// 1.4.1 Enforce r and s are both integers in the interval [1, n − 1] (1, isSignature enforces '< n - 1')
	if (!isSignature(signature)) {
		throw new TypeError(THROW_BAD_SIGNATURE);
	}

	const Q = decodeFrom(q);
	const r = fromBuffer(signature.slice(0, 32));
	const s = fromBuffer(signature.slice(32, 64));

	if (strict && s.cmp(nDiv2) > 0) {
		return false;
	}

	// 1.4.1 Enforce r and s are both integers in the interval [1, n − 1] (2, enforces '> 0')
	// if (r.gtn(0) <= 0 /* || r.compareTo(n) >= 0 */) return false;
	if (!r.gtn(0) /* || r.compareTo(n) >= 0 */) {
		return false;
	}

	// if (s.gtn(0) <= 0 /* || s.compareTo(n) >= 0 */) return false;
	if (!s.gtn(0) /* || s.compareTo(n) >= 0 */) {
		return false;
	}

	// 1.4.2 H = Hash(M), already done by the user
	// 1.4.3 e = H
	const e = fromBuffer(hash);

	// Compute s^-1
	const sInv = s.invm(n);

	// 1.4.4 Compute u1 = es^−1 mod n
	//               u2 = rs^−1 mod n
	const u1 = e.mul(sInv).umod(n);
	const u2 = r.mul(sInv).umod(n);

	// 1.4.5 Compute R = (xR, yR)
	//               R = u1G + u2Q
	const R = G.mulAdd(u1, Q, u2);

	// 1.4.5 (cont.) Enforce R is not at infinity
	if (R.isInfinity()) {
		return false;
	}

	// 1.4.6 Convert the field element R.x to an integer
	const xR = R.x;

	// 1.4.7 Set v = xR mod n
	const v = xR.umod(n);

	// 1.4.8 If v = r, output "valid", and if v != r, output "invalid"
	return v.eq(r);
};

export const ecc = {
	isPoint,
	isPointCompressed,
	isPrivate,
	pointAdd,
	pointAddScalar,
	pointCompress,
	pointFromScalar,
	pointMultiply,
	privateAdd,
	privateSub,
	sign,
	signWithEntropy,
	verify,
};
