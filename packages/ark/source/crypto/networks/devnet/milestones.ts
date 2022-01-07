export const milestones = [
  {
	"activeDelegates": 51,
	"block": {
	  "acceptExpiredTransactionTimestamps": true,
	  "maxPayload": 2_097_152,
	  "maxTransactions": 50,
	  "version": 0
	},
	"blocktime": 8,
	"epoch": "2017-03-21T13:00:00.000Z",
	"fees": {
	  "staticFees": {
		"delegateRegistration": 2_500_000_000,
		"delegateResignation": 2_500_000_000,
		"htlcClaim": 0,
		"htlcLock": 10_000_000,
		"htlcRefund": 0,
		"ipfs": 500_000_000,
		"multiPayment": 10_000_000,
		"multiSignature": 500_000_000,
		"secondSignature": 500_000_000,
		"transfer": 10_000_000,
		"vote": 100_000_000
	  }
	},
	"height": 1,
	"ignoreExpiredTransactions": true,
	"ignoreInvalidSecondSignatureField": true,
	"multiPaymentLimit": 128,
	"reward": 0,
	"vendorFieldLength": 64
  },
  {
	"height": 10_800,
	"reward": 200_000_000
  },
  {
	"block": {
	  "maxPayload": 6_300_000,
	  "maxTransactions": 150
	},
	"height": 21_600
  },
  {
	"block": {
	  "maxPayload": 21_000_000,
	  "maxTransactions": 500
	},
	"height": 910_000
  },
  {
	"height": 950_000,
	"ignoreInvalidSecondSignatureField": false
  },
  {
	"height": 1_750_000,
	"vendorFieldLength": 255
  },
  {
	"block": {
	  "idFullSha256": true
	},
	"height": 1_895_000
  },
  {
	"height": 2_300_000,
	"ignoreExpiredTransactions": false
  },
  {
	"block": {
	  "acceptExpiredTransactionTimestamps": false
	},
	"height": 2_850_000
  },
  {
	"height": 3_963_000,
	"p2p": {
	  "minimumVersions": ["^2.6 || ^2.6.0-next.0"]
	}
  },
  {
	"aip11": true,
	"height": 4_006_000,
	"htlcEnabled": true,
	"p2p": {
	  "minimumVersions": ["^2.6 || ^2.6.0-next.9"]
	}
  },
  {
	"aip36": true,
	"height": 5_636_000
  },
  {
	"aip37": true,
	"height": 5_640_857,
	"p2p": {
	  "minimumVersions": ["^3.0 || ^3.0.0-next.0"]
	}
  }
];
