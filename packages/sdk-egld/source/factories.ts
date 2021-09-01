import elrond from "@elrondnetwork/elrond-core-js";

export const makeAccount = () => new elrond.account();

export const makeTransaction = (data) => new elrond.transaction(data);
