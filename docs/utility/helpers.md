# Support

This is a Collection of Helpers for the Platform SDK. The implementation adheres to the contracts laid out in the [specification](/docs/specification.md).

## Installation

```bash
yarn add @payvo/helpers
```

## Usage

### Arr

#### Importing the `Arr` class

```typescript
import { Arr } from "@payvo/helpers";
```

#### Get a random element from the given array

```typescript
Arr.randomElement(items: any[]);
```

### Bignumber

#### Importing the `BigNumber` class

```typescript
import { BigNumber } from "@payvo/helpers";
```

#### Create a new `BigNumber` instance from the given value

```typescript
BigNumber.make(value: NumberLike, decimals?: number): BigNumber;
```

#### Set the amount of decimals to the given limit

```typescript
bigNumber.decimalPlaces(decimals?: number): BigNumber;
```

#### Add the given value to the existing value

```typescript
bigNumber.plus(value: NumberLike): BigNumber;
```

#### Subtract the given value from the existing value

```typescript
bigNumber.minus(value: NumberLike): BigNumber;
```

#### Divide the existing value by the given value

```typescript
bigNumber.divide(value: NumberLike): BigNumber;
```

#### Multiply the existing value by the given value

```typescript
bigNumber.times(value: NumberLike): BigNumber;
```

#### Determine if the value is `NaN`

```typescript
bigNumber.isNaN(): boolean;
```

#### Determine if the value is positive

```typescript
bigNumber.isPositive(): boolean;
```

#### Determine if the value is finite

```typescript
bigNumber.isFinite(): boolean;
```

#### Get the difference between the given and actual value

```typescript
bigNumber.comparedTo(value: NumberLike): number;
```

#### Determine if the actual value is equal to the expected value

```typescript
bigNumber.isEqualTo(value: NumberLike): boolean;
```

#### Determine if the actual value is greater than the expected value

```typescript
bigNumber.isGreaterThan(value: NumberLike): boolean;
```

#### Determine if the actual value is greater than or equal to the expected value

```typescript
bigNumber.isGreaterThanOrEqualTo(value: NumberLike): boolean;
```

#### Determine if the actual value is less than the expected value

```typescript
bigNumber.isLessThan(value: NumberLike): boolean;
```

#### Determine if the actual value is less than or equal to the expected value

```typescript
bigNumber.isLessThanOrEqualTo(value: NumberLike): boolean;
```

#### Return the value as satoshis

```typescript
bigNumber.toSatoshi(): BigNumber;
```

#### Return the value as human-readable number

```typescript
bigNumber.toHuman(decimals = 8): string;
```

#### Return the value as a string with a limited amount of decimals

```typescript
bigNumber.toFixed(decimals?: number): string;
```

#### Return the value as an integer

```typescript
bigNumber.toNumber(): number;
```

#### Return the value as a string

```typescript
bigNumber.toString(): string;
```

#### Return the value as a string, including the minus symbol if applicable

```typescript
bigNumber.valueOf(): string;
```

### Censor

#### Importing the `Censor` class

```typescript
import { Censor } from "@payvo/helpers";

const censor = new Censor();
```

#### Determine if the value contains bad terms

```typescript
censor.isBad(value: string): boolean;
```

#### Remove all bad terms from the value

```typescript
censor.process(value: string): string;
```

### Markdown

#### Importing the `Markdown` class

```typescript
import { Markdown } from "@payvo/helpers";
```

#### Parse the given content into HTML

```typescript
Markdown.parse(content: string): { meta: MarkdownMeta; content: String };
```

### QRCode

#### Importing the `QRCode` class

```typescript
import { QRCode } from "@payvo/helpers";
```

#### Create a new QRCode from a string

```typescript
QRCode.fromString(value: string): QRCode;
```

#### Create a new QRCode from an object of keys and values

```typescript
QRCode.fromObject(value: object): QRCode;
```

#### Get the Base64 Data URL representation of the QRCode

```typescript
await qrcode.toDataURL(options: QRCodeToDataURLOptions = {}): Promise<string>;
```

#### Get the string representation of the QRCode

```typescript
await qrcode.toString(type: StringType = "utf8"): Promise<string>;
```

### Validator

#### Importing the `Validator` class

```typescript
import { Validator } from "@payvo/helpers";

const validator = new Validator();
```

#### Validate the given data against the schema

```typescript
validator.validate(data: object, schema: { validateSync: Function }): void;
```

#### Check if the validation passed

```typescript
validator.passes(): boolean;
```

#### Check if the validation failed

```typescript
validator.fails(): boolean;
```

#### Get a list of all error messages

```typescript
validator.errors(): string[] | undefined;
```

#### Get the error object from `yup`

```typescript
validator.error(): ValidationError | undefined;
```

## Security

If you discover a security vulnerability within this package, please send an e-mail to [security@payvo.com](mailto:security@payvo.com). All security vulnerabilities will be promptly addressed.
