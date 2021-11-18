import { HistoricalPriceTransformer } from "./historical-price-transformer.js";

const stubOptions = {
	token: "ark",
	currency: "BTC",
	rates: {
		ARK: "0.2245082238119826",
		RWF: "0.0010524903502527",
		GIP: "1.2912139347807843",
		IMP: "1.2912139347807843",
		BBD: "0.5000000000000000",
		STD: "0.0000453457727562",
		CHF: "1.0163758476574570",
		LAK: "0.0001124239863569",
		FJD: "0.4530832313896063",
		PLN: "0.2530057718206726",
		CDF: "0.0005906846308299",
		MUR: "0.0266595581620783",
		SHP: "1.2912139347807843",
		VEF: "0.0000040243449975",
		XOF: "0.0016462050674953",
		NOK: "0.1075333221570367",
		ETB: "0.0314068300056331",
		XAF: "0.0016462050674953",
		VUV: "0.0084810183233334",
		SDG: "0.0189573459715640",
		LBP: "0.0006619776955023",
		DZD: "0.0082702432314923",
		AZN: "0.5873715124816447",
		SGD: "0.7142244950432820",
		ZMW: "0.0682054963399226",
		TMT: "0.2857142857142857",
		DKK: "0.1445817971517386",
		LSL: "0.0669748312602614",
		ZAR: "0.0664645038009388",
		WAVES: "1.3752137570698873",
		NPR: "0.0087620471576883",
		KHR: "0.0002446046565156",
		BYN: "0.4542644300503189",
		ANG: "0.5591705934421591",
		GEL: "0.3533568904593640",
		CRC: "0.0017637391976486",
		SRD: "0.1340842048806651",
		ARS: "0.0162213992601712",
		EOS: "4.0056647785444269",
		NZD: "0.6360101303693565",
		MRU: "0.0266908001322689",
		HTG: "0.0102490430340406",
		BOB: "0.1447289010589814",
		BDT: "0.0117817654629162",
		UYU: "0.0262704701473674",
		DOGE: "0.0026294524728428",
		TTD: "0.1481362094669704",
		FKP: "1.2912139347807843",
		LYD: "0.7080628533233638",
		JMD: "0.0070986829011462",
		HUF: "0.0032041012495995",
		ZEC: "61.3899152803303563",
		JOD: "1.4104372355430184",
		HNL: "0.0406254697319938",
		BTN: "0.0140176138045909",
		DASH: "105.0237616530742445",
		TWD: "0.0330764396520359",
		XCD: "0.3700209061811993",
		JEP: "1.2912139347807843",
		MAD: "0.1027235400339830",
		BNB: "22.2025746966976025",
		GBP: "1.2912139347807843",
		IRR: "0.0000237501484384",
		KZT: "0.0026565437261532",
		GMD: "0.0196579516414390",
		MDL: "0.0564374120669847",
		SYP: "0.0019416743924273",
		CLP: "0.0012518792710866",
		THB: "0.0319100045969553",
		TZS: "0.0004333005884323",
		BTC: "9563.8038230478236977",
		MVR: "0.0647458724506313",
		PYG: "0.0001533455311729",
		MOP: "0.1250347283958119",
		BWP: "0.0909829856357882",
		GYD: "0.0047986181899060",
		GGP: "1.2912139347807843",
		GTQ: "0.1311664977679397",
		CLF: "32.9142255282733200",
		XDR: "1.3658254092695838",
		SCR: "0.0729654052772229",
		JPY: "0.0089790756457282",
		MWK: "0.0013588807756776",
		CUP: "0.0388349514563107",
		QAR: "0.2746498214776160",
		PKR: "0.0064889305755093",
		SZL: "0.0669598839986970",
		GHS: "0.1878108504338243",
		BND: "0.7187584454117335",
		UAH: "0.0408121253803996",
		HRK: "0.1449884734163634",
		ETH: "259.1872567687847113",
		SOS: "0.0017301781559949",
		XAU: "1609.6061293801406000",
		PHP: "0.0197374200740576",
		XPF: "0.0090490570375820",
		MZN: "0.0154526061384273",
		UGX: "0.0002730705864025",
		SBD: "0.1214354741678816",
		TRY: "0.1643523121905041",
		RON: "0.2258815025637551",
		SLL: "0.0001314838231994",
		EUR: "1.0798401404656055",
		COP: "0.0002939404411735",
		MMK: "0.0006898130006769",
		VND: "0.0000430751783761",
		NGN: "0.0027382256297919",
		BHD: "2.6522103521074465",
		QTUM: "2.4052620761321339",
		MGA: "0.0002682694697986",
		BAM: "0.5522079482603240",
		LKR: "0.0054995473102627",
		AMD: "0.0020915314175261",
		CNH: "0.1421955273818817",
		HKD: "0.1286281664556522",
		XPD: "2717.9082977740330000",
		MYR: "0.2390000239000024",
		MKD: "0.0175286076078679",
		MXN: "0.0537450635159161",
		TJS: "0.1031916985993378",
		ILS: "0.2918532095097450",
		INR: "0.0139465051947733",
		LRD: "0.0050793648729655",
		AFN: "0.0128528079722369",
		PAB: "1.0000000000000000",
		PGK: "0.2935748789150412",
		YER: "0.0039944084512959",
		CNY: "0.1424176825794691",
		XPT: "994.9951742734047000",
		USDC: "1.0005570206583734",
		OMR: "2.5974025974025974",
		STN: "0.0438596491228070",
		BRL: "0.2290530945073068",
		NAD: "0.0667556742323097",
		CVE: "0.0097541943035505",
		EGP: "0.0641037968678885",
		DAI: "1.0002092787192205",
		ZWL: "0.0031055900524671",
		KGS: "0.0143164740482913",
		WST: "0.3738565131225505",
		MNT: "0.0003630299120035",
		SVC: "0.1143851967253806",
		ERN: "0.0666684133790972",
		DJF: "0.0056163998876720",
		BGN: "0.5524034799209622",
		UZS: "0.0001050240998939",
		BMD: "1.0000000000000000",
		XAG: "18.3884779268388670",
		PEN: "0.2957919163027193",
		LTC: "70.3889692936110175",
		USD: "1.0000000000000000",
		USDT: "1.0004761685263109",
		BIF: "0.0005308147117985",
		KMF: "0.0021908195887191",
		RSD: "0.0091776798825257",
		AED: "0.2722421866492432",
		IDR: "0.0000731003211891",
		RUB: "0.0156985871271586",
		MRO: "0.0028011204481793",
		SEK: "0.1020223690165411",
		VES: "0.0000135840394694",
		AWG: "0.5555555555555556",
		KRW: "0.0008343484572897",
		ISK: "0.0078302410628193",
		IQD: "0.0008383260996899",
		KES: "0.0098716683119447",
		TND: "0.3506926179203928",
		CZK: "0.0432769290691133",
		BZD: "0.4965521898696402",
		GNF: "0.0001050512092731",
		KWD: "3.2669916234334777",
		CAD: "0.7560036136972734",
		CUC: "1.0000000000000000",
		AOA: "0.0020244656675929",
		DOP: "0.0187506519367295",
		SAR: "0.2666240068255746",
		AUD: "0.6648591362947932",
		KYD: "1.2011002077903359",
		SSP: "0.0076769537847382",
		KPW: "0.0011111111111111",
		BCH: "380.1172069422878172",
	},
	dateFormat: "DD.MM",
};

describe("CoinCap", () => {
	describe("HistoricalPriceTransformer", () => {
		it("should transform the given data", async () => {
			const stubResponse = (await import("../../../../test/fixtures/coincap/historical.json")).default;

			const subject = new HistoricalPriceTransformer(stubResponse.data);

			assert.is(subject.transform(stubOptions)).toMatchSnapshot();
		});
	});
});
