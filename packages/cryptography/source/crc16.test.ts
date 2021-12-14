import { describe } from "@payvo/sdk-test";

import { CRC16 } from "./crc16";

describe("CRC16", ({ assert, it }) => {
	it("should encode buffer using the CRC-16/CCITT algorithm", () => {
		assert.is(CRC16.encodeCcitt(Buffer.from("hello")), 13_501);
	});
});
