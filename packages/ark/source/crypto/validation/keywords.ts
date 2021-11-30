import { BigNumber } from "@payvo/sdk-helpers";
import { Ajv } from "ajv";
import ajvKeywords from "ajv-keywords";

import { TransactionType } from "../enums";
import { ITransactionData } from "../interfaces";
import { configManager } from "../managers";

const maxBytes = (ajv: Ajv) => {
	ajv.addKeyword("maxBytes", {
		type: "string",
		compile(schema, parentSchema) {
			return (data) => {
				if ((parentSchema as any).type !== "string") {
					return false;
				}

				return Buffer.from(data, "utf8").byteLength <= schema;
			};
		},
		errors: false,
		metaSchema: {
			type: "integer",
			minimum: 0,
		},
	});
};

const transactionType = (ajv: Ajv) => {
	ajv.addKeyword("transactionType", {
		// @ts-ignore
		compile(schema) {
			return (data, dataPath, parentObject: ITransactionData) => {
				// Impose dynamic multipayment limit based on milestone
				if (
					data === TransactionType.MultiPayment &&
					parentObject &&
					(!parentObject.typeGroup || parentObject.typeGroup === 1)
				) {
					if (parentObject.asset && parentObject.asset.payments) {
						const limit: number = configManager.getMilestone().multiPaymentLimit || 256;
						return parentObject.asset.payments.length <= limit;
					}
				}

				return data === schema;
			};
		},
		errors: false,
		metaSchema: {
			type: "integer",
			minimum: 0,
		},
	});
};

const network = (ajv: Ajv) => {
	ajv.addKeyword("network", {
		compile(schema) {
			return (data) => {
				return schema && data === configManager.get("network.pubKeyHash");
			};
		},
		errors: false,
		metaSchema: {
			type: "boolean",
		},
	});
};

const bignumber = (ajv: Ajv) => {
	const instanceOf = ajvKeywords.get("instanceof").definition;
	instanceOf.CONSTRUCTORS.BigNumber = BigNumber;

	ajv.addKeyword("bignumber", {
		compile(schema) {
			return (data, dataPath, parentObject: any, property) => {
				const minimum = typeof schema.minimum !== "undefined" ? schema.minimum : 0;
				const maximum = typeof schema.maximum !== "undefined" ? schema.maximum : "9223372036854775807"; // 8 byte maximum

				if (data !== 0 && !data) {
					return false;
				}

				let bignum: BigNumber;
				try {
					bignum = BigNumber.make(data);
				} catch {
					return false;
				}

				if (parentObject && property) {
					parentObject[property] = bignum;
				}

				if (bignum.isLessThan(minimum) && !bignum.isZero()) {
					return false;
				}

				if (bignum.isGreaterThan(maximum)) {
					return false;
				}

				return true;
			};
		},
		errors: false,
		modifying: true,
		metaSchema: {
			type: "object",
			properties: {
				minimum: { type: "integer" },
				maximum: { type: "integer" },
				bypassGenesis: { type: "boolean" },
				block: { type: "boolean" },
			},
			additionalItems: false,
		},
	});
};

export const keywords = [bignumber, maxBytes, network, transactionType];
