import { z, ZodString } from "zod";
import querystring from "querystring";

const string = () => z.preprocess((val) => String(val), z.string());
const regex = (regex: RegExp) => z.preprocess((val) => String(val), z.string().regex(regex));
const number = () => z.preprocess((val) => Number(val), z.number());

/**
 * An AIP13/26 compliant serialiser and deserialiser.
 *
 * @export
 * @class URI
 */
export class URI {
	/**
	 * The pattern that represents a valid URI according to AIP13/26.
	 *
	 * @type {RegExp}
	 * @memberof URI
	 */
	readonly #pattern: RegExp = new RegExp(/^(?:payvo:)([-0-9a-zA-Z]{1,34})([-a-zA-Z0-9+&@#/%=~_|$?!:,.]*)$/);

	/**
	 * The methods that represent valid actions to be performed through an URI.
	 *
	 * @type {string[]}
	 * @memberof URI
	 */
	readonly #methods: string[] = ["transfer", "vote", "sign-message", "register-delegate"];

	/**
	 * Creates an URI from the given input.
	 *
	 * @param {Record<string, string>} input
	 * @returns {string}
	 * @memberof URI
	 */
	public serialize(input: Record<string, string | number>): string {
		const method: string = input.method as string;

		delete input.method;

		return `payvo:${method}?${querystring.stringify(input)}`;
	}

	/**
	 * Parses the given value according to AIP13/26 specifications and throws
	 * if it encounters any data or formats that are not known according to
	 * specifications.
	 *
	 * These should throw an error because we don't want to pass on data to
	 * the end-user that is unknown and could cause harm to the user and/or
	 * application which would be unable to handle the deserialised content.
	 *
	 * @param {string} data
	 * @returns {*}
	 * @memberof URI
	 */
	public deserialize(data: string): any {
		const parsed: RegExpExecArray | null = this.#pattern.exec(data);

		if (!this.#pattern.test(data) || !parsed) {
			throw new Error("The given data is malformed.");
		}

		try {
			const method: string = parsed[1];
			const params = querystring.parse(parsed[2].substring(1));

			if (!this.#methods.includes(method)) {
				throw new Error(`The given method is unknown: ${method}`);
			}

			const result = z.object(this.#getSchema(method)).safeParse({ method, ...params });

			if (!result.success) {
				throw result.error;
			}

			for (const [key, value] of Object.entries(result.data)) {
				result.data[key] = this.#decodeURIComponent(value);
			}

			return result.data;
		} catch (error) {
			throw new Error(`The given data is malformed: ${error}`);
		}
	}

	/**
	 * Decodes the value until it no longer contains encoded segments.
	 *
	 * @private
	 * @param {*} value
	 * @returns {string}
	 * @memberof URI
	 */
	#decodeURIComponent(value): string {
		while (value !== decodeURIComponent(value)) {
			value = decodeURIComponent(value);
		}

		return value;
	}

	/**
	 * Get the schema that should be used to validate the deserialised data.
	 *
	 * @private
	 * @param {string} method
	 * @returns {object}
	 * @memberof URI
	 */
	#getSchema(method: string) {
		const baseSchema = {
			method: regex(/(transfer|vote|sign-message|register-delegate)/).optional(),
			coin: string(),
			network: string(),
			fee: number().optional(),
		};

		if (method === "vote") {
			return {
				...baseSchema,
				delegate: string(),
			};
		}

		if (method === "sign-message") {
			return {
				...baseSchema,
				message: string(),
			};
		}

		if (method === "register-delegate") {
			return {
				...baseSchema,
				delegate: string(),
			};
		}

		return {
			...baseSchema,
			recipient: string(),
			amount: number().optional(),
			memo: string().optional(),
			vendorField: string().optional(), // Legacy memo, not an ARK agnostic name
			label: string().optional(), // ???
			relay: string().optional(), // ???
		};
	}
}
