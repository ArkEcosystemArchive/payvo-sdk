import BigInteger from "bigi";

import { Curve } from "./curve.js";

const curve = {
	Gx: "79be667ef9dcbbac55a06295ce870b07029bfcdb2dce28d959f2815b16f81798",
	Gy: "483ada7726a3c4655da4fbfc0e1108a8fd17b448a68554199c47d08ffb10d4b8",
	a: "00",
	b: "07",
	h: "01",
	n: "fffffffffffffffffffffffffffffffebaaedce6af48a03bbfd25e8cd0364141",
	p: "fffffffffffffffffffffffffffffffffffffffffffffffffffffffefffffc2f",
};

const p = new BigInteger(curve.p, 16, undefined);
const a = new BigInteger(curve.a, 16, undefined);
const b = new BigInteger(curve.b, 16, undefined);
const n = new BigInteger(curve.n, 16, undefined);
const h = new BigInteger(curve.h, 16, undefined);
const Gx = new BigInteger(curve.Gx, 16, undefined);
const Gy = new BigInteger(curve.Gy, 16, undefined);

export const secp256k1 = new Curve(p, a, b, Gx, Gy, n, h);
