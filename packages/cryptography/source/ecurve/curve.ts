import assert from "assert";
import BigInteger from "bigi";

import { Point } from "./point.js";

export class Curve {
	public p: BigInteger;
	public a: BigInteger;
	public b: BigInteger;
	public G: Point;
	public n: BigInteger;
	public h: BigInteger;
	public infinity: Point;
	public pOverFour: BigInteger;
	public pLength: number;

	public constructor(p, a, b, Gx, Gy, n, h) {
		this.p = p;
		this.a = a;
		this.b = b;
		this.G = Point.fromAffine(this, Gx, Gy);
		this.n = n;
		this.h = h;

		this.infinity = new Point(this, undefined, undefined, BigInteger.ZERO);

		// result caching
		this.pOverFour = p.add(BigInteger.ONE).shiftRight(2);

		// determine size of p in bytes
		this.pLength = Math.floor((this.p.bitLength() + 7) / 8);
	}

	public pointFromX(isOdd, x) {
		const alpha = x.pow(3).add(this.a.multiply(x)).add(this.b).mod(this.p);
		const beta = alpha.modPow(this.pOverFour, this.p); // XXX: not compatible with all curves

		let y = beta;
		// @ts-ignore
		if (beta.isEven() ^ !isOdd) {
			y = this.p.subtract(y); // -y % p
		}

		return Point.fromAffine(this, x, y);
	}

	public isInfinity(Q) {
		if (Q === this.infinity) {
			return true;
		}

		return Q.z.signum() === 0 && Q.y.signum() !== 0;
	}

	public isOnCurve(Q) {
		if (this.isInfinity(Q)) {
			return true;
		}

		const x = Q.affineX;
		const y = Q.affineY;
		const a = this.a;
		const b = this.b;
		const p = this.p;

		// Check that xQ and yQ are integers in the interval [0, p - 1]
		if (x.signum() < 0 || x.compareTo(p) >= 0) {
			return false;
		}
		if (y.signum() < 0 || y.compareTo(p) >= 0) {
			return false;
		}

		// and check that y^2 = x^3 + ax + b (mod p)
		const lhs = y.square().mod(p);
		const rhs = x.pow(3).add(a.multiply(x)).add(b).mod(p);
		return lhs.equals(rhs);
	}

	/**
	 * Validate an elliptic curve point.
	 *
	 * See SEC 1, section 3.2.2.1: Elliptic Curve Public Key Validation Primitive
	 */
	public validate(Q) {
		// Check Q != O
		assert(!this.isInfinity(Q), "Point is at infinity");
		assert(this.isOnCurve(Q), "Point is not on the curve");

		// Check nQ = O (where Q is a scalar multiple of G)
		const nQ = Q.multiply(this.n);
		assert(this.isInfinity(nQ), "Point is not a scalar multiple of G");

		return true;
	}
}
