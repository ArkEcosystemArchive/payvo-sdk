export const unsignedNativeSegwitMusigRegistrationTx = {
	id: "189f015c-2a58-4664-83f4-0b331fa9172a",
	multiSignature: {
		min: 2,
		numberOfSignatures: 3,
		publicKeys: [],
	},
	senderPublicKey: "0277ff9d72486136c7ee68abd46b13d3c1cef1b79f5604cdafafca0d880851bd73",
	signatures: [],
};

export const oneSignatureNativeSegwitMusigRegistrationTx = {
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

export const twoSignatureNativeSegwitMusigRegistrationTx = {
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

export const threeSignatureNativeSegwitMusigRegistrationTx = {
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
	oneSignatureNativeSegwitMusigRegistrationTx,
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

export const unsignedNativeSegwitMusigTransferTx = {
	id: "189f015c-2a58-4664-83f4-0b331fa9172a",
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
	psbt: "cHNidP8BAH0CAAAAAfwqGh7h9o7dS3ijZ/AtMBq9b4+Iwa3oO+cHPfxYif2WAQAAAAD/////AhAnAAAAAAAAFgAU8+nfdtXMv7TinAR6lCgVoypHesRSSgAAAAAAACIAIMwp/GLML5b+bmRjjYlfxK/zvrX8W6X6/wilSXNZq/oIAAAAAAABASvYcgAAAAAAACIAIPyiCzC4pKiEgQmYJffOzuMceywF5Ht0PbysptyeipjxAQVpUiECaUmSR0p7X1TjL5Uz64Y44/4v6+H9kfpYhRIGwf5l0YohAqC8Qr1NRKk+BmOBxEJzNAE1eppvML0O2cNd1w6aCUcGIQPaEqRsx72IB2K06ft+mUluiN0quM8V27GV09g0ikYqwFOuIgYCaUmSR0p7X1TjL5Uz64Y44/4v6+H9kfpYhRIGwf5l0YoMnao10wEAAAACAAAAIgYCoLxCvU1EqT4GY4HEQnM0ATV6mm8wvQ7Zw13XDpoJRwYMd5PAJQEAAAACAAAAIgYD2hKkbMe9iAditOn7fplJbojdKrjPFduxldPYNIpGKsAMYbNhvwEAAAACAAAAAAAiAgMFyHhcVYYahUSjEmItTAUwcZMlFi4dBfsmnNV6tu+nCQx3k8AlAQAAAAMAAAAiAgM3V5TNeopKsAJHq30AqPkb6oy9u9OtOrs1WDEUVYiHmQydqjXTAQAAAAMAAAAiAgPyQZyYe81YQfw45NitgfCts5s+xxxn0jtZa9KGYnGsDAxhs2G/AQAAAAMAAAAA",
	signatures: [],
};

export const oneSignatureNativeSegwitMusigTransferTx = {
	id: "189f015c-2a58-4664-83f4-0b331fa9172a",
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
	psbt: "cHNidP8BAH0CAAAAAfwqGh7h9o7dS3ijZ/AtMBq9b4+Iwa3oO+cHPfxYif2WAQAAAAD/////AhAnAAAAAAAAFgAU8+nfdtXMv7TinAR6lCgVoypHesRSSgAAAAAAACIAIMwp/GLML5b+bmRjjYlfxK/zvrX8W6X6/wilSXNZq/oIAAAAAAABASvYcgAAAAAAACIAIPyiCzC4pKiEgQmYJffOzuMceywF5Ht0PbysptyeipjxIgID2hKkbMe9iAditOn7fplJbojdKrjPFduxldPYNIpGKsBHMEQCIGLXe6AYx8S8714uEqiKdIdFj/YhCS+vhgozf3l4V1DzAiBoJ3AxorBMcxs4F4nU3JRxp1uu4hNufGz01y+Db9QJ0gEBBWlSIQJpSZJHSntfVOMvlTPrhjjj/i/r4f2R+liFEgbB/mXRiiECoLxCvU1EqT4GY4HEQnM0ATV6mm8wvQ7Zw13XDpoJRwYhA9oSpGzHvYgHYrTp+36ZSW6I3Sq4zxXbsZXT2DSKRirAU64iBgJpSZJHSntfVOMvlTPrhjjj/i/r4f2R+liFEgbB/mXRigydqjXTAQAAAAIAAAAiBgKgvEK9TUSpPgZjgcRCczQBNXqabzC9DtnDXdcOmglHBgx3k8AlAQAAAAIAAAAiBgPaEqRsx72IB2K06ft+mUluiN0quM8V27GV09g0ikYqwAxhs2G/AQAAAAIAAAAAACICAwXIeFxVhhqFRKMSYi1MBTBxkyUWLh0F+yac1Xq276cJDHeTwCUBAAAAAwAAACICAzdXlM16ikqwAkerfQCo+RvqjL270606uzVYMRRViIeZDJ2qNdMBAAAAAwAAACICA/JBnJh7zVhB/Djk2K2B8K2zmz7HHGfSO1lr0oZicawMDGGzYb8BAAAAAwAAAAA=",
	signatures: [],
};

export const twoSignatureNativeSegwitMusigTransferTx = {
	id: "189f015c-2a58-4664-83f4-0b331fa9172a",
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
	psbt: "cHNidP8BAH0CAAAAAfwqGh7h9o7dS3ijZ/AtMBq9b4+Iwa3oO+cHPfxYif2WAQAAAAD/////AhAnAAAAAAAAFgAU8+nfdtXMv7TinAR6lCgVoypHesRSSgAAAAAAACIAIMwp/GLML5b+bmRjjYlfxK/zvrX8W6X6/wilSXNZq/oIAAAAAAABASvYcgAAAAAAACIAIPyiCzC4pKiEgQmYJffOzuMceywF5Ht0PbysptyeipjxIgICaUmSR0p7X1TjL5Uz64Y44/4v6+H9kfpYhRIGwf5l0YpHMEQCIGapu6FDMCXd/S6JFcke96g4FfdIeETt6dD8flCHNN4kAiBnBYsdg+r/IAdWJOciJfHCeV+uzMdIQaRPIJt7Hw2RqgEiAgPaEqRsx72IB2K06ft+mUluiN0quM8V27GV09g0ikYqwEcwRAIgYtd7oBjHxLzvXi4SqIp0h0WP9iEJL6+GCjN/eXhXUPMCIGgncDGisExzGzgXidTclHGnW67iE258bPTXL4Nv1AnSAQEFaVIhAmlJkkdKe19U4y+VM+uGOOP+L+vh/ZH6WIUSBsH+ZdGKIQKgvEK9TUSpPgZjgcRCczQBNXqabzC9DtnDXdcOmglHBiED2hKkbMe9iAditOn7fplJbojdKrjPFduxldPYNIpGKsBTriIGAmlJkkdKe19U4y+VM+uGOOP+L+vh/ZH6WIUSBsH+ZdGKDJ2qNdMBAAAAAgAAACIGAqC8Qr1NRKk+BmOBxEJzNAE1eppvML0O2cNd1w6aCUcGDHeTwCUBAAAAAgAAACIGA9oSpGzHvYgHYrTp+36ZSW6I3Sq4zxXbsZXT2DSKRirADGGzYb8BAAAAAgAAAAAAIgIDBch4XFWGGoVEoxJiLUwFMHGTJRYuHQX7JpzVerbvpwkMd5PAJQEAAAADAAAAIgIDN1eUzXqKSrACR6t9AKj5G+qMvbvTrTq7NVgxFFWIh5kMnao10wEAAAADAAAAIgID8kGcmHvNWEH8OOTYrYHwrbObPsccZ9I7WWvShmJxrAwMYbNhvwEAAAADAAAAAA==",
	signatures: [],
};

export const threeSignatureNativeSegwitMusigTransferTx = {
	id: "189f015c-2a58-4664-83f4-0b331fa9172a",
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
	psbt: "cHNidP8BAH0CAAAAAfwqGh7h9o7dS3ijZ/AtMBq9b4+Iwa3oO+cHPfxYif2WAQAAAAD/////AhAnAAAAAAAAFgAU8+nfdtXMv7TinAR6lCgVoypHesRSSgAAAAAAACIAIMwp/GLML5b+bmRjjYlfxK/zvrX8W6X6/wilSXNZq/oIAAAAAAABASvYcgAAAAAAACIAIPyiCzC4pKiEgQmYJffOzuMceywF5Ht0PbysptyeipjxIgICaUmSR0p7X1TjL5Uz64Y44/4v6+H9kfpYhRIGwf5l0YpHMEQCIGapu6FDMCXd/S6JFcke96g4FfdIeETt6dD8flCHNN4kAiBnBYsdg+r/IAdWJOciJfHCeV+uzMdIQaRPIJt7Hw2RqgEiAgKgvEK9TUSpPgZjgcRCczQBNXqabzC9DtnDXdcOmglHBkgwRQIhALhCf3ENXcWeVIMcVqLd6eIp4cwG4Pom0MTOk6x4D5rtAiAsSidFXGkZV9HBjXOkatQjSyrwljfnxPScHkAGu+gnFgEiAgPaEqRsx72IB2K06ft+mUluiN0quM8V27GV09g0ikYqwEcwRAIgYtd7oBjHxLzvXi4SqIp0h0WP9iEJL6+GCjN/eXhXUPMCIGgncDGisExzGzgXidTclHGnW67iE258bPTXL4Nv1AnSAQEFaVIhAmlJkkdKe19U4y+VM+uGOOP+L+vh/ZH6WIUSBsH+ZdGKIQKgvEK9TUSpPgZjgcRCczQBNXqabzC9DtnDXdcOmglHBiED2hKkbMe9iAditOn7fplJbojdKrjPFduxldPYNIpGKsBTriIGAmlJkkdKe19U4y+VM+uGOOP+L+vh/ZH6WIUSBsH+ZdGKDJ2qNdMBAAAAAgAAACIGAqC8Qr1NRKk+BmOBxEJzNAE1eppvML0O2cNd1w6aCUcGDHeTwCUBAAAAAgAAACIGA9oSpGzHvYgHYrTp+36ZSW6I3Sq4zxXbsZXT2DSKRirADGGzYb8BAAAAAgAAAAAAIgIDBch4XFWGGoVEoxJiLUwFMHGTJRYuHQX7JpzVerbvpwkMd5PAJQEAAAADAAAAIgIDN1eUzXqKSrACR6t9AKj5G+qMvbvTrTq7NVgxFFWIh5kMnao10wEAAAADAAAAIgID8kGcmHvNWEH8OOTYrYHwrbObPsccZ9I7WWvShmJxrAwMYbNhvwEAAAADAAAAAA==",
	signatures: [],
};
