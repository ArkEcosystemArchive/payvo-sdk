import { compareVersion } from "./ledger.service.helpers";

describe("compareVersion", () => {
	it("should compare the current version with the minimum version", () => {
		expect(compareVersion("81.0.1212.121", "80.4.1121.121")).toBeTruthy();
		expect(compareVersion("81.0.1212.121", "80.4.9921.121")).toBeTruthy();
		expect(compareVersion("80.0.1212.121", "80.4.9921.121")).toBeFalsy();
		expect(compareVersion("4.4.0", "4.4.1")).toBeFalsy();
		expect(compareVersion("5.24", "5.2")).toBeTruthy();
		expect(compareVersion("4.1", "4.1.2")).toBeFalsy();
		expect(compareVersion("4.1.2", "4.1")).toBeTruthy();
		expect(compareVersion("4.4.4.4", "4.4.4.4.4")).toBeFalsy();
		expect(compareVersion("4.4.4.4.4.4", "4.4.4.4.4")).toBeTruthy();
		expect(compareVersion("0", "1")).toBeFalsy();
		expect(compareVersion("1", "1")).toBeTruthy();
		expect(compareVersion("1", "1.0.00000.0000")).toBeTruthy();
		expect(compareVersion("", "1")).toBeFalsy();
		expect(compareVersion("10.0.1", "10.1")).toBeFalsy();
	});
});
