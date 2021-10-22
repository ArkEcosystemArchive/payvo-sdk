export const unsignedMusigRegistrationTx = {
	id: "189f015c-2a58-4664-83f4-0b331fa9172a",
	multiSignature: {
		min: 2,
		numberOfSignatures: 3,
		publicKeys: [],
	},
	senderPublicKey: "0277ff9d72486136c7ee68abd46b13d3c1cef1b79f5604cdafafca0d880851bd73",
	signatures: [],
};

export const oneSignatureMusigRegistrationTx = {
	id: "189f015c-2a58-4664-83f4-0b331fa9172a",
	multiSignature: {
		min: 2,
		numberOfSignatures: 3,
		publicKeys: [
			"Vpub5mtyU6Hx9xrx63Y3W4aGW1LuQkmwrq9xsQNgX7tDAM8DTHhE7vXMZ7Hue2FR8SMAGDW57fy76HFmN1jnckSmeX2cDMWVA1KViot6bLgJZuN",
		],
	},
	senderPublicKey: "0277ff9d72486136c7ee68abd46b13d3c1cef1b79f5604cdafafca0d880851bd73",
	signatures: ["H4yJgFpPH6b0ED6OYBm0IJILt5u6h+E37WbKkTNjdAQZG/lS7ShWcyJ713QRNJRoEn3g7JrWcJjV+1hoicCAz6A="],
};

export const twoSignatureMusigRegistrationTx = {
	id: "189f015c-2a58-4664-83f4-0b331fa9172a",
	multiSignature: {
		min: 2,
		numberOfSignatures: 3,
		publicKeys: [
			"Vpub5mtyU6Hx9xrx63Y3W4aGW1LuQkmwrq9xsQNgX7tDAM8DTHhE7vXMZ7Hue2FR8SMAGDW57fy76HFmN1jnckSmeX2cDMWVA1KViot6bLgJZuN",
			"Vpub5mYgzMb93fDtChZ2xmY7g3aEgHFjdgQE6P596AiL5zENEcVjDCciGfWmhZJngn6gVmBRh6E1Vp7aZYY7wQkMRTQSKhauGwYAUEdiGbS35D1",
		],
	},
	senderPublicKey: "0277ff9d72486136c7ee68abd46b13d3c1cef1b79f5604cdafafca0d880851bd73",
	signatures: [
		"H4yJgFpPH6b0ED6OYBm0IJILt5u6h+E37WbKkTNjdAQZG/lS7ShWcyJ713QRNJRoEn3g7JrWcJjV+1hoicCAz6A=",
		"Hwap/1p+ng4GjwzJSzRw/YLi2mV1auhEWQa3mkP7j06BLHG+b69+VLBU68Qw0R0y0YTGsFi2b1Ls+dJZtk6b0FA=",
	],
};

export const threeSignatureMusigRegistrationTx = {
	id: "189f015c-2a58-4664-83f4-0b331fa9172a",
	multiSignature: {
		min: 2,
		numberOfSignatures: 3,
		publicKeys: [
			"Vpub5mtyU6Hx9xrx63Y3W4aGW1LuQkmwrq9xsQNgX7tDAM8DTHhE7vXMZ7Hue2FR8SMAGDW57fy76HFmN1jnckSmeX2cDMWVA1KViot6bLgJZuN",
			"Vpub5mYgzMb93fDtChZ2xmY7g3aEgHFjdgQE6P596AiL5zENEcVjDCciGfWmhZJngn6gVmBRh6E1Vp7aZYY7wQkMRTQSKhauGwYAUEdiGbS35D1",
			"Vpub5mSSLBPFi3acdjk5giwrmA7gXPAJsiLXXKibgjXYycH1gp95t2Pqv3U8dT9kEGxvAdfiN5DGmozDmZ7sJyDuMgfxt4h4KujF7MWt5tQH8py",
		],
	},
	senderPublicKey: "0277ff9d72486136c7ee68abd46b13d3c1cef1b79f5604cdafafca0d880851bd73",
	signatures: [
		"H4yJgFpPH6b0ED6OYBm0IJILt5u6h+E37WbKkTNjdAQZG/lS7ShWcyJ713QRNJRoEn3g7JrWcJjV+1hoicCAz6A=",
		"Hwap/1p+ng4GjwzJSzRw/YLi2mV1auhEWQa3mkP7j06BLHG+b69+VLBU68Qw0R0y0YTGsFi2b1Ls+dJZtk6b0FA=",
		"IE6oFRIsi8qYTtujTSEhgOXPPdPBUSTzvCggm0Zq8kdBemOsEz2ElRuqHRmEaGcuQa/qvf2sBfGlLK5Gknslykc=",
	],
};

