import { object } from "yup";

export const createDynamicSchema = (entity, keySchema, valueSchema) => {
	const result = {};

	for (const key of Object.keys(entity)) {
		result[keySchema.cast(key)] = valueSchema;
	}

	return object().shape(result);
}
