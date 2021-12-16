import { decrypt, encrypt } from "crypto-js/aes";
import UTF8 from "crypto-js/enc-utf8";

export class AES {
	public static encrypt(value: string, password: string): string {
		return encrypt(value, password).toString();
	}

	public static decrypt(value: string, password: string): string {
		return decrypt(value, password).toString(UTF8);
	}

	public static verify(value: string, password: string): boolean {
		try {
			return !!this.decrypt(value, password);
		} catch {
			return false;
		}
	}
}
