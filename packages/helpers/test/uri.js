export const fixtures = [
	[
		"payvo:transfer?coin=ark&network=ark.mainnet&recipient=AePNZAAtWhLsGFLXtztGLAPnKm98VVC8tJ",
		{
			method: "transfer",
			coin: "ark",
			network: "ark.mainnet",
			recipient: "AePNZAAtWhLsGFLXtztGLAPnKm98VVC8tJ",
		},
	],
	[
		"payvo:transfer?coin=lisk&network=lisk.mainnet&recipient=8290259686148623987L",
		{
			method: "transfer",
			coin: "lisk",
			network: "lisk.mainnet",
			recipient: "8290259686148623987L",
		},
	],
	[
		"payvo:transfer?coin=ark&network=ark.mainnet&recipient=AePNZAAtWhLsGFLXtztGLAPnKm98VVC8tJ&amount=10&vendorField=999&fee=0.1&relay=1.1.1.1",
		{
			method: "transfer",
			coin: "ark",
			network: "ark.mainnet",
			recipient: "AePNZAAtWhLsGFLXtztGLAPnKm98VVC8tJ",
			amount: "10",
			vendorField: "999",
			fee: "0.1",
			relay: "1.1.1.1",
		},
	],
	[
		"payvo:vote?coin=ark&network=ark.mainnet&delegate=genesis_10&fee=0.1",
		{
			method: "vote",
			coin: "ark",
			network: "ark.mainnet",
			delegate: "genesis_10",
			fee: "0.1",
		},
	],
	[
		"payvo:sign-message?coin=ark&network=ark.mainnet&message=This%20is%20my%20message",
		{
			coin: "ark",
			method: "sign-message",
			network: "ark.mainnet",
			message: "This is my message",
		},
	],
	[
		"payvo:register-delegate?coin=ark&network=ark.mainnet&delegate=mydelegatename&fee=0.0001",
		{
			method: "register-delegate",
			coin: "ark",
			network: "ark.mainnet",
			delegate: "mydelegatename",
			fee: "0.0001",
		},
	],
];
