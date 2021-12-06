// https://github.com/jquense/yup/issues/524#issuecomment-866190084

import BaseSchema, { CastOptions } from 'yup/lib/schema'
import { AnyObject, Callback, InternalOptions } from 'yup/lib/types'
import runTests from 'yup/lib/util/runTests'

export class MapSchema<TCast = any, TContext = AnyObject, TOutput = any> extends BaseSchema<TCast, TContext, TOutput> {
	private _keySchema: BaseSchema
	private _valueSchema: BaseSchema

	public constructor(keySchema, valueSchema) {
		super({
			type: 'map',
		})

		this._keySchema = keySchema;
		this._valueSchema = valueSchema;
	}

	protected override _typeCheck(_value: any): _value is NonNullable<TCast> {
		return _value && typeof _value === 'object'
	}

	protected override _cast(rawValue: any, _options: CastOptions<TContext>): any {
		const value = super._cast(rawValue, _options)

		const result = {}
		Object.entries(value).forEach(([key, value]) => {
			result[this._keySchema.cast(key)] = this._valueSchema.cast(value)
		})

		return result
	}

	protected override _validate(_value: any,
		options: InternalOptions = {},
		cb: Callback): void {
		const errors = []
		const { abortEarly, sync, path = '' } = options
		const originalValue = options.originalValue != null ? options.originalValue : _value

		// let originalValue =options.originalValue != null ? options.originalValue : _value
		const tests: any[] = []

		if (!this._typeCheck(_value)) throw new Error('type is not an object.')

		Object.entries(_value).forEach(([key, value]) => {
			const innerOptions = {
				...options,
				strict: true,
				parent: value,
				path: path ? `${path}.${key}` : key,
				originalValue: originalValue[key],
			}

			tests.push(() => this._keySchema.validate(key, innerOptions))
			tests.push(() => this._valueSchema.validate(value, innerOptions))

		})

		return runTests({
			sync,
			path,
			value: _value,
			errors,
			tests,
			endEarly: abortEarly,
		}, cb)

	}

}
