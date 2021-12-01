cd packages

# 1. Prerequisites
cd test && pnpm run build:release && cd ..
cd helpers && pnpm run build:release && cd ..
cd intl && pnpm run build:release && cd ..
cd cryptography && pnpm run build:release && cd ..
cd sdk && pnpm run build:release && cd ..
cd news && pnpm run build:release && cd ..
cd http-fetch && pnpm run build:release && cd ..
cd markets && pnpm run build:release && cd ..

# 2. Coins
cd ada && pnpm run build:release && cd ..
cd ark && pnpm run build:release && cd ..
cd atom && pnpm run build:release && cd ..
cd avax && pnpm run build:release && cd ..
cd btc && pnpm run build:release && cd ..
cd dot && pnpm run build:release && cd ..
cd egld && pnpm run build:release && cd ..
cd eos && pnpm run build:release && cd ..
cd eth && pnpm run build:release && cd ..
cd lsk && pnpm run build:release && cd ..
cd luna && pnpm run build:release && cd ..
cd nano && pnpm run build:release && cd ..
cd neo && pnpm run build:release && cd ..
cd sol && pnpm run build:release && cd ..
cd trx && pnpm run build:release && cd ..
cd xlm && pnpm run build:release && cd ..
cd xrp && pnpm run build:release && cd ..
cd zil && pnpm run build:release && cd ..

# 3. Integration
cd profiles && pnpm run build:release && cd ..
