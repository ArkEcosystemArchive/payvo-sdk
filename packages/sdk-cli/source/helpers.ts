import { ADA } from "@payvo/sdk-ada";
import { ARK } from "@payvo/sdk-ark";
// import { ATOM } from "@payvo/sdk-atom";
import { AVAX } from "@payvo/sdk-avax";
// import { BTC } from "@payvo/sdk-btc";
import { DOT } from "@payvo/sdk-dot";
import { EGLD } from "@payvo/sdk-egld";
import { TRX } from "@payvo/sdk-trx";
import { XLM } from "@payvo/sdk-xlm";
// import { XRP } from "@payvo/sdk-xrp";
import { Request } from "@payvo/sdk-http-got";
// import { EOS } from "@payvo/sdk-eos";
// import { ETH } from "@payvo/sdk-eth";
import { LSK } from "@payvo/sdk-lsk";
import { Environment } from "@payvo/sdk-profiles";
// import { NEO } from "@payvo/sdk-neo";
import { SOL } from "@payvo/sdk-sol";
import cfonts from "cfonts";

import { ConfStorage } from "./storage";

export const useLogger = (): Console => console;

export const useEnvironment = async (): Promise<Environment> => {
	const env = new Environment({
		coins: {
			ADA,
			ARK,
			// ATOM,
			AVAX,
			// BTC,
			DOT,
			EGLD,
			// EOS,
			// ETH,
			LSK,
			// NEO,
			SOL,
			TRX,
			XLM,
			// XRP,
		},
		storage: new ConfStorage(),
		httpClient: new Request(),
	});

	await env.verify();
	await env.boot();

	return env;
};

export const renderLogo = (): void => {
	console.clear();

	cfonts.say("Plutus", {
		gradient: ["#14b8a6", "#0891b2"],
		independentGradient: true,
		transitionGradient: true,
	});
};
