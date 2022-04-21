import { Coins, Http, Networks } from "@payvo/sdk";

import { UnspentTransaction } from "./transaction.models.js";

const postGraphql = async (
	config: Coins.ConfigRepository,
	httpClient: Http.HttpClient,
	hostSelector: Networks.NetworkHostSelector,
	query: string,
): Promise<Record<string, any>> => {
	const response = await httpClient.post(hostSelector(config).host, { query });

	const json = response.json();

	if (json.errors) {
		throw new Error(json.errors);
	}

	return json.data;
};

export const submitTransaction = async (
	config: Coins.ConfigRepository,
	httpClient: Http.HttpClient,
	hostSelector: Networks.NetworkHostSelector,
	toBroadcast: string,
): Promise<string> =>
	(
		await postGraphql(
			config,
			httpClient,
			hostSelector,
			`mutation { submitTransaction(transaction: "${toBroadcast}") { hash } }`,
		)
	).hash;

export const fetchTransaction = async (
	id: string,
	config: Coins.ConfigRepository,
	httpClient: Http.HttpClient,
	hostSelector: Networks.NetworkHostSelector,
): Promise<object[]> => {
	const query = `
			{
				transactions(
						where: {
							hash: {
								_eq: "${id}"
							}
						}
					) {
						hash
						includedAt
						fee
						inputs {
							sourceTransaction {
       					hash
      				}
						  value
							address
						}
						outputs {
						  index
						  value
							address
					}
				}
			}`;

	return (await postGraphql(config, httpClient, hostSelector, query)).transactions[0];
};

export const fetchTransactions = async (
	config: Coins.ConfigRepository,
	httpClient: Http.HttpClient,
	hostSelector: Networks.NetworkHostSelector,
	addresses: string[],
): Promise<object[]> => {
	const query = `
			{
				transactions(
					where: {
						_or: [
							{
								inputs: {
									address: {
										_in: [
											${addresses.map((a) => '"' + a + '"').join("\n")}
										]
									}
								}
							}
							{
							outputs: {
								address: {
										_in: [
											${addresses.map((a) => '"' + a + '"').join("\n")}
										]
									}
								}
							}
						]
					}
					) {
						hash
						includedAt
						fee
						inputs {
							sourceTransaction {
       					hash
      				}
						  value
							address
						}
						outputs {
						  index
						  value
							address
						}
				}
			}`;

	return (await postGraphql(config, httpClient, hostSelector, query)).transactions;
};

export const fetchNetworkTip = async (
	config: Coins.ConfigRepository,
	httpClient: Http.HttpClient,
	hostSelector: Networks.NetworkHostSelector,
): Promise<number> => {
	const query = `{ cardano { tip { slotNo } } }`;

	return Number.parseInt((await postGraphql(config, httpClient, hostSelector, query)).cardano.tip.slotNo);
};

export const fetchUsedAddressesData = async (
	config: Coins.ConfigRepository,
	httpClient: Http.HttpClient,
	hostSelector: Networks.NetworkHostSelector,
	addresses: string[],
): Promise<string[]> => {
	const query = `
			{
				transactions(
					where: {
						_or: [
							{
								inputs: {
									address: {
										_in: [
											${addresses.map((a) => '"' + a + '"').join("\n")}
										]
									}
								}
							}
							{
							outputs: {
								address: {
										_in: [
											${addresses.map((a) => '"' + a + '"').join("\n")}
										]
									}
								}
							}
						]
					}
				) {
					inputs {
						address
					}
					outputs {
						address
					}
				}
			}`;
	return (await postGraphql(config, httpClient, hostSelector, query)).transactions
		.flatMap((tx) => tx.inputs.map((index) => index.address).concat(tx.outputs.map((o) => o.address)))
		.sort();
};

export const listUnspentTransactions = async (
	config: Coins.ConfigRepository,
	httpClient: Http.HttpClient,
	hostSelector: Networks.NetworkHostSelector,
	addresses: string[],
): Promise<UnspentTransaction[]> =>
	(
		await postGraphql(
			config,
			httpClient,
			hostSelector,
			`{
				utxos(
				  where: {
					  address: {
							_in: [
								${addresses.map((a) => '"' + a + '"').join("\n")}
							]
					  }
				  }
				  order_by: { value: desc }
				) {
				  address
				  index
				  txHash
				  value
				}
			}`,
		)
	).utxos;

export const fetchUtxosAggregate = async (
	config: Coins.ConfigRepository,
	httpClient: Http.HttpClient,
	hostSelector: Networks.NetworkHostSelector,
	addresses: string[],
): Promise<string> => {
	const query = `
			{
				utxos_aggregate(
					where: {
						address: {
							_in: [
								${addresses.map((a) => '"' + a + '"').join("\n")}
							]
						}
					}
				) {
					aggregate {
						sum {
							value
						}
					}
				}
			}`;
	return (await postGraphql(config, httpClient, hostSelector, query)).utxos_aggregate.aggregate.sum.value;
};
