import { convertBuffer, convertBufferList, convertString, convertStringList } from "./conversion.js";

test("#convertBuffer", () => {
	expect(convertBuffer(Buffer.from("Hello World"))).toMatchInlineSnapshot(`"48656c6c6f20576f726c64"`);
});

test("#convertBufferList", () => {
	expect(convertBufferList([Buffer.from("Hello"), Buffer.from("World")])).toMatchInlineSnapshot(`
		Array [
		  "48656c6c6f",
		  "576f726c64",
		]
	`);
});

test("#convertString", () => {
	expect(convertString("48656c6c6f20576f726c64")).toMatchInlineSnapshot(`
		Object {
		  "data": Array [
		    72,
		    101,
		    108,
		    108,
		    111,
		    32,
		    87,
		    111,
		    114,
		    108,
		    100,
		  ],
		  "type": "Buffer",
		}
	`);
});

test("#convertStringList", () => {
	expect(convertStringList(["48656c6c6f", "576f726c64"])).toMatchInlineSnapshot(`
		Array [
		  Object {
		    "data": Array [
		      72,
		      101,
		      108,
		      108,
		      111,
		    ],
		    "type": "Buffer",
		  },
		  Object {
		    "data": Array [
		      87,
		      111,
		      114,
		      108,
		      100,
		    ],
		    "type": "Buffer",
		  },
		]
	`);
});
