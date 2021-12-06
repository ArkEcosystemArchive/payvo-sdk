import { AnySchema, lazy, object } from "yup";

export const objectSchema = (keySchema: AnySchema, valueSchema: AnySchema) => lazy((entity) => {
	const result = {};

	for (const key of Object.keys(entity)) {
		result[keySchema.cast(key)] = valueSchema;
	}

	return object().shape(result);
});

export const objectSchemaRequired = (keySchema: AnySchema, valueSchema: AnySchema) => lazy((entity) => {
	const result = {};

	for (const key of Object.keys(entity)) {
		result[keySchema.cast(key)] = valueSchema;
	}

	return object().shape(result).required();
});
