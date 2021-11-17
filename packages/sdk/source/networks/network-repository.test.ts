import "jest-extended";

import { manifest } from "../../../ark/distribution/manifest";
import { NetworkRepository } from "./network-repository";

let subject: NetworkRepository;

beforeEach(() => (subject = new NetworkRepository(manifest.networks)));

test("#all", () => {
	expect(subject.all()).toMatchInlineSnapshot(`
Object {
  "ark.devnet": Object {
    "coin": "ARK",
    "constants": Object {
      "slip44": 1,
    },
    "currency": Object {
      "decimals": 8,
      "symbol": "DѦ",
      "ticker": "DARK",
    },
    "explorer": Object {
      "block": "block/{0}",
      "transaction": "transaction/{0}",
      "wallet": "wallets/{0}",
    },
    "featureFlags": Object {
      "Address": Array [
        "mnemonic.bip39",
        "multiSignature",
        "privateKey",
        "publicKey",
        "validate",
        "wif",
      ],
      "Client": Array [
        "transaction",
        "transactions",
        "wallet",
        "wallets",
        "delegate",
        "delegates",
        "votes",
        "voters",
        "broadcast",
      ],
      "Fee": Array [
        "all",
        "calculate",
      ],
      "KeyPair": Array [
        "mnemonic.bip39",
        "privateKey",
        "wif",
      ],
      "Ledger": Array [
        "getVersion",
        "getPublicKey",
        "signTransaction",
        "signMessage",
      ],
      "Message": Array [
        "sign",
        "verify",
      ],
      "PrivateKey": Array [
        "mnemonic.bip39",
        "wif",
      ],
      "PublicKey": Array [
        "mnemonic.bip39",
        "multiSignature",
        "wif",
      ],
      "Transaction": Array [
        "delegateRegistration",
        "delegateResignation",
        "estimateExpiration",
        "htlcClaim",
        "htlcLock",
        "htlcRefund",
        "ipfs.ledgerS",
        "ipfs.ledgerX",
        "ipfs.musig",
        "ipfs",
        "multiPayment.musig",
        "multiPayment",
        "multiSignature.ledgerX",
        "multiSignature.musig",
        "multiSignature",
        "secondSignature",
        "transfer.ledgerS",
        "transfer.ledgerX",
        "transfer.musig",
        "transfer",
        "vote.ledgerS",
        "vote.ledgerX",
        "vote.musig",
        "vote",
      ],
      "WIF": Array [
        "mnemonic.bip39",
      ],
    },
    "governance": Object {
      "delegateCount": 51,
      "votesPerTransaction": 1,
      "votesPerWallet": 1,
    },
    "hosts": Array [
      Object {
        "host": "https://ark-test.payvo.com/api",
        "type": "full",
      },
      Object {
        "host": "https://ark-test-musig.payvo.com",
        "type": "musig",
      },
      Object {
        "host": "https://dexplorer.ark.io",
        "type": "explorer",
      },
    ],
    "id": "ark.devnet",
    "importMethods": Object {
      "address": Object {
        "default": false,
        "permissions": Array [
          "read",
        ],
      },
      "bip39": Object {
        "canBeEncrypted": true,
        "default": true,
        "permissions": Array [
          "read",
          "write",
        ],
      },
      "publicKey": Object {
        "default": false,
        "permissions": Array [
          "read",
        ],
      },
      "secret": Object {
        "canBeEncrypted": true,
        "default": false,
        "permissions": Array [
          "read",
          "write",
        ],
      },
    },
    "knownWallets": "https://raw.githubusercontent.com/ArkEcosystem/common/master/devnet/known-wallets-extended.json",
    "meta": Object {
      "fastDelegateSync": true,
    },
    "name": "Devnet",
    "transactions": Object {
      "expirationType": "height",
      "fees": Object {
        "ticker": "DARK",
        "type": "dynamic",
      },
      "memo": true,
      "multiPaymentRecipients": 128,
      "types": Array [
        "delegateRegistration",
        "delegateResignation",
        "htlcClaim",
        "htlcLock",
        "htlcRefund",
        "ipfs",
        "multiPayment",
        "multiSignature",
        "secondSignature",
        "transfer",
        "vote",
      ],
    },
    "type": "test",
  },
  "ark.mainnet": Object {
    "coin": "ARK",
    "constants": Object {
      "slip44": 111,
    },
    "currency": Object {
      "decimals": 8,
      "symbol": "Ѧ",
      "ticker": "ARK",
    },
    "explorer": Object {
      "block": "block/{0}",
      "transaction": "transaction/{0}",
      "wallet": "wallets/{0}",
    },
    "featureFlags": Object {
      "Address": Array [
        "mnemonic.bip39",
        "multiSignature",
        "privateKey",
        "publicKey",
        "validate",
        "wif",
      ],
      "Client": Array [
        "transaction",
        "transactions",
        "wallet",
        "wallets",
        "delegate",
        "delegates",
        "votes",
        "voters",
        "broadcast",
      ],
      "Fee": Array [
        "all",
        "calculate",
      ],
      "KeyPair": Array [
        "mnemonic.bip39",
        "privateKey",
        "wif",
      ],
      "Ledger": Array [
        "getVersion",
        "getPublicKey",
        "signTransaction",
        "signMessage",
      ],
      "Message": Array [
        "sign",
        "verify",
      ],
      "PrivateKey": Array [
        "mnemonic.bip39",
        "wif",
      ],
      "PublicKey": Array [
        "mnemonic.bip39",
        "multiSignature",
        "wif",
      ],
      "Transaction": Array [
        "delegateRegistration",
        "delegateResignation",
        "estimateExpiration",
        "htlcClaim",
        "htlcLock",
        "htlcRefund",
        "ipfs.ledgerS",
        "ipfs.ledgerX",
        "ipfs.musig",
        "ipfs",
        "multiPayment.musig",
        "multiPayment",
        "multiSignature.ledgerX",
        "multiSignature.musig",
        "multiSignature",
        "secondSignature",
        "transfer.ledgerS",
        "transfer.ledgerX",
        "transfer.musig",
        "transfer",
        "vote.ledgerS",
        "vote.ledgerX",
        "vote.musig",
        "vote",
      ],
      "WIF": Array [
        "mnemonic.bip39",
      ],
    },
    "governance": Object {
      "delegateCount": 51,
      "votesPerTransaction": 1,
      "votesPerWallet": 1,
    },
    "hosts": Array [
      Object {
        "host": "https://ark-live.payvo.com/api",
        "type": "full",
      },
      Object {
        "host": "https://ark-live-musig.payvo.com",
        "type": "musig",
      },
      Object {
        "host": "https://explorer.ark.io",
        "type": "explorer",
      },
    ],
    "id": "ark.mainnet",
    "importMethods": Object {
      "address": Object {
        "default": false,
        "permissions": Array [
          "read",
        ],
      },
      "bip39": Object {
        "canBeEncrypted": true,
        "default": true,
        "permissions": Array [
          "read",
          "write",
        ],
      },
      "publicKey": Object {
        "default": false,
        "permissions": Array [
          "read",
        ],
      },
      "secret": Object {
        "canBeEncrypted": true,
        "default": false,
        "permissions": Array [
          "read",
          "write",
        ],
      },
    },
    "knownWallets": "https://raw.githubusercontent.com/ArkEcosystem/common/master/mainnet/known-wallets-extended.json",
    "meta": Object {
      "fastDelegateSync": true,
    },
    "name": "Mainnet",
    "transactions": Object {
      "expirationType": "height",
      "fees": Object {
        "ticker": "ARK",
        "type": "dynamic",
      },
      "memo": true,
      "multiPaymentRecipients": 64,
      "types": Array [
        "delegateRegistration",
        "delegateResignation",
        "htlcClaim",
        "htlcLock",
        "htlcRefund",
        "ipfs",
        "multiPayment",
        "multiSignature",
        "secondSignature",
        "transfer",
        "vote",
      ],
    },
    "type": "live",
  },
  "bind.mainnet": Object {
    "coin": "Compendia",
    "constants": Object {
      "slip44": 543,
    },
    "currency": Object {
      "decimals": 8,
      "symbol": "ß",
      "ticker": "BIND",
    },
    "explorer": Object {
      "block": "block/{0}",
      "transaction": "transaction/{0}",
      "wallet": "wallets/{0}",
    },
    "featureFlags": Object {
      "Address": Array [
        "mnemonic.bip39",
        "multiSignature",
        "privateKey",
        "publicKey",
        "validate",
        "wif",
      ],
      "Client": Array [
        "transaction",
        "transactions",
        "wallet",
        "wallets",
        "delegate",
        "delegates",
        "votes",
        "voters",
        "broadcast",
      ],
      "Fee": Array [
        "all",
        "calculate",
      ],
      "KeyPair": Array [
        "mnemonic.bip39",
        "privateKey",
        "wif",
      ],
      "Ledger": Array [
        "getVersion",
        "getPublicKey",
        "signTransaction",
        "signMessage",
      ],
      "Message": Array [
        "sign",
        "verify",
      ],
      "PrivateKey": Array [
        "mnemonic.bip39",
        "wif",
      ],
      "PublicKey": Array [
        "mnemonic.bip39",
        "multiSignature",
        "wif",
      ],
      "Transaction": Array [
        "delegateRegistration",
        "delegateResignation",
        "estimateExpiration",
        "multiPayment.musig",
        "multiPayment",
        "multiSignature.musig",
        "multiSignature",
        "secondSignature",
        "transfer.musig",
        "transfer",
        "vote.musig",
        "vote",
      ],
      "WIF": Array [
        "mnemonic.bip39",
      ],
    },
    "governance": Object {
      "delegateCount": 47,
      "method": "split",
      "votesPerTransaction": 1,
      "votesPerWallet": 1,
    },
    "hosts": Array [
      Object {
        "host": "https://apis.compendia.org/api",
        "type": "full",
      },
      Object {
        "host": "https://bind-live-musig.payvo.com",
        "type": "musig",
      },
      Object {
        "host": "https://bindscan.io",
        "type": "explorer",
      },
    ],
    "id": "bind.mainnet",
    "importMethods": Object {
      "address": Object {
        "default": false,
        "permissions": Array [
          "read",
        ],
      },
      "bip39": Object {
        "canBeEncrypted": true,
        "default": true,
        "permissions": Array [
          "read",
          "write",
        ],
      },
      "publicKey": Object {
        "default": false,
        "permissions": Array [
          "read",
        ],
      },
      "secret": Object {
        "canBeEncrypted": true,
        "default": false,
        "permissions": Array [
          "read",
          "write",
        ],
      },
    },
    "meta": Object {
      "fastDelegateSync": true,
    },
    "name": "Mainnet",
    "transactions": Object {
      "expirationType": "height",
      "fees": Object {
        "ticker": "BIND",
        "type": "static",
      },
      "memo": true,
      "multiPaymentRecipients": 128,
      "types": Array [
        "delegateRegistration",
        "delegateResignation",
        "htlcClaim",
        "htlcLock",
        "htlcRefund",
        "ipfs",
        "multiPayment",
        "multiSignature",
        "secondSignature",
        "transfer",
        "vote",
      ],
    },
    "type": "live",
  },
  "bind.testnet": Object {
    "coin": "Compendia",
    "constants": Object {
      "slip44": 1,
    },
    "currency": Object {
      "decimals": 8,
      "symbol": "Tß",
      "ticker": "TBIND",
    },
    "explorer": Object {
      "block": "block/{0}",
      "transaction": "transaction/{0}",
      "wallet": "wallets/{0}",
    },
    "featureFlags": Object {
      "Address": Array [
        "mnemonic.bip39",
        "multiSignature",
        "privateKey",
        "publicKey",
        "validate",
        "wif",
      ],
      "Client": Array [
        "transaction",
        "transactions",
        "wallet",
        "wallets",
        "delegate",
        "delegates",
        "votes",
        "voters",
        "broadcast",
      ],
      "Fee": Array [
        "all",
        "calculate",
      ],
      "KeyPair": Array [
        "mnemonic.bip39",
        "privateKey",
        "wif",
      ],
      "Ledger": Array [
        "getVersion",
        "getPublicKey",
        "signTransaction",
        "signMessage",
      ],
      "Message": Array [
        "sign",
        "verify",
      ],
      "PrivateKey": Array [
        "mnemonic.bip39",
        "wif",
      ],
      "PublicKey": Array [
        "mnemonic.bip39",
        "multiSignature",
        "wif",
      ],
      "Transaction": Array [
        "delegateRegistration",
        "delegateResignation",
        "estimateExpiration",
        "multiPayment.musig",
        "multiPayment",
        "multiSignature.musig",
        "multiSignature",
        "secondSignature",
        "transfer.musig",
        "transfer",
        "vote.musig",
        "vote",
      ],
      "WIF": Array [
        "mnemonic.bip39",
      ],
    },
    "governance": Object {
      "delegateCount": 47,
      "method": "split",
      "votesPerTransaction": 1,
      "votesPerWallet": 1,
    },
    "hosts": Array [
      Object {
        "host": "https://apis-testnet.compendia.org/api",
        "type": "full",
      },
      Object {
        "host": "https://bind-test-musig.payvo.com",
        "type": "musig",
      },
      Object {
        "host": "https://testnet.bindscan.io",
        "type": "explorer",
      },
    ],
    "id": "bind.testnet",
    "importMethods": Object {
      "address": Object {
        "default": false,
        "permissions": Array [
          "read",
        ],
      },
      "bip39": Object {
        "canBeEncrypted": true,
        "default": true,
        "permissions": Array [
          "read",
          "write",
        ],
      },
      "publicKey": Object {
        "default": false,
        "permissions": Array [
          "read",
        ],
      },
      "secret": Object {
        "canBeEncrypted": true,
        "default": false,
        "permissions": Array [
          "read",
          "write",
        ],
      },
    },
    "meta": Object {
      "fastDelegateSync": true,
    },
    "name": "Testnet",
    "transactions": Object {
      "expirationType": "height",
      "fees": Object {
        "ticker": "TBIND",
        "type": "static",
      },
      "memo": true,
      "multiPaymentRecipients": 64,
      "types": Array [
        "delegateRegistration",
        "delegateResignation",
        "htlcClaim",
        "htlcLock",
        "htlcRefund",
        "ipfs",
        "multiPayment",
        "multiSignature",
        "secondSignature",
        "transfer",
        "vote",
      ],
    },
    "type": "test",
  },
  "bpl.mainnet": Object {
    "coin": "Blockpool",
    "constants": Object {
      "slip44": 111,
    },
    "currency": Object {
      "decimals": 8,
      "symbol": "β",
      "ticker": "BPL",
    },
    "explorer": Object {
      "block": "#/block/{0}",
      "transaction": "#/transaction/{0}",
      "wallet": "#/wallets/{0}",
    },
    "featureFlags": Object {
      "Address": Array [
        "mnemonic.bip39",
        "multiSignature",
        "privateKey",
        "publicKey",
        "validate",
        "wif",
      ],
      "Client": Array [
        "transaction",
        "transactions",
        "wallet",
        "wallets",
        "delegate",
        "delegates",
        "votes",
        "voters",
        "broadcast",
      ],
      "Fee": Array [
        "all",
        "calculate",
      ],
      "KeyPair": Array [
        "mnemonic.bip39",
        "privateKey",
        "wif",
      ],
      "Ledger": Array [
        "getVersion",
        "getPublicKey",
        "signTransaction",
        "signMessage",
      ],
      "Message": Array [
        "sign",
        "verify",
      ],
      "PrivateKey": Array [
        "mnemonic.bip39",
        "wif",
      ],
      "PublicKey": Array [
        "mnemonic.bip39",
        "multiSignature",
        "wif",
      ],
      "Transaction": Array [
        "delegateRegistration",
        "delegateResignation",
        "estimateExpiration",
        "multiPayment",
        "secondSignature",
        "transfer",
        "vote",
      ],
      "WIF": Array [
        "mnemonic.bip39",
      ],
    },
    "governance": Object {
      "delegateCount": 201,
      "method": "split",
      "votesPerTransaction": 1,
      "votesPerWallet": 1,
    },
    "hosts": Array [
      Object {
        "host": "http://explorer.blockpool.io:9031/api",
        "type": "full",
      },
      Object {
        "host": "https://explorer.blockpool.io/",
        "type": "explorer",
      },
    ],
    "id": "bpl.mainnet",
    "importMethods": Object {
      "address": Object {
        "default": false,
        "permissions": Array [
          "read",
        ],
      },
      "bip39": Object {
        "canBeEncrypted": true,
        "default": true,
        "permissions": Array [
          "read",
          "write",
        ],
      },
      "publicKey": Object {
        "default": false,
        "permissions": Array [
          "read",
        ],
      },
      "secret": Object {
        "canBeEncrypted": true,
        "default": false,
        "permissions": Array [
          "read",
          "write",
        ],
      },
    },
    "meta": Object {
      "fastDelegateSync": true,
    },
    "name": "Mainnet",
    "transactions": Object {
      "expirationType": "height",
      "fees": Object {
        "ticker": "BPL",
        "type": "dynamic",
      },
      "memo": true,
      "multiPaymentRecipients": 128,
      "types": Array [
        "delegateRegistration",
        "delegateResignation",
        "htlcClaim",
        "htlcLock",
        "htlcRefund",
        "ipfs",
        "multiPayment",
        "multiSignature",
        "secondSignature",
        "transfer",
        "vote",
      ],
    },
    "type": "live",
  },
  "xqr.mainnet": Object {
    "coin": "Qredit",
    "constants": Object {
      "slip44": 111,
    },
    "currency": Object {
      "decimals": 8,
      "symbol": "Q",
      "ticker": "XQR",
    },
    "explorer": Object {
      "block": "qredit/block/{0}",
      "transaction": "qredit/transaction/{0}",
      "wallet": "qredit/wallet/{0}",
    },
    "featureFlags": Object {
      "Address": Array [
        "mnemonic.bip39",
        "multiSignature",
        "privateKey",
        "publicKey",
        "validate",
        "wif",
      ],
      "Client": Array [
        "transaction",
        "transactions",
        "wallet",
        "wallets",
        "delegate",
        "delegates",
        "votes",
        "voters",
        "broadcast",
      ],
      "Fee": Array [
        "all",
        "calculate",
      ],
      "KeyPair": Array [
        "mnemonic.bip39",
        "privateKey",
        "wif",
      ],
      "Ledger": Array [
        "getVersion",
        "getPublicKey",
        "signTransaction",
        "signMessage",
      ],
      "Message": Array [
        "sign",
        "verify",
      ],
      "PrivateKey": Array [
        "mnemonic.bip39",
        "wif",
      ],
      "PublicKey": Array [
        "mnemonic.bip39",
        "multiSignature",
        "wif",
      ],
      "Transaction": Array [
        "delegateRegistration",
        "delegateResignation",
        "estimateExpiration",
        "multiPayment",
        "secondSignature",
        "transfer",
        "vote",
      ],
      "WIF": Array [
        "mnemonic.bip39",
      ],
    },
    "governance": Object {
      "delegateCount": 51,
      "method": "split",
      "votesPerTransaction": 1,
      "votesPerWallet": 1,
    },
    "hosts": Array [
      Object {
        "host": "https://qredit.cloud/api",
        "type": "full",
      },
      Object {
        "host": "https://explorer.sh/",
        "type": "explorer",
      },
    ],
    "id": "xqr.mainnet",
    "importMethods": Object {
      "address": Object {
        "default": false,
        "permissions": Array [
          "read",
        ],
      },
      "bip39": Object {
        "canBeEncrypted": true,
        "default": true,
        "permissions": Array [
          "read",
          "write",
        ],
      },
      "publicKey": Object {
        "default": false,
        "permissions": Array [
          "read",
        ],
      },
      "secret": Object {
        "canBeEncrypted": true,
        "default": false,
        "permissions": Array [
          "read",
          "write",
        ],
      },
    },
    "knownWallets": "https://raw.githubusercontent.com/qredit/common/master/mainnet/known-wallets-extended.json",
    "meta": Object {
      "fastDelegateSync": true,
    },
    "name": "Mainnet",
    "transactions": Object {
      "expirationType": "height",
      "fees": Object {
        "ticker": "XQR",
        "type": "dynamic",
      },
      "memo": true,
      "multiPaymentRecipients": 128,
      "types": Array [
        "delegateRegistration",
        "delegateResignation",
        "htlcClaim",
        "htlcLock",
        "htlcRefund",
        "ipfs",
        "multiPayment",
        "multiSignature",
        "secondSignature",
        "transfer",
        "vote",
      ],
    },
    "type": "live",
  },
  "xqr.testnet": Object {
    "coin": "Qredit",
    "constants": Object {
      "slip44": 1,
    },
    "currency": Object {
      "decimals": 8,
      "symbol": "dQ",
      "ticker": "dXQR",
    },
    "explorer": Object {
      "block": "qredit-testnet/block/{0}",
      "transaction": "qredit-testnet/transaction/{0}",
      "wallet": "qredit-testnet/wallet/{0}",
    },
    "featureFlags": Object {
      "Address": Array [
        "mnemonic.bip39",
        "multiSignature",
        "privateKey",
        "publicKey",
        "validate",
        "wif",
      ],
      "Client": Array [
        "transaction",
        "transactions",
        "wallet",
        "wallets",
        "delegate",
        "delegates",
        "votes",
        "voters",
        "broadcast",
      ],
      "Fee": Array [
        "all",
        "calculate",
      ],
      "KeyPair": Array [
        "mnemonic.bip39",
        "privateKey",
        "wif",
      ],
      "Ledger": Array [
        "getVersion",
        "getPublicKey",
        "signTransaction",
        "signMessage",
      ],
      "Message": Array [
        "sign",
        "verify",
      ],
      "PrivateKey": Array [
        "mnemonic.bip39",
        "wif",
      ],
      "PublicKey": Array [
        "mnemonic.bip39",
        "multiSignature",
        "wif",
      ],
      "Transaction": Array [
        "delegateRegistration",
        "delegateResignation",
        "estimateExpiration",
        "multiPayment",
        "secondSignature",
        "transfer",
        "vote",
      ],
      "WIF": Array [
        "mnemonic.bip39",
      ],
    },
    "governance": Object {
      "delegateCount": 51,
      "method": "split",
      "votesPerTransaction": 1,
      "votesPerWallet": 1,
    },
    "hosts": Array [
      Object {
        "host": "https://qredit.dev/api",
        "type": "full",
      },
      Object {
        "host": "https://explorer.sh/",
        "type": "explorer",
      },
    ],
    "id": "xqr.testnet",
    "importMethods": Object {
      "address": Object {
        "default": false,
        "permissions": Array [
          "read",
        ],
      },
      "bip39": Object {
        "canBeEncrypted": true,
        "default": true,
        "permissions": Array [
          "read",
          "write",
        ],
      },
      "publicKey": Object {
        "default": false,
        "permissions": Array [
          "read",
        ],
      },
      "secret": Object {
        "canBeEncrypted": true,
        "default": false,
        "permissions": Array [
          "read",
          "write",
        ],
      },
    },
    "meta": Object {
      "fastDelegateSync": true,
    },
    "name": "Testnet",
    "transactions": Object {
      "expirationType": "height",
      "fees": Object {
        "ticker": "dXQR",
        "type": "dynamic",
      },
      "memo": true,
      "multiPaymentRecipients": 128,
      "types": Array [
        "delegateRegistration",
        "delegateResignation",
        "htlcClaim",
        "htlcLock",
        "htlcRefund",
        "ipfs",
        "multiPayment",
        "multiSignature",
        "secondSignature",
        "transfer",
        "vote",
      ],
    },
    "type": "test",
  },
}
`);
});

test("#get | #push | #forget", () => {
	expect(subject.get("ark.devnet")).toBeObject();

	subject.push("ark.devnet", manifest.networks["ark.devnet"]);

	expect(subject.get("ark.devnet")).toBeObject();

	subject.forget("ark.devnet");

	expect(() => subject.get("ark.devnet")).toThrow("The [ark.devnet] network is not supported.");
});