export const manyMusigRegistrationTxs = [
	oneSignatureMusigRegistrationTx,
	{
		id: "ac6bc776-5f46-4a71-86cd-a6a5c094189b",
		multiSignature: {
			min: 2,
			numberOfSignatures: 3,
			publicKeys: [
				"Vpub5mYgzMb93fDtChZ2xmY7g3aEgHFjdgQE6P596AiL5zENEcVjDCciGfWmhZJngn6gVmBRh6E1Vp7aZYY7wQkMRTQSKhauGwYAUEdiGbS35D1",
				"Vpub5mtyU6Hx9xrx63Y3W4aGW1LuQkmwrq9xsQNgX7tDAM8DTHhE7vXMZ7Hue2FR8SMAGDW57fy76HFmN1jnckSmeX2cDMWVA1KViot6bLgJZuN",
				"Vpub5mSSLBPFi3acdjk5giwrmA7gXPAJsiLXXKibgjXYycH1gp95t2Pqv3U8dT9kEGxvAdfiN5DGmozDmZ7sJyDuMgfxt4h4KujF7MWt5tQH8py",
			],
		},
		senderPublicKey: "0277ff9d72486136c7ee68abd46b13d3c1cef1b79f5604cdafafca0d880851bd73",
		signatures: ["IE6oFRIsi8qYTtujTSEhgOXPPdPBUSTzvCggm0Zq8kdBemOsEz2ElRuqHRmEaGcuQa/qvf2sBfGlLK5Gknslykc="],
	},
];

export const unsignedTransferTx = {
	id: "189f015c-2a58-4664-83f4-0b331fa9172a",
	senderPublicKey: "0277ff9d72486136c7ee68abd46b13d3c1cef1b79f5604cdafafca0d880851bd73",
	psbt: "cHNidP8BAH0CAAAAAfwqGh7h9o7dS3ijZ/AtMBq9b4+Iwa3oO+cHPfxYif2WAQAAAAD/////AhAnAAAAAAAAFgAU8+nfdtXMv7TinAR6lCgVoypHesRSSgAAAAAAACIAIMwp/GLML5b+bmRjjYlfxK/zvrX8W6X6/wilSXNZq/oIAAAAAAABASvYcgAAAAAAACIAIPyiCzC4pKiEgQmYJffOzuMceywF5Ht0PbysptyeipjxAAAA",
	signatures: [],
};

export const oneSignatureTransferTx = {
	id: "189f015c-2a58-4664-83f4-0b331fa9172a",
	senderPublicKey: "0277ff9d72486136c7ee68abd46b13d3c1cef1b79f5604cdafafca0d880851bd73",
	psbt: "cHNidP8BAH0CAAAAAfwqGh7h9o7dS3ijZ/AtMBq9b4+Iwa3oO+cHPfxYif2WAQAAAAD/////AhAnAAAAAAAAFgAU8+nfdtXMv7TinAR6lCgVoypHesRSSgAAAAAAACIAIMwp/GLML5b+bmRjjYlfxK/zvrX8W6X6/wilSXNZq/oIAAAAAAABAP17AQIAAAAAAQFKD67a/3Sxj3AG8rL4EwfMW4FUwADiXTEYvIfKwT+2bQEAAAAA/v///wIQJwAAAAAAABYAFKAaFjbzNQbAUr9KNkzlOzlOeqRb2HIAAAAAAAAiACD8ogswuKSohIEJmCX3zs7jHHssBeR7dD28rKbcnoqY8QQARzBEAiAtaxxe83vicwaMFPlfyPwgCZ2GV9Z2ZmLUKVb60ISinAIgFqnEi9wztQ/xIKEfGEABa2u6rCSP0tGJVX/zptWnhnUBRzBEAiBaXFplmx8pD968q30SVE0qZYFL5tCIAI7Fm6MvLRCLbAIgWL1twFWNx6iuOZo3//qhv36b6N1+Sv5V4TiVcVjJVxUBaVIhAv6jUnyTmJcbxskb4eZdaL+DG9R+RYV2svm1p5J110/xIQN8LVybhIgH9ucde0Y7N4+GqXWDPi0s9Yn5DGqbxP9ALCEDk7Tjvci0Sncb25QDKpc8kYzUMPV7RMqQ/lx6lORwoVZTriv/HwAiAgKgvEK9TUSpPgZjgcRCczQBNXqabzC9DtnDXdcOmglHBkgwRQIhALhCf3ENXcWeVIMcVqLd6eIp4cwG4Pom0MTOk6x4D5rtAiAsSidFXGkZV9HBjXOkatQjSyrwljfnxPScHkAGu+gnFgEBBWlSIQJpSZJHSntfVOMvlTPrhjjj/i/r4f2R+liFEgbB/mXRiiECoLxCvU1EqT4GY4HEQnM0ATV6mm8wvQ7Zw13XDpoJRwYhA9oSpGzHvYgHYrTp+36ZSW6I3Sq4zxXbsZXT2DSKRirAU64iBgJpSZJHSntfVOMvlTPrhjjj/i/r4f2R+liFEgbB/mXRigydqjXTAQAAAAIAAAAiBgKgvEK9TUSpPgZjgcRCczQBNXqabzC9DtnDXdcOmglHBhyotLRIMAAAgAEAAIAAAACAAgAAgAEAAAACAAAAIgYD2hKkbMe9iAditOn7fplJbojdKrjPFduxldPYNIpGKsAMYbNhvwEAAAACAAAAAAAA",
	signatures: [],
};
