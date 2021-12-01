function bundle() {
	cd packages/$1
	pnpm run build:release
	cd ../..
}

# 1. Prerequisites
bundle test
bundle helpers
bundle intl
bundle cryptography
bundle sdk
bundle news
bundle http-fetch
bundle markets

# 2. Coins
bundle ada
bundle ark
bundle atom
bundle avax
bundle btc
bundle dot
bundle egld
bundle eos
bundle eth
bundle lsk
bundle luna
bundle nano
bundle neo
bundle sol
bundle trx
bundle xlm
bundle xrp
bundle zil

# 3. Integration
bundle profiles
