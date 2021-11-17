import { WIF } from "./wif.js";

test("#encode", () => {
	expect(
		WIF.encode({
			compressed: true,
			privateKey: "d8839c2432bfd0a67ef10a804ba991eabba19f154a3d707917681d45822a5712",
			version: 170,
		}),
	).toMatchInlineSnapshot(`"SGq4xLgZKCGxs7bjmwnBrWcT4C1ADFEermj846KC97FSv1WFD1dA"`);
});

test("#decode", () => {
	expect(WIF.decode("SGq4xLgZKCGxs7bjmwnBrWcT4C1ADFEermj846KC97FSv1WFD1dA")).toMatchInlineSnapshot(`
		Object {
		  "compressed": true,
		  "privateKey": "d8839c2432bfd0a67ef10a804ba991eabba19f154a3d707917681d45822a5712",
		  "version": 170,
		}
	`);
});
