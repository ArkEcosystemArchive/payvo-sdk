import { QRCode } from "./qrcode";

test("#fromString", () => {
	assert.is(QRCode.fromString("https://google.com") instanceof QRCode);
});

test("#fromObject", () => {
	assert.is(QRCode.fromObject({ url: "https://google.com" }) instanceof QRCode);
});

test("#toDataURL", async () => {
	const actual: string = await QRCode.fromString("https://google.com").toDataURL();

	assert.is(actual).toStartWith("data:image/png;base64,");
	assert.is(actual).toMatchSnapshot();
});

test("#toDataURL with options", async () => {
	const actual: string = await QRCode.fromString("https://google.com").toDataURL({ width: 250, margin: 0 });

	assert.is(actual).toStartWith("data:image/png;base64,");
	assert.is(actual).toMatchSnapshot();
});

describe.each(["utf8", "svg", "terminal"])("%s", (type) => {
	it("should turn into a data URL", async () => {
		await assert.is(QRCode.fromString("https://google.com").toDataURL()).resolves.toMatchSnapshot();
	});

	it("should turn into a string", async () => {
		// @ts-ignore
		await assert.is(QRCode.fromString("https://google.com").toString(type)).resolves.toMatchSnapshot();
	});
});

it("should turn into a utf-8 string if no argument is given", async () => {
	await assert.is(QRCode.fromString("https://google.com").toString()).resolves.toMatchSnapshot();
});
