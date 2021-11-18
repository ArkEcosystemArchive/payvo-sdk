import { assert, test } from "@payvo/sdk-test";

import { QRCode } from "./qrcode";

test("#fromString", () => {
	assert.instance(QRCode.fromString("https://google.com"), QRCode);
});

test("#fromObject", () => {
	assert.instance(QRCode.fromObject({ url: "https://google.com" }), QRCode);
});

test("#toDataURL", async () => {
	const actual = await QRCode.fromString("https://google.com").toDataURL();

	assert.startsWith(actual, "data:image/png;base64,");
});

test("#toDataURL with options", async () => {
	const actual = await QRCode.fromString("https://google.com").toDataURL({ width: 250, margin: 0 });

	assert.startsWith(actual, "data:image/png;base64,");
});

test("should turn into a data URL", async () => {
	assert.string(await QRCode.fromString("https://google.com").toDataURL());
});

for (const type of ["utf8", "svg", "terminal"]) {
	test(`should turn into a ${type} string`, async () => {
		assert.string(await QRCode.fromString("https://google.com").toString(type));
	});
}

test("should turn into a utf-8 string if no argument is given", async () => {
	assert.string(await QRCode.fromString("https://google.com").toString());
});

test.run();
