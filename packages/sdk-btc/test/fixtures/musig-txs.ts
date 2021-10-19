export const unsignedTx = {
	id: "189f015c-2a58-4664-83f4-0b331fa9172a",
	multiSignature: {
		min: 2,
		numberOfSignatures: 3,
		publicKeys: [],
	},
	senderPublicKey: "0277ff9d72486136c7ee68abd46b13d3c1cef1b79f5604cdafafca0d880851bd73",
	signatures: [],
};

export const oneSignatureTx = {
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

export const twoSignatureTx = {
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

export const threeSignatureTx = {
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

export const manyTxs = [
	oneSignatureTx,
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
