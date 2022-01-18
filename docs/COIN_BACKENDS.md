# Coin Backends

## Prerequisites

- [Docker](https://docs.docker.com/engine/install)
- [Docker Compose](https://docs.docker.com/compose/install)

## Bitcoin - [BTC](#BTC)

### [Bcoin](https://github.com/bcoin-org/bcoin)

`Bcoin` is an alternative implementation of the Bitcoin protocol, written in JavaScript and C/C++ for Node.js. Preferably build your own local docker image with the latest `bcoin` version. 

> Create persistent folders. Defaults: `~/bcoin` = data && `~/.bcoin/secrets` = config files

```sh
mkdir ~/bcoin
mkdir -p ~/.bcoin/secrets
```

> Create config files `~/.bcoin/secrets/bcoin.conf` && `~/.bcoin/secrets/wallet.conf` adding the parameters below:

__*bcoin.conf*__

```sh
# network: main || testnet
network: testnet

# Data directory
prefix: /data

# Enable flags
use-workers: true

log-file: true
log-level: info
max-files: 8192

http-host: 0.0.0.0
api-key: 1234 
index-tx: true
index-address: true
```

__*wallet.conf*__

```sh7 
# network: main || testnet
network: testnet

# Data directory
prefix: /data
http-host: 0.0.0.0

# Security settings
api-key: 1234
wallet-auth: true
```

Change both `api-key`s with your preferred one.

> Clone [bcoin-docker](https://github.com/bcoin-org/bcoin-docker.git).

```sh
git clone https://github.com/bcoin-org/bcoin-docker.git
cd bcoin-docker
```

Using your favorite editor change `VERSION?` in the [Makefile](https://github.com/bcoin-org/bcoin-docker/blob/master/Makefile#L1), setting it to latest one. At the time of writing the latest version was `v2.2.0`.

> Build the docker image.

```sh
make latest
```

Make sure you have the images:

```sh
docker images purse/bcoin
```

While [bcoin-docker](https://github.com/bcoin-org/bcoin-docker.git) ships with example `docker-compose` files, we prefer to keep it simple and use our own. 

> Create file `docker-compose-bcoin.yml` with the following content:

```sh
version: '2'

services:
  bcoin:
    image: purse/bcoin
    container_name: bcoin-test
    restart: unless-stopped
    ports:
      #-- Mainnet
      #- "8333:8333"
      #- "8332:8332" # RPC/HTTP
      #- "8334:8334" # Wallet
      #-- Testnet
      - "18333:18333"
      - "18332:18332" # RPC/HTTP
      - "18334:18334"
    environment:
      BCOIN_CONFIG: /data/bcoin.conf
      #VIRTUAL_PORT: 8332 # Mainnet
      VIRTUAL_PORT: 18332 # Testnest
    networks:
      - bcoin
    volumes:
      - ~/bcoin:/data
      - ~/.bcoin/secrets/bcoin.conf:/data/bcoin.conf
      - ~/.bcoin/secrets/wallet.conf:/data/wallet.conf
      - ~/.bcoin/secrets/wallet.conf:/data/testnet/wallet.conf
networks:
  bcoin:
volumes:
  bcoin:
```

The example above uses `Testnet`. If you need to sync `Mainnet` just uncomment `Mainnet` ports and comment `Testnet` ones as well as set `container_name: bcoin-main`.

> Run the `bcoin` node.

```sh
docker-compose -f docker-compose-bcoin.yml up -d
```

## Cardano - [ADA](#ADA)

### [Cardano GraphQL](https://github.com/input-output-hk/cardano-graphql)

`Cardano GraphQL` is a complete package providing query interface to the blockchain data via GraphQL and Cardano Node. The project comes with everything needed to run the full set of containers. However, for our needs we use a slightly modified configuration.

> Clone [cardano-graphql](https://github.com/input-output-hk/cardano-graphql.git).

```sh
git clone --recursive https://github.com/input-output-hk/cardano-graphql.git
cd cardano-graphql
```

We don't build any kind of local docker images. However the `--recursive` flag is needed since the repository has links to configuration files which are mounted inside the containers.

> Create file `docker-compose-cardano-graphql.yml` with the following content:

```sh
version: "3.5"

services:
  postgres:
    image: postgres:${POSTGRES_VERSION:-11.5-alpine}
    environment:
      - POSTGRES_LOGGING=true
      - POSTGRES_DB_FILE=/run/secrets/postgres_db
      - POSTGRES_PASSWORD_FILE=/run/secrets/postgres_password
      - POSTGRES_USER_FILE=/run/secrets/postgres_user
    secrets:
      - postgres_db
      - postgres_password
      - postgres_user
    shm_size: '2gb'
    volumes:
      - postgres-data:/var/lib/postgresql/data
    restart: on-failure
    logging:
      driver: "json-file"
      options:
        max-size: "200k"
        max-file: "10"

  cardano-node-ogmios:
    image: cardanosolutions/cardano-node-ogmios:latest-${NETWORK:-mainnet}
    logging:
      driver: "json-file"
      options:
        max-size: "400k"
        max-file: "20"
    ports:
      - ${OGMIOS_PORT:-1337}:1337
    restart: on-failure
    volumes:
      - ./config/network/${NETWORK:-mainnet}/cardano-node:/config/cardano-node
      - ./config/network/${NETWORK:-mainnet}/genesis:/config/genesis
      - node-db:/db
      - node-ipc:/ipc

  cardano-db-sync-extended:
    image: inputoutput/cardano-db-sync:${CARDANO_DB_SYNC_VERSION:-latest}
    command: [
      "--config", "/config/cardano-db-sync/config.json",
      "--socket-path", "/node-ipc/node.socket"
    ]
    environment:
      - EXTENDED=true
      - POSTGRES_HOST=postgres
      - POSTGRES_PORT=5432
      - RESTORE_SNAPSHOT=${RESTORE_SNAPSHOT:-}
      - RESTORE_RECREATE_DB=N
    depends_on:
      - cardano-node-ogmios
      - postgres
    secrets:
      - postgres_password
      - postgres_user
      - postgres_db
    volumes:
      - ./config/network/${NETWORK:-mainnet}:/config
      - db-sync-data:/var/lib/cdbsync
      - node-ipc:/node-ipc
    restart: on-failure
    logging:
      driver: "json-file"
      options:
        max-size: "200k"
        max-file: "10"

  hasura:
    image: inputoutput/cardano-graphql-hasura:${CARDANO_GRAPHQL_VERSION:-latest}
    ports:
      - ${HASURA_PORT:-8090}:8080
    depends_on:
      - "postgres"
    restart: on-failure
    environment:
      - HASURA_GRAPHQL_ENABLE_CONSOLE=true
      - HASURA_GRAPHQL_CORS_DOMAIN=http://localhost:9695
    secrets:
      - postgres_db
      - postgres_password
      - postgres_user
    logging:
      driver: "json-file"
      options:
        max-size: "200k"
        max-file: "10"

  cardano-graphql:
    image: inputoutput/cardano-graphql:latest-${NETWORK:-mainnet}
    environment:
      - ALLOW_INTROSPECTION=true
      - CACHE_ENABLED=true
      - LOGGER_MIN_SEVERITY=${LOGGER_MIN_SEVERITY:-info}
      - NETWORK=${NETWORK:-mainnet}
      - METADATA_SERVER_URI=${METADATA_SERVER_URI:-https://tokens.cardano.org}
    expose:
      - ${API_PORT:-3100}
    ports:
      - ${API_PORT:-3100}:3100
    restart: on-failure
    secrets:
      - postgres_db
      - postgres_password
      - postgres_user
    logging:
      driver: "json-file"
      options:
        max-size: "200k"
        max-file: "10"
    volumes:
      - ./config/network/${NETWORK:-mainnet}/genesis:/config/genesis

secrets:
  postgres_db:
    file: ./placeholder-secrets/postgres_db
  postgres_password:
    file: ./placeholder-secrets/postgres_password
  postgres_user:
    file: ./placeholder-secrets/postgres_user
volumes:
  db-sync-data:
  node-db:
  node-ipc:
  postgres-data:
```

> Run the `cardano-graphql` package.

Testnet:

```sh
export NETWORK=testnet
export METADATA_SERVER_URI=https://metadata.cardano-testnet.iohkdev.io
docker-compose -f docker-compose-cardano-graphql.yml -p cardano-testnet up -d
```

Mainnet:

```sh
export NETWORK=mainnet
export METADATA_SERVER_URI=https://tokens.cardano.org
docker-compose -f docker-compose-cardano-graphql.yml -p cardano-mainnet up -d
```

==**NOTE**:== The above configuration has been tested with `cardano-graphql` version `6.0` and `6.1`. IPC socket errors are expected until the `cardano-node` fully syncs the blockchain. 

## Avalanche - [AVAX](#AVAX)

### [Ortelius](https://github.com/ava-labs/ortelius)

`Ortelius` is a data processing pipeline for the Avalanche network. It indexes Exchange (X), Platform (P), and Contract (C) chain transactions and provides an [API](https://docs.avax.network/build/tools/ortelius) that allows exploration of the index.

> Install required prerequisites.

 - [Go](https://go.dev/doc/install)

> Clone [ortelius](https://github.com/ava-labs/ortelius.git).

```sh
git clone https://github.com/ava-labs/ortelius.git
cd ortelius
```

> Run Standalone Mode on `Testnet`.

```sh
make dev_env_start
make standalone_start
```

[Ortelius Production Deployment](https://github.com/ava-labs/ortelius/blob/master/docs/deployment.md).


