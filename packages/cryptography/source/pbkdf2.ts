import AES from "crypto-js/aes";
import UTF8 from "crypto-js/enc-utf8";

export class PBKDF2 {
	public static encrypt(value: string, password: string): string {
		return AES.encrypt(value, password).toString();
	}

	public static decrypt(value: string, password: string): string {
		return AES.decrypt(value, password).toString(UTF8);
	}

	public static verify(value: string, password: string): boolean {
		try {
			return !!this.decrypt(value, password);
		} catch (e) {
			console.log("what")
			return false;
		}
	}
}
