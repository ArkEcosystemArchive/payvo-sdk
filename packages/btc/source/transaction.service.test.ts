import { describe } from "@payvo/sdk-test";
import { DateTime } from "@payvo/sdk-intl";
import { IoC, Services, Signatories } from "@payvo/sdk";
import { openTransportReplayer, RecordStore } from "@ledgerhq/hw-transport-mocker";
import * as bitcoin from "bitcoinjs-lib";

import { createServiceAsync } from "../test/mocking";
import { TransactionService } from "./transaction.service.js";
import { BindingType } from "./constants";
import { AddressFactory } from "./address.factory.js";
import { AddressService } from "./address.service.js";
import { ClientService } from "./client.service.js";
import { ExtendedPublicKeyService } from "./extended-public-key.service.js";
import { FeeService } from "./fee.service.js";
import { LedgerService } from "./ledger.service.js";
import { musig } from "../test/fixtures/musig";
import { ConfirmedTransactionData } from "./confirmed-transaction.dto.js";
import { SignedTransactionData } from "./signed-transaction.dto.js";
import { MultiSignatureService } from "./multi-signature.service.js";
import { MultiSignatureSigner } from "./multi-signature.signer";
import { WalletData } from "./wallet.dto.js";
import { UUID } from "@payvo/sdk-cryptography";
import {
	oneSignatureLegacyMusigTransferTx,
	twoSignatureLegacyMusigTransferTx,
	unsignedLegacyMusigTransferTx,
} from "../test/fixtures/musig-legacy-txs";
import {
	oneSignatureMusigP2shSegwitTransferTx,
	twoSignatureMusigP2shSegwitTransferTx,
	unsignedMusigP2shSegwitTransferTx,
} from "../test/fixtures/musig-p2sh-segwit-txs";
import {
	oneSignatureNativeSegwitMusigTransferTx,
	twoSignatureNativeSegwitMusigTransferTx,
	unsignedNativeSegwitMusigTransferTx,
} from "../test/fixtures/musig-native-segwit-txs";
import { signatureValidator } from "./helpers.js";

const mnemonic = "skin fortune security mom coin hurdle click emotion heart brisk exact reason";

const createLocalServices = async (context) => {
	const createTransactionService = async () =>
		createServiceAsync(TransactionService, "btc.testnet", async (container) => {
			container.constant(IoC.BindingType.Container, container);
			container.constant(IoC.BindingType.DataTransferObjects, {
				SignedTransactionData,
				ConfirmedTransactionData,
				WalletData,
			});
			container.singleton(IoC.BindingType.DataTransferObjectService, Services.AbstractDataTransferObjectService);
			container.singleton(BindingType.AddressFactory, AddressFactory);
			container.singleton(BindingType.MultiSignatureSigner, MultiSignatureSigner);
			container.singleton(IoC.BindingType.AddressService, AddressService);
			container.singleton(IoC.BindingType.ClientService, ClientService);
			container.singleton(IoC.BindingType.ExtendedPublicKeyService, ExtendedPublicKeyService);
			container.singleton(IoC.BindingType.FeeService, FeeService);
			container.constant(
				IoC.BindingType.LedgerTransportFactory,
				async () => await openTransportReplayer(RecordStore.fromString("")),
			);
			container.singleton(IoC.BindingType.LedgerService, LedgerService);
			container.singleton(IoC.BindingType.MultiSignatureService, MultiSignatureService);
		});

	const createMusigService = async () =>
		createServiceAsync(MultiSignatureService, "btc.testnet", async (container) => {
			container.constant(IoC.BindingType.Container, container);
			container.constant(IoC.BindingType.DataTransferObjects, {
				SignedTransactionData,
				ConfirmedTransactionData,
				WalletData,
			});
			container.singleton(IoC.BindingType.DataTransferObjectService, Services.AbstractDataTransferObjectService);
			container.singleton(BindingType.AddressFactory, AddressFactory);
			container.singleton(BindingType.MultiSignatureSigner, MultiSignatureSigner);
			container.singleton(IoC.BindingType.AddressService, AddressService);
			container.singleton(IoC.BindingType.ClientService, ClientService);
			container.singleton(IoC.BindingType.ExtendedPublicKeyService, ExtendedPublicKeyService);
			container.singleton(IoC.BindingType.FeeService, FeeService);
			container.constant(
				IoC.BindingType.LedgerTransportFactory,
				async () => await openTransportReplayer(RecordStore.fromString("")),
			);
			container.singleton(IoC.BindingType.LedgerService, LedgerService);
			container.singleton(IoC.BindingType.MultiSignatureService, MultiSignatureService);
		});

	const [subject, musigService] = await Promise.all([createTransactionService(), createMusigService()]);

	context.subject = subject;
	context.musigService = musigService;
};

describe("BIP44 wallet", ({ afterEach, beforeEach, it, nock, assert }) => {
	beforeEach(async (context) => {
		await createLocalServices(context);

		nock.fake("https://btc-test.payvo.com:443", { encodedQueryParams: true })
			.post(
				"/api/wallets/addresses",
				'{"addresses":["mv9pNZs3d65sjL68JueZDphWe3vHNmmSn6","mqLZY69ZjogwvFWfLEuGdFUPKeZ6JvyRj1","mwhFCM54gRxY27ynaB7xmmuuGpxATWDzXd","mjTpEuSwBh4KmKMt9pwFViTWQVZzqnWEis","mxdEAqtmiXqqczohNonMbUZP8ntYLPUUF4","miWmLw6bSSqvKDiVpM4SNKuSz5SX9kkMPA","mvRNAXLYUYhxuTdZahnw3mNtyDcxeiSt6y","mirzRVH2z9hyEVDDbv2QAMSaWjPDjFM3Na","mo6XLVZ39Pd3bkSsNjLs6iyz56qF4PYe9g","mtSQ96xauiYzz1xryvLhMNduw57Sie9LSE","mqNKx6o1P74CDDkvMoa2Jq4qcMviKYZFc1","mjr9b55DXcCLEZbqj4Z1JX2GgvZip75ge7","msZGjfGbdNDwhcH4M2UypirvxFeBS1Q8Y6","mo3dcPFguG2PacM5NUfp64k95qUzk8d6UE","n2VAVsBWCESjCaWrdZwJq3aYJr7zLQdEJ8","mytz9GeGaU7QrtGPYh7Pz9f7gihvbHKLum","muKxLoTUeCBL4czS9uaYeoWrWGcc3guyqL","mkkvJiKyYeRPZ8R4ZXv6p3aFBg28asBXZJ","muH9SVf3xvZPTpezLyH8Q6oixq4gNnoz7k","mfvGHJx8C5X7FjVaPvnkX4SLmC8XQ1xYHG","moa7w3BfHA9ENzuzBwCPMjWKWnokUDtc3P","n3rg3cRpwydmzuFF6DB33mDujFZU9xUVhS","my14NrWyUxsAir8sEWVZeDcvGEQVPo9y6m","msedyPEyejVYLWQpSarPL33MPgVzmaFEoN","mkYWa3ndp42DMryDk3R435vFW7he6rAkaN","mpNBsosQ4nvGpGzKYXahmKxtECagWyWHmB","mj4FbCdfjuhnrL47fvXqiGwtb4YA2BNmg7","n2e3aamJ9rijAWNgbhqaEhQz1gkXqVwv3H","mprAVWpzQWXfZQyCL1cXbdS5r1P6PQH7Lx","mgmACAUXLU4Y6UtK6f8FWe5v91ZV9diEYV","mtTirAvBsJnm2sN2yFxc4RbjEPKdPGZPpw","mzix3qtCtrnMPUEyi8WK6tCTjD2p8jSTER","mzLWiJBTaShRjA8aUifDiKPf2QZRk9fc9b","n2rEg9zPanYzxYd7QefY6ts4YyoVmdMUDH","mwqYEM9MreprUT7B74GMvtZoVoTS21ujja","mzmNYJg1o8W8P3dw5LwgpaMZMHBhY8dJ3f","mh6rfmwHMfk7VuBgpvjyxyfYqndvya5FJA","mphDrvh3NZzEhuUjnnfHvmXRyC4vw2rW3E","mn24hyd8P72KQH4Cw2SRwuijV9T3A5K7cZ","n4cVj1UYzqkfyKL6B4Qxwms5YGA3Fg6jzp","moHTPGxDPESt8oxqmPAavpopGUMT5rg3yx","mrwMYe7MoDEjzCSBs7RABHTkvJ1REnBSBz","mwcxFKnUf8QLCXkCAA9kNMUo8PoeE3ZNih","n1ny4eeB6brjVs9vr7hAvVfxPzebx4dXVn","mn4jAxNChyWiQTUWcWD7TkubkWnpvjgBv4","n18mAypHDvxee2E6V6AviKmnZPm1wzFE19","msGcyr9E4cDzxD9EDiPxM29cC8c7QumozJ","mhH5bnYnLJmxN2Z5tHxSeSSkNMahL4EzKs","mqYjXDpCVKMA35dfzdUYBYTQD25AWvVoiG","myvyBt3zC352JR7413McVEvAYuFqkwgqWb","n1i8xa9CRHhMPCV5pddciGpaKdL3tpDu3K","mzuxJDcbgKU6bv3gVXLJ1HdLtAyZXA31zV","mfg6im7pkgQFyuzaQSPt1KBKU9zdZnkqgy","n1ymFJTcCdCZQvrFvCKWJQWpwxVmF7YvLA","mnLovetW93Mdgo2vT5y3wYHUv6BJKgZoxb","msUTXvU96voEAVpz9KQ3fAuwaGd4FQAyrq","mkk64Ch1kKvyXpqRYmWX83yQRsy3eRTTRX","mjw6TdbDdSnfuEenqBAD65AfbsuPSZ5p9Y","mi8F4pRefaGKvVpXJsMbbo4PbBNTtvXmag","mydNPx62PcyYjRrJCS63zf2BH1xHLSXX9u","n3KBoSgDqnBQBeCnKfBjPEdxPHBnZ7xp6h","mnZAdewZ4v8Ppdh7JEEMQJtvLdeRHH1VNn","mg656eh1DVFspD15jkxXxoyi7Kv7fgMdvM","mwWnGEsATbfCS4AV5hFkXWJ2RYCQAqFJGA","mjpkTaJ9DANEdERbYYS9HuUDmgEPYYyBK9","mv9aAsmv6NdvaGoYSkmVUcLpUH9xeziP9G","n2t3VNLRR8a7tGeGiJrUM6e1meTbdw25CZ","mfxMkw5nLm5WioT77twDETR722g9SbnoZt","mzrt4ynLsVUE3osMEkdhpQGqzutQ49CWVA","mwpEVmw1Ng2mnNeiTKrvtwCn6CtN4VD99C","mnMGzAtqhkduba7Nco69Y68Ug1WznBANHY","mt1qyjuY36A6gu9qh35mXMmTEivxysP2Hk","mpJxJHWkiTd8nbPKWtoq8FxYrNeDsfXuyX","mi5td1SkrnPU8pkwkb3d9nWhCJxUzZnBXp","mjRxeSS9P3DHMwmcnkDpdK45T9Zreogd1d","mohFFiM4S5BbwUiLTBmGjNpujaUzd2jav5","mg5a3aAfN5sikYmrSdxJnM6BxG5BxaFybx","ms2PzPBBGF377CnRmN559E2NK4mK82hbYc","msrUFHvQ9TNf55PR5fRKDzK9KbjakL9wLz","mt2cmM2Umo2cSDNZX635pPJTsdJCH31gsp","mnDK5vBXuMh8t6As3YfibqGVqshj9DkGwJ","muM8F7AM7rU7a7uSBs8LS5Qj26NPVzkp7f","mqs6W2ujvSbrGyUXxsybfYxrqyHgSnbKLi","muFyoYmo7wsRzx6bZ5EReRJrQpREFbgBUU","mxyHq29pLa52X4Jghj1KvLs6mhGNDUygBH","n12EFBQ25Wh67KrBTmEjze13PyQxGUdUt5","mzrcunEFvoBPdN4N2KyDi7G4JvpMkWdtCJ","msKrmVTy99orKLdA5fPynmdY7jr2mc3uTN","mfuUcXpTzmxUag9r3hsgn89hoFDBkUCvYV","moohmKrnKUMkzt5jKwFkpUagad6o5NBrd7","mi21bYwhvLL4DSuZhiLKfDLDv7J8xyDhXA","mqzxFciGNGdAtnkyftU2XJ43oesV5V9Q1o","mhJCwNQNe5UiFSU9WnehKF2zQp4qNmhU9V","my1jQfVeHEHfjSWmbrAhQ3a1KuFemg3zvo","mqDxWKmfsGnCKj7gFDbrhQYJdUFtKxbgvL","miN3x4ZecShnV2c5RBDWVaJtiRNpQM9yBB","mwaiuRVexbNkq5n4vn95jonVLnUyCR8D1r","n1Hjmy8aSfi51VeXi9BG7Ku1tePJ6EmWQ5","mvxDAPoF63a1BmNJBmQWHjNXM6LFXtY9mU","my9uRTqts9FStbDzDGyjL4CpkCSwbN69at"]}',
			)
			.reply(
				200,
				'{"data":{"mv9pNZs3d65sjL68JueZDphWe3vHNmmSn6":true,"mqLZY69ZjogwvFWfLEuGdFUPKeZ6JvyRj1":true,"mwhFCM54gRxY27ynaB7xmmuuGpxATWDzXd":true,"mjTpEuSwBh4KmKMt9pwFViTWQVZzqnWEis":false,"mxdEAqtmiXqqczohNonMbUZP8ntYLPUUF4":false,"miWmLw6bSSqvKDiVpM4SNKuSz5SX9kkMPA":false,"mvRNAXLYUYhxuTdZahnw3mNtyDcxeiSt6y":false,"mirzRVH2z9hyEVDDbv2QAMSaWjPDjFM3Na":false,"mo6XLVZ39Pd3bkSsNjLs6iyz56qF4PYe9g":false,"mtSQ96xauiYzz1xryvLhMNduw57Sie9LSE":false,"mqNKx6o1P74CDDkvMoa2Jq4qcMviKYZFc1":false,"mjr9b55DXcCLEZbqj4Z1JX2GgvZip75ge7":false,"msZGjfGbdNDwhcH4M2UypirvxFeBS1Q8Y6":false,"mo3dcPFguG2PacM5NUfp64k95qUzk8d6UE":false,"n2VAVsBWCESjCaWrdZwJq3aYJr7zLQdEJ8":false,"mytz9GeGaU7QrtGPYh7Pz9f7gihvbHKLum":false,"muKxLoTUeCBL4czS9uaYeoWrWGcc3guyqL":false,"mkkvJiKyYeRPZ8R4ZXv6p3aFBg28asBXZJ":false,"muH9SVf3xvZPTpezLyH8Q6oixq4gNnoz7k":false,"mfvGHJx8C5X7FjVaPvnkX4SLmC8XQ1xYHG":false,"moa7w3BfHA9ENzuzBwCPMjWKWnokUDtc3P":false,"n3rg3cRpwydmzuFF6DB33mDujFZU9xUVhS":false,"my14NrWyUxsAir8sEWVZeDcvGEQVPo9y6m":false,"msedyPEyejVYLWQpSarPL33MPgVzmaFEoN":false,"mkYWa3ndp42DMryDk3R435vFW7he6rAkaN":false,"mpNBsosQ4nvGpGzKYXahmKxtECagWyWHmB":false,"mj4FbCdfjuhnrL47fvXqiGwtb4YA2BNmg7":false,"n2e3aamJ9rijAWNgbhqaEhQz1gkXqVwv3H":false,"mprAVWpzQWXfZQyCL1cXbdS5r1P6PQH7Lx":false,"mgmACAUXLU4Y6UtK6f8FWe5v91ZV9diEYV":false,"mtTirAvBsJnm2sN2yFxc4RbjEPKdPGZPpw":false,"mzix3qtCtrnMPUEyi8WK6tCTjD2p8jSTER":false,"mzLWiJBTaShRjA8aUifDiKPf2QZRk9fc9b":false,"n2rEg9zPanYzxYd7QefY6ts4YyoVmdMUDH":false,"mwqYEM9MreprUT7B74GMvtZoVoTS21ujja":false,"mzmNYJg1o8W8P3dw5LwgpaMZMHBhY8dJ3f":false,"mh6rfmwHMfk7VuBgpvjyxyfYqndvya5FJA":false,"mphDrvh3NZzEhuUjnnfHvmXRyC4vw2rW3E":false,"mn24hyd8P72KQH4Cw2SRwuijV9T3A5K7cZ":false,"n4cVj1UYzqkfyKL6B4Qxwms5YGA3Fg6jzp":false,"moHTPGxDPESt8oxqmPAavpopGUMT5rg3yx":false,"mrwMYe7MoDEjzCSBs7RABHTkvJ1REnBSBz":false,"mwcxFKnUf8QLCXkCAA9kNMUo8PoeE3ZNih":false,"n1ny4eeB6brjVs9vr7hAvVfxPzebx4dXVn":false,"mn4jAxNChyWiQTUWcWD7TkubkWnpvjgBv4":false,"n18mAypHDvxee2E6V6AviKmnZPm1wzFE19":false,"msGcyr9E4cDzxD9EDiPxM29cC8c7QumozJ":false,"mhH5bnYnLJmxN2Z5tHxSeSSkNMahL4EzKs":false,"mqYjXDpCVKMA35dfzdUYBYTQD25AWvVoiG":false,"myvyBt3zC352JR7413McVEvAYuFqkwgqWb":false,"n1i8xa9CRHhMPCV5pddciGpaKdL3tpDu3K":false,"mzuxJDcbgKU6bv3gVXLJ1HdLtAyZXA31zV":false,"mfg6im7pkgQFyuzaQSPt1KBKU9zdZnkqgy":false,"n1ymFJTcCdCZQvrFvCKWJQWpwxVmF7YvLA":false,"mnLovetW93Mdgo2vT5y3wYHUv6BJKgZoxb":false,"msUTXvU96voEAVpz9KQ3fAuwaGd4FQAyrq":false,"mkk64Ch1kKvyXpqRYmWX83yQRsy3eRTTRX":false,"mjw6TdbDdSnfuEenqBAD65AfbsuPSZ5p9Y":false,"mi8F4pRefaGKvVpXJsMbbo4PbBNTtvXmag":false,"mydNPx62PcyYjRrJCS63zf2BH1xHLSXX9u":false,"n3KBoSgDqnBQBeCnKfBjPEdxPHBnZ7xp6h":false,"mnZAdewZ4v8Ppdh7JEEMQJtvLdeRHH1VNn":false,"mg656eh1DVFspD15jkxXxoyi7Kv7fgMdvM":false,"mwWnGEsATbfCS4AV5hFkXWJ2RYCQAqFJGA":false,"mjpkTaJ9DANEdERbYYS9HuUDmgEPYYyBK9":false,"mv9aAsmv6NdvaGoYSkmVUcLpUH9xeziP9G":false,"n2t3VNLRR8a7tGeGiJrUM6e1meTbdw25CZ":false,"mfxMkw5nLm5WioT77twDETR722g9SbnoZt":false,"mzrt4ynLsVUE3osMEkdhpQGqzutQ49CWVA":false,"mwpEVmw1Ng2mnNeiTKrvtwCn6CtN4VD99C":false,"mnMGzAtqhkduba7Nco69Y68Ug1WznBANHY":false,"mt1qyjuY36A6gu9qh35mXMmTEivxysP2Hk":false,"mpJxJHWkiTd8nbPKWtoq8FxYrNeDsfXuyX":false,"mi5td1SkrnPU8pkwkb3d9nWhCJxUzZnBXp":false,"mjRxeSS9P3DHMwmcnkDpdK45T9Zreogd1d":false,"mohFFiM4S5BbwUiLTBmGjNpujaUzd2jav5":false,"mg5a3aAfN5sikYmrSdxJnM6BxG5BxaFybx":false,"ms2PzPBBGF377CnRmN559E2NK4mK82hbYc":false,"msrUFHvQ9TNf55PR5fRKDzK9KbjakL9wLz":false,"mt2cmM2Umo2cSDNZX635pPJTsdJCH31gsp":false,"mnDK5vBXuMh8t6As3YfibqGVqshj9DkGwJ":false,"muM8F7AM7rU7a7uSBs8LS5Qj26NPVzkp7f":false,"mqs6W2ujvSbrGyUXxsybfYxrqyHgSnbKLi":false,"muFyoYmo7wsRzx6bZ5EReRJrQpREFbgBUU":false,"mxyHq29pLa52X4Jghj1KvLs6mhGNDUygBH":false,"n12EFBQ25Wh67KrBTmEjze13PyQxGUdUt5":false,"mzrcunEFvoBPdN4N2KyDi7G4JvpMkWdtCJ":false,"msKrmVTy99orKLdA5fPynmdY7jr2mc3uTN":false,"mfuUcXpTzmxUag9r3hsgn89hoFDBkUCvYV":false,"moohmKrnKUMkzt5jKwFkpUagad6o5NBrd7":false,"mi21bYwhvLL4DSuZhiLKfDLDv7J8xyDhXA":false,"mqzxFciGNGdAtnkyftU2XJ43oesV5V9Q1o":false,"mhJCwNQNe5UiFSU9WnehKF2zQp4qNmhU9V":false,"my1jQfVeHEHfjSWmbrAhQ3a1KuFemg3zvo":false,"mqDxWKmfsGnCKj7gFDbrhQYJdUFtKxbgvL":false,"miN3x4ZecShnV2c5RBDWVaJtiRNpQM9yBB":false,"mwaiuRVexbNkq5n4vn95jonVLnUyCR8D1r":false,"n1Hjmy8aSfi51VeXi9BG7Ku1tePJ6EmWQ5":false,"mvxDAPoF63a1BmNJBmQWHjNXM6LFXtY9mU":false,"my9uRTqts9FStbDzDGyjL4CpkCSwbN69at":false}}',
			)
			.post(
				"/api/wallets/addresses",
				'{"addresses":["mya5ZRZi3epftGxvMP5trEfkpCFhPzMPqA","ms4Hd6b1a5TkfeWB9GJgNuFFKasfcNJ3tG","mpYRddfkDi6j6PQtMQSdzW5cWcgBAyn13b","mqwqp8LQ9KTW5z5T7Cz6bgKPYZfU295cNV","mmn4RLfCQ212uJ9J4AsCdSBpdv8Zunsv3T","my2fXCjuD171r23HDt6RdXqyTLtgNStode","mpdihF6RNDvvMUgkR6XVd4vk7bNxn1fWQ1","mgisjKNWXEQ4iTaxkqM1S6AzSk41J6GViq","mrq2jg7jZ8RFmb7ghGUNNdug1uPjJQSRjP","mhjGYmXqLWwvdNCQqTDk2u2g2pLgAyz3oY","mzP1TqX7SZQkEL6KUC93sj2HjppkEpQsJS","mmyKqrUdQY5PEnroPf3KoXA5Hz2HheYtj1","mvvoazPwCXW1ZYt9RkzWU5wqhEJYkzFSkR","mmqj1J2pyHTqeoXqYkEzamXXF24bnBepVi","mpLbymsruNuEfMjmpTNbqnXiDiBPRPMXPz","moawaywryMjx3jCMcVj1rvHk8umnQNfu3g","mvSYNLhGPZAzKsD5JGNzrvUFaoy7XvSvk7","mvYszAkFqNni1wp5KKXpzBhHWEr14wa2E6","mmYuY2CKGp8RHWzE4dEA9N9ggn8uNpPsgd","mhi6GknrHLmxmRzGbY1eQEFbrZ2k7os94w","moa77Sg1ojb6fQFRqvG83mBKDoCCCCvMuQ","mmWxZMQCWgNPP9uAHcW17jNZCGCPJ8FkLs","mzSwHhM4fFK2Z2xUr6BjjGcX9fFCk3PeMi","mrdhJHG3r5V8eFAeqa2rtNjExdAHdeAam7","mq2tFwnyYJvzgijDuLujzrBwi5NLn8hdiV","moqLkvAFW8oTWW8kxHBxouC8AHrWtUBkYU","mty52foLTDMj7CkB86cSUKdMtSARRpponG","mnH8hSsYCuYHJdPMoMNM4YshmtYbRff78i","ms6b343mjyoJwZug9JbMh8DyukWkhURY6x","mh3bUc6wzv5F4wCvh72gJ31xJfoiXuaEXx","mgS7aLWDjNDjzmoqCNDbyirFBY1Fs1YSuj","mq6AU4DDw6GXEFGiBK4y1nqK9W4P94HwyZ","mzfPgEseU1zWa8T3XGwyEoFFZE9yuN1hEv","mu4QZGhCa6xWvnMgCfZcpRmodKeiCnPrXM","n17pBjKyYrogPw8NDNVdypbCbt2B4e53AJ","mtKSHEEzm5oLevFdQH5afa5fXX3aDUTq8d","mrfvs5u1un7EHTtyQZLNqFNuCTeFVNhmsu","mvg2868L1hvtSfJubvCLGcFia2p1u66Lpg","mj4Cq6q5ByfoE9ZpvqqQS7Ls6X3yhKGnSF","mtfsBReVptQrBJRM9t6afcqZuYhxT7YTDd","muETqzJv9x9yeiEKu7ELhX3q8B3cnb21kA","msS6VdzDBYepWD6SgMtQmHUz2Zyq2WNiZZ","mtg9uwQHSJmvhYMWouesT3pMUnYmS8DA6c","mfh9EECmpnqdBgrpoZFs7ms98a2rcpLXvt","mheQGcT3SMXovQ47Rwhfupx3AZY9t1V5Cx","mmj54DT6W6Rf6WwVVg21cEbttHg88iy5Nm","mmkH9ecvncNg1JNtpdNyPj21T28AE2WEgs","mpSGyrMqKW5EQeQFXEqnZnUjCnAbzGxs8U","miYwei39kHYxAd1BRgW6hJqGgFMmAFNrUz","mgszb8nLYpVXysfnedgy4SUshcNUfpbvLK","mjnTNFXHcHcHLvbgpMFdtpc7VbTNeHN6bP","mgjjCjtzSYVjyq9hDUhwBidmMJijsShAy9","mpSe2ZvSFFBJmnZzCJ3Xg1Fw8D7rP4XexQ","mr4MZE3Hr8txpx3wsWj72dThFNwMgiiwtM","mmAUqYqCdjUpPRHkXXyrt2UTGCkk9aH5M4","n16UH9euzeJgfVb28gucEZAJJwPaSYwnuv","mwYWbp4uLMg9uQ16uYzuBxWFp5Nuey5DF5","mvTiBsGRhYQc6f6DFVvYTAN3wva9b6iz3k","mzKH7EJr9v215NVDnN1jCfrC6dQCsEf7CZ","mhXoJGLzZGDhY6H7ow5SKGgKvEPiAFt65h","mxJntKV7bQ2Ydb2GiEqFwcS2CCPiqwn5NS","mspNeiE31jptQeG1dWVzsNERbn2BFjkcBJ","mr2dhPGiWVDwbYdz5NYCbsB8f8UKYxP9gc","n12LDfjtXkbrt7ayakm79V3Z2db8TYBnSK","mxsz7M8ryrkcmpjba5Gw1b3zQnybUFQhC7","n45c4uLpTWmJG48QL5G1BXrT8cHGZSSrN2","n1TjZTwyhmTxCaEvqu3FnLZNj2ToJV7htj","mqGLob3vcS9WQQ6dtPo2c1dfhZpyD5gnAR","mk1tqhhCfcgGJD2v3PBfHgCbKvaNryFLwS","muSKNhMDNqgJFWQXrZ6TopcQBskmKL8XzM","n2rErFT26dm95id4cZkeAfbXRoTTfcBuAN","mzBGsABUb6ePNLgkh3GsbajhyZcaNkSN7f","mp8n4qvSKyfbqcfwGFjiRShjFbep21vZGz","moNRsPqShPU2Lu1mLzRCH8AHr1y1p4jeAd","mnkmEBevngZ4RSDNZjxSp9LhzxMmkPpbAS","morD5hKxsbGdQPcv6HHzSJ5CSkDVTm5bA3","n2oVKQV9BWwYH93Xi8SjHzJQNW6PcXj6Fs","mqgJXLHC8jAu3Y6x47zufGx98AVtP4nqJr","mtAEUhUjmzpFsakaVJmPjFVitweGagWu7i","muc8LSTdRwE5AnW6KxiYuEdAKTqLc3E83S","mhGjXfCSu2Trf38r8aE7SvyXJdqRTVm6w7","mjeeFqvxF3Zsz2C9hZtwMUo9Y2kupd2ESj","mydT6MpNAmUpgdrfmbEzS96DQPvNWSog98","mnNmS9xnrn5ZJwALQqsTbxrVjL5gPjE1D9","n32H2h9dqJ15d19yMpE79LoeGVTEHPgDGw","mrSDFk967B9L1KzzudutDjh37DFry66Nhx","mnA7ZTiAz3qKSxLZdPHXh5p1goWvSpQpmn","mhctYwa9SGYdhCNrUWP9ZM2gm7CEyregpW","mheT3L9RCJcQvEazGzLRGbzLCoCbdTPSpg","mnU2B6JSkBBT3oRBL4FGN3xuUx2Uj2UZbB","mkPoZ4sydswBhFw8TnHvYJrwT18ya3E6Kq","mi7ShFCXgfWghYSDEKbKMhXQPrrZoqk3NX","myJLjQB2EKLeTGVoziKLEHCTgy4XiWXBoa","mzH8DNqu1hNSdoyHM5VYRbAQWthWk6ENFe","mkBbBUsZrmZCeeAfmYQn5bPTPmKEH22pQd","mj2nECW7U8ydt9KY32ijxyNHvDhSFYZtWu","mun5PPRKGgdiv3F3uuVnDxWHJgbx6X8u1T","mmZvz6Rxdis4rYH2hE3jEGzaFcA76p4M9v","myHcAK4HGtifqYN3uatN8j6b9txe2UKUsn","mzQRJEFQikWKsfRt1HoiT7U5F5u3ESCuzN"]}',
			)
			.reply(
				200,
				'{"data":{"mya5ZRZi3epftGxvMP5trEfkpCFhPzMPqA":false,"ms4Hd6b1a5TkfeWB9GJgNuFFKasfcNJ3tG":false,"mpYRddfkDi6j6PQtMQSdzW5cWcgBAyn13b":false,"mqwqp8LQ9KTW5z5T7Cz6bgKPYZfU295cNV":false,"mmn4RLfCQ212uJ9J4AsCdSBpdv8Zunsv3T":false,"my2fXCjuD171r23HDt6RdXqyTLtgNStode":false,"mpdihF6RNDvvMUgkR6XVd4vk7bNxn1fWQ1":false,"mgisjKNWXEQ4iTaxkqM1S6AzSk41J6GViq":false,"mrq2jg7jZ8RFmb7ghGUNNdug1uPjJQSRjP":false,"mhjGYmXqLWwvdNCQqTDk2u2g2pLgAyz3oY":false,"mzP1TqX7SZQkEL6KUC93sj2HjppkEpQsJS":false,"mmyKqrUdQY5PEnroPf3KoXA5Hz2HheYtj1":false,"mvvoazPwCXW1ZYt9RkzWU5wqhEJYkzFSkR":false,"mmqj1J2pyHTqeoXqYkEzamXXF24bnBepVi":false,"mpLbymsruNuEfMjmpTNbqnXiDiBPRPMXPz":false,"moawaywryMjx3jCMcVj1rvHk8umnQNfu3g":false,"mvSYNLhGPZAzKsD5JGNzrvUFaoy7XvSvk7":false,"mvYszAkFqNni1wp5KKXpzBhHWEr14wa2E6":false,"mmYuY2CKGp8RHWzE4dEA9N9ggn8uNpPsgd":false,"mhi6GknrHLmxmRzGbY1eQEFbrZ2k7os94w":false,"moa77Sg1ojb6fQFRqvG83mBKDoCCCCvMuQ":false,"mmWxZMQCWgNPP9uAHcW17jNZCGCPJ8FkLs":false,"mzSwHhM4fFK2Z2xUr6BjjGcX9fFCk3PeMi":false,"mrdhJHG3r5V8eFAeqa2rtNjExdAHdeAam7":false,"mq2tFwnyYJvzgijDuLujzrBwi5NLn8hdiV":false,"moqLkvAFW8oTWW8kxHBxouC8AHrWtUBkYU":false,"mty52foLTDMj7CkB86cSUKdMtSARRpponG":false,"mnH8hSsYCuYHJdPMoMNM4YshmtYbRff78i":false,"ms6b343mjyoJwZug9JbMh8DyukWkhURY6x":false,"mh3bUc6wzv5F4wCvh72gJ31xJfoiXuaEXx":false,"mgS7aLWDjNDjzmoqCNDbyirFBY1Fs1YSuj":false,"mq6AU4DDw6GXEFGiBK4y1nqK9W4P94HwyZ":false,"mzfPgEseU1zWa8T3XGwyEoFFZE9yuN1hEv":false,"mu4QZGhCa6xWvnMgCfZcpRmodKeiCnPrXM":false,"n17pBjKyYrogPw8NDNVdypbCbt2B4e53AJ":false,"mtKSHEEzm5oLevFdQH5afa5fXX3aDUTq8d":false,"mrfvs5u1un7EHTtyQZLNqFNuCTeFVNhmsu":false,"mvg2868L1hvtSfJubvCLGcFia2p1u66Lpg":false,"mj4Cq6q5ByfoE9ZpvqqQS7Ls6X3yhKGnSF":false,"mtfsBReVptQrBJRM9t6afcqZuYhxT7YTDd":false,"muETqzJv9x9yeiEKu7ELhX3q8B3cnb21kA":false,"msS6VdzDBYepWD6SgMtQmHUz2Zyq2WNiZZ":false,"mtg9uwQHSJmvhYMWouesT3pMUnYmS8DA6c":false,"mfh9EECmpnqdBgrpoZFs7ms98a2rcpLXvt":false,"mheQGcT3SMXovQ47Rwhfupx3AZY9t1V5Cx":false,"mmj54DT6W6Rf6WwVVg21cEbttHg88iy5Nm":false,"mmkH9ecvncNg1JNtpdNyPj21T28AE2WEgs":false,"mpSGyrMqKW5EQeQFXEqnZnUjCnAbzGxs8U":false,"miYwei39kHYxAd1BRgW6hJqGgFMmAFNrUz":false,"mgszb8nLYpVXysfnedgy4SUshcNUfpbvLK":false,"mjnTNFXHcHcHLvbgpMFdtpc7VbTNeHN6bP":false,"mgjjCjtzSYVjyq9hDUhwBidmMJijsShAy9":false,"mpSe2ZvSFFBJmnZzCJ3Xg1Fw8D7rP4XexQ":false,"mr4MZE3Hr8txpx3wsWj72dThFNwMgiiwtM":false,"mmAUqYqCdjUpPRHkXXyrt2UTGCkk9aH5M4":false,"n16UH9euzeJgfVb28gucEZAJJwPaSYwnuv":false,"mwYWbp4uLMg9uQ16uYzuBxWFp5Nuey5DF5":false,"mvTiBsGRhYQc6f6DFVvYTAN3wva9b6iz3k":false,"mzKH7EJr9v215NVDnN1jCfrC6dQCsEf7CZ":false,"mhXoJGLzZGDhY6H7ow5SKGgKvEPiAFt65h":false,"mxJntKV7bQ2Ydb2GiEqFwcS2CCPiqwn5NS":false,"mspNeiE31jptQeG1dWVzsNERbn2BFjkcBJ":false,"mr2dhPGiWVDwbYdz5NYCbsB8f8UKYxP9gc":false,"n12LDfjtXkbrt7ayakm79V3Z2db8TYBnSK":false,"mxsz7M8ryrkcmpjba5Gw1b3zQnybUFQhC7":false,"n45c4uLpTWmJG48QL5G1BXrT8cHGZSSrN2":false,"n1TjZTwyhmTxCaEvqu3FnLZNj2ToJV7htj":false,"mqGLob3vcS9WQQ6dtPo2c1dfhZpyD5gnAR":false,"mk1tqhhCfcgGJD2v3PBfHgCbKvaNryFLwS":false,"muSKNhMDNqgJFWQXrZ6TopcQBskmKL8XzM":false,"n2rErFT26dm95id4cZkeAfbXRoTTfcBuAN":false,"mzBGsABUb6ePNLgkh3GsbajhyZcaNkSN7f":false,"mp8n4qvSKyfbqcfwGFjiRShjFbep21vZGz":false,"moNRsPqShPU2Lu1mLzRCH8AHr1y1p4jeAd":false,"mnkmEBevngZ4RSDNZjxSp9LhzxMmkPpbAS":false,"morD5hKxsbGdQPcv6HHzSJ5CSkDVTm5bA3":false,"n2oVKQV9BWwYH93Xi8SjHzJQNW6PcXj6Fs":false,"mqgJXLHC8jAu3Y6x47zufGx98AVtP4nqJr":false,"mtAEUhUjmzpFsakaVJmPjFVitweGagWu7i":false,"muc8LSTdRwE5AnW6KxiYuEdAKTqLc3E83S":false,"mhGjXfCSu2Trf38r8aE7SvyXJdqRTVm6w7":false,"mjeeFqvxF3Zsz2C9hZtwMUo9Y2kupd2ESj":false,"mydT6MpNAmUpgdrfmbEzS96DQPvNWSog98":false,"mnNmS9xnrn5ZJwALQqsTbxrVjL5gPjE1D9":false,"n32H2h9dqJ15d19yMpE79LoeGVTEHPgDGw":false,"mrSDFk967B9L1KzzudutDjh37DFry66Nhx":false,"mnA7ZTiAz3qKSxLZdPHXh5p1goWvSpQpmn":false,"mhctYwa9SGYdhCNrUWP9ZM2gm7CEyregpW":false,"mheT3L9RCJcQvEazGzLRGbzLCoCbdTPSpg":false,"mnU2B6JSkBBT3oRBL4FGN3xuUx2Uj2UZbB":false,"mkPoZ4sydswBhFw8TnHvYJrwT18ya3E6Kq":false,"mi7ShFCXgfWghYSDEKbKMhXQPrrZoqk3NX":false,"myJLjQB2EKLeTGVoziKLEHCTgy4XiWXBoa":false,"mzH8DNqu1hNSdoyHM5VYRbAQWthWk6ENFe":false,"mkBbBUsZrmZCeeAfmYQn5bPTPmKEH22pQd":false,"mj2nECW7U8ydt9KY32ijxyNHvDhSFYZtWu":false,"mun5PPRKGgdiv3F3uuVnDxWHJgbx6X8u1T":false,"mmZvz6Rxdis4rYH2hE3jEGzaFcA76p4M9v":false,"myHcAK4HGtifqYN3uatN8j6b9txe2UKUsn":false,"mzQRJEFQikWKsfRt1HoiT7U5F5u3ESCuzN":false}}',
			)
			.post(
				"/api/wallets/transactions/unspent",
				'{"addresses":["mv9pNZs3d65sjL68JueZDphWe3vHNmmSn6","mqLZY69ZjogwvFWfLEuGdFUPKeZ6JvyRj1","mwhFCM54gRxY27ynaB7xmmuuGpxATWDzXd"]}',
			)
			.reply(
				200,
				'{"data":[{"address":"mqLZY69ZjogwvFWfLEuGdFUPKeZ6JvyRj1","txId":"94336a791ade1aee7a55f0132e1c766e7272b304b805347f34a716cd0b10ebe6","outputIndex":0,"script":"76a9146bba19cd7beb53addb39ab750531668ad409474688ac","satoshis":1000000},{"address":"mv9pNZs3d65sjL68JueZDphWe3vHNmmSn6","txId":"3b182fedfbf8dca089b5ff97004e53081c6610a2eb08dd9bd8c3243a64216649","outputIndex":0,"script":"76a914a08a89d81d7a9be55a18d12f9808dcd572e2cd1c88ac","satoshis":1000000},{"address":"mwhFCM54gRxY27ynaB7xmmuuGpxATWDzXd","txId":"473f473a78f569e93ebd0955d3eb5855c888938106e8f55670c6b75ec1b44d16","outputIndex":0,"script":"76a914b17447e9524445be6572706a3ccfdc9c0e2a8ae788ac","satoshis":1000000}],"links":{"first":"https:\\/\\/btc-test.payvo.com\\/api\\/wallets\\/transactions\\/unspent?page=1","last":"https:\\/\\/btc-test.payvo.com\\/api\\/wallets\\/transactions\\/unspent?page=1","prev":null,"next":null},"meta":{"current_page":1,"from":1,"last_page":1,"links":[{"url":null,"label":"&laquo; Previous","active":false},{"url":"https:\\/\\/btc-test.payvo.com\\/api\\/wallets\\/transactions\\/unspent?page=1","label":"1","active":true},{"url":null,"label":"Next &raquo;","active":false}],"path":"https:\\/\\/btc-test.payvo.com\\/api\\/wallets\\/transactions\\/unspent","per_page":15,"to":3,"total":3}}',
			)
			.post(
				"/api/wallets/transactions/raw",
				'{"transaction_ids":["94336a791ade1aee7a55f0132e1c766e7272b304b805347f34a716cd0b10ebe6","3b182fedfbf8dca089b5ff97004e53081c6610a2eb08dd9bd8c3243a64216649","473f473a78f569e93ebd0955d3eb5855c888938106e8f55670c6b75ec1b44d16"]}',
			)
			.reply(
				200,
				'{"data":{"94336a791ade1aee7a55f0132e1c766e7272b304b805347f34a716cd0b10ebe6":"01000000000101f918cfe92daf57938655190a9c49512ed3c90880de4573698e1ad9d91b86fdd40100000000f0ffffff0340420f00000000001976a9146bba19cd7beb53addb39ab750531668ad409474688ac6002200000000000160014a7ec2786b0b69fde7fa17c91b840010a0a459a1e0000000000000000196a1768747470733a2f2f746274632e6269746170732e636f6d0247304402202e95518835663a419bb68a20bf87050d60a5f74153344c00a9f4c58059501ae20220379384577ff91409c027db710366fa5bee110b1f3e93e0dd2fe686ca8dc705bd012102d9df366a292c38fee7d741066404cff7a2a7d33d5e065a1d0618b2424e18896400000000","3b182fedfbf8dca089b5ff97004e53081c6610a2eb08dd9bd8c3243a64216649":"010000000001018fd59fca8c155ca700f8dc82c582177464409d7525a7a529495ca1af9ae565ce0100000000f0ffffff0340420f00000000001976a914a08a89d81d7a9be55a18d12f9808dcd572e2cd1c88ac3af124000000000016001426675e52bd5285e36d3d5ab451adb40748c636af0000000000000000196a1768747470733a2f2f746274632e6269746170732e636f6d024830450221009c9262185b692f625351550fa76030a6d8d48f701c2dd09feb7c48484b85e6c302205f34e1e681ac5aa0f8e4ca7552b187310e37ef7e2376600951ef27141133cb6c012102bc4a237367a011b80c98e4a93fdd056f2d630097b82d455b96b2d441889d6b0b00000000","473f473a78f569e93ebd0955d3eb5855c888938106e8f55670c6b75ec1b44d16":"01000000000101605cf9d712df4533c9a8cbbc023b4bc97921d92ee23c3e450ad380455b8990460100000000f0ffffff0340420f00000000001976a914b17447e9524445be6572706a3ccfdc9c0e2a8ae788ac6cd41f0000000000160014e81b5d8f035a3b950ad72d869be2448b023d23410000000000000000196a1768747470733a2f2f746274632e6269746170732e636f6d024730440220148c049f0f9d5c2b6d5b8a3efbe02e5953a414dc078688f55a6ac7a8612ae8800220343527bc59b13724e6878e5d79952a83f53ebfa9aae84a7a6b5342dcae0195d8012103418ce7ab05d74e5b240116672dc1b0c983d534258bbedfd676d212a33554bed500000000"}}',
			)
			.get("/api/fees")
			.reply(200, {
				data: {
					min: 0.00001074,
					avg: 0.00001,
					max: 0.00180617,
				},
			})
			.persist();
	});

	it("should generate and sign a transfer transaction", async (context) => {
		const signatory = new Signatories.Signatory(
			new Signatories.MnemonicSignatory({
				signingKey: mnemonic,
				address: "address",
				publicKey: "publicKey",
				privateKey: "privateKey",
				options: {
					bip44: {
						account: 0,
					},
				},
			}),
		);
		const result = await context.subject.transfer({
			data: {
				amount: 0.001,
				to: "tb1q705a7ak4ejlmfc5uq3afg2q45v4yw7kyv8jgsn",
			},
			signatory,
		});

		assert.is(result.id(), "a24184f69af2af696a07e3a70c468339654904bbc254ea908e28e0c049200504");
		assert.is(result.sender(), "mv9pNZs3d65sjL68JueZDphWe3vHNmmSn6");
		assert.is(result.recipient(), "tb1q705a7ak4ejlmfc5uq3afg2q45v4yw7kyv8jgsn");
		assert.is(result.amount().toNumber(), 100_000);
		assert.is(result.fee().toNumber(), 169_000);
		assert.instance(result.timestamp(), DateTime);
		assert.is(
			result.toBroadcast(),
			"0200000001e6eb100bcd16a7347f3405b804b372726e761c2e13f0557aee1ade1a796a3394000000006b483045022100fea3dfdd9e2afeb1d594c2020334a06fdb660d40238d6b2c45fb33fd90b5357102202297135d22b0d45d6638af023dfa3cc06f6d4cac1073a101a66d5acc5073b155012102692389c4f8121468f18e779b66253b7eb9495fe215dc1edf0e11cbaeff3f67c8ffffffff02a086010000000000160014f3e9df76d5ccbfb4e29c047a942815a32a477ac478270b00000000001976a914c6099396735474ac6ff0ed5d0d0ad3f55f470f5488ac00000000",
		);
	});
});

describe("BIP49 wallet", ({ afterEach, beforeEach, it, nock, assert }) => {
	beforeEach(async (context) => {
		await createLocalServices(context);

		nock.fake("https://btc-test.payvo.com:443", { encodedQueryParams: true })
			.post(
				"/api/wallets/addresses",
				'{"addresses":["2N789HT3aXABch6TqknX2TCekPEUGLMfurn","2N6PNXPhGCbuSH2vbKBAw3yV6Shx9xhVmdT","2MyHRvRGabh3rLgKTxm9w6ACwiismanVYcB","2MvxBq4NpBpBT2ZJhkj4eJXjAWzbo3vsnGR","2N5H3mWaqj7m8NQJaNXGt1myGsN9HZZVvbm","2MsKn6krztaAgssnYAXAUEjpBUB6hUoP4hF","2NAQ4EK2QdhUBSAunsRbgoh4Sd51rcZr1rb","2N4zv2KR93169CLL19XhXqMoyoThqneEGFe","2MwWzNwJLsLATochEcYmujbfmPyZxdXx9iD","2NFKpqkYwkciKeH4BxeUzD7UTHa5PJRcMNE","2NDCrPojzPDn6R7cHrxzmZBWndnxcuXVxiM","2N8nza539HAe6K9coAsZuEpGH6XTVQvvaMh","2Mw9ri9oks7CGkXxnkJseohk5dzmK39pndL","2N6BTWoweaufr7RXHPaPTiyPkrNdcjzeAKC","2MxJJ2CCNrDuZ9sYhAZjHcydeZY6U6nEXTC","2MsxeeHWUevXrCrXwc7tL6GPCmYuSyYZNuP","2NFwTtVpP8TqLRVLeNQ4z2BKD9LvkJGgqTx","2N6rWGYk8HaaezqWhysBZoNpJXkrk2ZBBnz","2MtYXRziznpvRfQVDfEhDTCYacUK1VKTYAR","2N8ST28NsESkkBohTFZhwXvJSTphe7eByUw","2N28utBztNg5XuEkustWDUsS3fQjQynPKxJ","2NCbA9qsyz3afU6DKUDG7pzxM9L5NqXjNzr","2MvyN2nHkpWrRoivaYZaAjJZR8wQPNvUiAE","2N6qNLeNJn7DWKM6ZCcF8GqCuYngifk1KoW","2N2kKdqAvvD5xT95LarwfPYHXLy4Kw7i7mu","2MvT4SX9zJm3H8NeGdEjsiJ5MuSyMqukLKj","2N8LFVMBZ22ZRHVo2qy41EiE3RGLnxk4QNd","2MxwHtHpBgGtC7RrFppwTrcjAthC1EQHj5p","2Msu29MZN2wdtub4Z3YxhS1XbrPBMHyuwsp","2NEjp5T1G6y61H1JPLPRxzx9wKctHhJz93x","2N5gz2yCQJRm4SqmUZcfc67HTjrUo55gHh3","2N3AwQqdPqeQ6MvS7rhSaC2gFvTru41xiK3","2MxrkkkBriArzsvv7DDnxANz8HjYaEXj86i","2N8uaCHXCrBVvp713ryViPfv4S3XxuaCTYK","2NFe4WTqCHgSYLrHwa6EF2rqgEeK4TdP1HU","2N2HC6Gxy85tGWNQsDLrJpDkEFsYtFmte2C","2Mwbt8GFowWm3AoatvhSCaQqNXV4YUkiDqs","2NE4RjenrKzgCNdyn5ePjGYYuViJTQrhdCT","2N5ZVzEfrSomVa2YVtwXz5SR3LpnWz7jSmQ","2NFXwS9S3zEdw4uyuPd4aJrrGgsNUqdBsLp","2MzdNTpW3WCBmZcjX4BV33dZsbLho6We4oT","2MzVNYFRpQnxLZ8AEUeyVuZBDrue9dq2Ukj","2MyCpARHGEr82U8JhFdQJ1rB4pYtWVSLeYR","2NDtXCMwG7btvTJ3iWckxQWD4T8f4K6KNLh","2MyCFvaYjcdKPEGxSGqNNwMtwEDnMEcH56k","2NFo3ZPMYMEe8W1ri7UD5AipdV8YfVGydYB","2N1Bd8YCSrSbHSZsbf5o3V3FrniZDwnQ8gw","2N8Mqj5ncuQGWEqzFp3muozALZVnt2qMbtR","2MtZ5cVKWSPB3PdozB5mjrmA3hXXZzuhSQG","2NDoKKEN54H3Zwwi1WDtLQ1pzC5VzGYSEKT","2MtaDtk6MxnYcLgRk2Tx4DduJxSZMwoi8TP","2MvpLKQqkeEnuU9EzASgd9Yg16AjAPzf8UV","2Mz4VbaTkocnPkUt7CxPRXg9uYd8pSGJS5b","2NAsJp3YXff1Ap77M9yBMuPfQAwe2sTfZzg","2N4GYLo4Zbz6hfgN1zq8GFqTRqEkc4XJ7j9","2NEA6FpdA3p4c5AsXVSwLdTZabQQgpzoWwY","2NAbA1nTMj8ENVs3wTi8QoQseuarXVhMke3","2MwrTMp2LXzCcJwKRvxAa3wdBNu6igdWSjz","2MzdrYY7sGc1gZkZwd6oKX6UExwX6UgVUCV","2MxqZAjk7UHqfgkEpHhkHhWpXHBjF9BQGpa","2MyV6XHikXbJuGvjQFLn8T2mW3s6BnZYALs","2N9xxRKVjXdgGoeu1bpZn6BDBBkH1FY2co9","2N2Y614L73mmGm5VpCCgb9zmbZZTRgvmj4b","2MwEek5fYgMjLh5z4db66bs2odPmhKayiXY","2MtT9XVV7JnMqZPTuRWmTZyKWrsFtxgWo9k","2MwEJWJsRmrQbmuzZpQJ1zrj33CPF9DxDpL","2N8a3JoEGX5LdnNofQPMV8ERKuVXdpuFgJc","2NDHtfxJv3WMp3x6WqDihHkGH2qPGart3wo","2N9zgD6ruwBvx711E1vdUhJwNW21UXdcjCD","2N2UCaSW44EHyxjuxTKghiGSjLaTdq9hM9Y","2N9zAgXDx2edhJBPSsr5BDHuxpjFg23k5m9","2NALsVSqT1x2TtdcGTWckvkwrbRRjdKDUEf","2MwmPqU3ukg8UyrsncEpTK5sLg3GcE7xqse","2NFBMzd7JgdKZKbGBaH6ukD6ngMDULCWBKv","2NDQa1rxk2RJ3ADTa53mhUp9RqeebFxNfAq","2MxWz1b1ALgwZUYDGFZYqXSrTPxSZTTYoQP","2Mwq3agY92JHqyqk8ScHtTdLJ6eYWDwNsaU","2MzZ6rGbSXx28BWdWsEfgxQDyHEhK3FPDbP","2MvJ93MF8q42nLUzep59v6sJRHca5Kz5Qxp","2N1eYd4UzUHmGxpNqhudeB2GaPNQsAvEhVG","2N48CwaTWgrKm8AkCGXHKyhCL1ttQFYtNNw","2Mt9iBT4RafyvC2S1JV2BcSZRmYQjL9e3g6","2MsrLJk9G84TsEJLXYTayPDM3keXJTFWohP","2N9Q8GSUN14qRTwgromn3ddjrUaX7NQFwzg","2NFY3ELk4XoVh6jWLmF647hMjcwyMVnbJMA","2MvVw42sEYGL2YwyYhwDbtdZpdv4ErQnXTH","2N2BLY9qoKVFDsynTdthzACLqZd4PfPbYKt","2N4ETCE7UkrE48pGcpW8P3iWqsoZuvgw7HX","2MstS3Yt5ehcEFxvELNeRhCdR4fRC7JWPmK","2N7ewhV2ZXSwHZuaagMHdSvJjpvaNuQbfQD","2NGJMGNeoocbNhurRw9EdWUqMYghC7EGaQA","2Mz3GJ4eCk4Pzc53STigVKQKiwuRwf6W8CW","2N6y5cWzLfLBBqxxGyMiykN9Ag3tCmy3yNv","2N4jqmC9t3ua1Dq9V6AxLHu4oHfGtT59dUj","2N1nsNGjv7NTR3rix4d8YLvpD3ohSeNFSZG","2N2hrq76A891qLShomZ2JfD6F4GMopj8KpW","2N7pcjatioAmK4PzKHDXcs5n9QN4wzkJedR","2MtrmGAW78kfkzaVfy4fw7tfwi9xmcPJmjh","2N4s867WeGgaQc1CAaTdLpaNjkr4h379Jbd","2MwKvaKjUp8CNP2PhUP2J3CtSvk1SujxWQy"]}',
			)
			.reply(
				200,
				'{"data":{"2N789HT3aXABch6TqknX2TCekPEUGLMfurn":true,"2N6PNXPhGCbuSH2vbKBAw3yV6Shx9xhVmdT":true,"2MyHRvRGabh3rLgKTxm9w6ACwiismanVYcB":true,"2MvxBq4NpBpBT2ZJhkj4eJXjAWzbo3vsnGR":false,"2N5H3mWaqj7m8NQJaNXGt1myGsN9HZZVvbm":false,"2MsKn6krztaAgssnYAXAUEjpBUB6hUoP4hF":false,"2NAQ4EK2QdhUBSAunsRbgoh4Sd51rcZr1rb":false,"2N4zv2KR93169CLL19XhXqMoyoThqneEGFe":false,"2MwWzNwJLsLATochEcYmujbfmPyZxdXx9iD":false,"2NFKpqkYwkciKeH4BxeUzD7UTHa5PJRcMNE":false,"2NDCrPojzPDn6R7cHrxzmZBWndnxcuXVxiM":false,"2N8nza539HAe6K9coAsZuEpGH6XTVQvvaMh":false,"2Mw9ri9oks7CGkXxnkJseohk5dzmK39pndL":false,"2N6BTWoweaufr7RXHPaPTiyPkrNdcjzeAKC":false,"2MxJJ2CCNrDuZ9sYhAZjHcydeZY6U6nEXTC":false,"2MsxeeHWUevXrCrXwc7tL6GPCmYuSyYZNuP":false,"2NFwTtVpP8TqLRVLeNQ4z2BKD9LvkJGgqTx":false,"2N6rWGYk8HaaezqWhysBZoNpJXkrk2ZBBnz":false,"2MtYXRziznpvRfQVDfEhDTCYacUK1VKTYAR":false,"2N8ST28NsESkkBohTFZhwXvJSTphe7eByUw":false,"2N28utBztNg5XuEkustWDUsS3fQjQynPKxJ":false,"2NCbA9qsyz3afU6DKUDG7pzxM9L5NqXjNzr":false,"2MvyN2nHkpWrRoivaYZaAjJZR8wQPNvUiAE":false,"2N6qNLeNJn7DWKM6ZCcF8GqCuYngifk1KoW":false,"2N2kKdqAvvD5xT95LarwfPYHXLy4Kw7i7mu":false,"2MvT4SX9zJm3H8NeGdEjsiJ5MuSyMqukLKj":false,"2N8LFVMBZ22ZRHVo2qy41EiE3RGLnxk4QNd":false,"2MxwHtHpBgGtC7RrFppwTrcjAthC1EQHj5p":false,"2Msu29MZN2wdtub4Z3YxhS1XbrPBMHyuwsp":false,"2NEjp5T1G6y61H1JPLPRxzx9wKctHhJz93x":false,"2N5gz2yCQJRm4SqmUZcfc67HTjrUo55gHh3":false,"2N3AwQqdPqeQ6MvS7rhSaC2gFvTru41xiK3":false,"2MxrkkkBriArzsvv7DDnxANz8HjYaEXj86i":false,"2N8uaCHXCrBVvp713ryViPfv4S3XxuaCTYK":false,"2NFe4WTqCHgSYLrHwa6EF2rqgEeK4TdP1HU":false,"2N2HC6Gxy85tGWNQsDLrJpDkEFsYtFmte2C":false,"2Mwbt8GFowWm3AoatvhSCaQqNXV4YUkiDqs":false,"2NE4RjenrKzgCNdyn5ePjGYYuViJTQrhdCT":false,"2N5ZVzEfrSomVa2YVtwXz5SR3LpnWz7jSmQ":false,"2NFXwS9S3zEdw4uyuPd4aJrrGgsNUqdBsLp":false,"2MzdNTpW3WCBmZcjX4BV33dZsbLho6We4oT":false,"2MzVNYFRpQnxLZ8AEUeyVuZBDrue9dq2Ukj":false,"2MyCpARHGEr82U8JhFdQJ1rB4pYtWVSLeYR":false,"2NDtXCMwG7btvTJ3iWckxQWD4T8f4K6KNLh":false,"2MyCFvaYjcdKPEGxSGqNNwMtwEDnMEcH56k":false,"2NFo3ZPMYMEe8W1ri7UD5AipdV8YfVGydYB":false,"2N1Bd8YCSrSbHSZsbf5o3V3FrniZDwnQ8gw":false,"2N8Mqj5ncuQGWEqzFp3muozALZVnt2qMbtR":false,"2MtZ5cVKWSPB3PdozB5mjrmA3hXXZzuhSQG":false,"2NDoKKEN54H3Zwwi1WDtLQ1pzC5VzGYSEKT":false,"2MtaDtk6MxnYcLgRk2Tx4DduJxSZMwoi8TP":false,"2MvpLKQqkeEnuU9EzASgd9Yg16AjAPzf8UV":false,"2Mz4VbaTkocnPkUt7CxPRXg9uYd8pSGJS5b":false,"2NAsJp3YXff1Ap77M9yBMuPfQAwe2sTfZzg":false,"2N4GYLo4Zbz6hfgN1zq8GFqTRqEkc4XJ7j9":false,"2NEA6FpdA3p4c5AsXVSwLdTZabQQgpzoWwY":false,"2NAbA1nTMj8ENVs3wTi8QoQseuarXVhMke3":false,"2MwrTMp2LXzCcJwKRvxAa3wdBNu6igdWSjz":false,"2MzdrYY7sGc1gZkZwd6oKX6UExwX6UgVUCV":false,"2MxqZAjk7UHqfgkEpHhkHhWpXHBjF9BQGpa":false,"2MyV6XHikXbJuGvjQFLn8T2mW3s6BnZYALs":false,"2N9xxRKVjXdgGoeu1bpZn6BDBBkH1FY2co9":false,"2N2Y614L73mmGm5VpCCgb9zmbZZTRgvmj4b":false,"2MwEek5fYgMjLh5z4db66bs2odPmhKayiXY":false,"2MtT9XVV7JnMqZPTuRWmTZyKWrsFtxgWo9k":false,"2MwEJWJsRmrQbmuzZpQJ1zrj33CPF9DxDpL":false,"2N8a3JoEGX5LdnNofQPMV8ERKuVXdpuFgJc":false,"2NDHtfxJv3WMp3x6WqDihHkGH2qPGart3wo":false,"2N9zgD6ruwBvx711E1vdUhJwNW21UXdcjCD":false,"2N2UCaSW44EHyxjuxTKghiGSjLaTdq9hM9Y":false,"2N9zAgXDx2edhJBPSsr5BDHuxpjFg23k5m9":false,"2NALsVSqT1x2TtdcGTWckvkwrbRRjdKDUEf":false,"2MwmPqU3ukg8UyrsncEpTK5sLg3GcE7xqse":false,"2NFBMzd7JgdKZKbGBaH6ukD6ngMDULCWBKv":false,"2NDQa1rxk2RJ3ADTa53mhUp9RqeebFxNfAq":false,"2MxWz1b1ALgwZUYDGFZYqXSrTPxSZTTYoQP":false,"2Mwq3agY92JHqyqk8ScHtTdLJ6eYWDwNsaU":false,"2MzZ6rGbSXx28BWdWsEfgxQDyHEhK3FPDbP":false,"2MvJ93MF8q42nLUzep59v6sJRHca5Kz5Qxp":false,"2N1eYd4UzUHmGxpNqhudeB2GaPNQsAvEhVG":false,"2N48CwaTWgrKm8AkCGXHKyhCL1ttQFYtNNw":false,"2Mt9iBT4RafyvC2S1JV2BcSZRmYQjL9e3g6":false,"2MsrLJk9G84TsEJLXYTayPDM3keXJTFWohP":false,"2N9Q8GSUN14qRTwgromn3ddjrUaX7NQFwzg":false,"2NFY3ELk4XoVh6jWLmF647hMjcwyMVnbJMA":false,"2MvVw42sEYGL2YwyYhwDbtdZpdv4ErQnXTH":false,"2N2BLY9qoKVFDsynTdthzACLqZd4PfPbYKt":false,"2N4ETCE7UkrE48pGcpW8P3iWqsoZuvgw7HX":false,"2MstS3Yt5ehcEFxvELNeRhCdR4fRC7JWPmK":false,"2N7ewhV2ZXSwHZuaagMHdSvJjpvaNuQbfQD":false,"2NGJMGNeoocbNhurRw9EdWUqMYghC7EGaQA":false,"2Mz3GJ4eCk4Pzc53STigVKQKiwuRwf6W8CW":false,"2N6y5cWzLfLBBqxxGyMiykN9Ag3tCmy3yNv":false,"2N4jqmC9t3ua1Dq9V6AxLHu4oHfGtT59dUj":false,"2N1nsNGjv7NTR3rix4d8YLvpD3ohSeNFSZG":false,"2N2hrq76A891qLShomZ2JfD6F4GMopj8KpW":false,"2N7pcjatioAmK4PzKHDXcs5n9QN4wzkJedR":false,"2MtrmGAW78kfkzaVfy4fw7tfwi9xmcPJmjh":false,"2N4s867WeGgaQc1CAaTdLpaNjkr4h379Jbd":false,"2MwKvaKjUp8CNP2PhUP2J3CtSvk1SujxWQy":false}}',
			)
			.post(
				"/api/wallets/addresses",
				'{"addresses":["2NCZ7HVZE86KDFVPURBa7aCYmiDhKPc3Ens","2NBq3Vn72BZyyxutTXsMXZSw7L4KdtMvSgW","2N2LmgL5GkpMxsPsHdKBZwn5z1kdcnTxUJC","2NAHKx4tmvRNTg1xrKdF6zP7mUK3iNejy8j","2MzW7F5mD34y8HNF49moav5NWV7oK8YV74k","2N5q4SwWPKySiES5CFzEkJjC4yfNL9ssdMx","2N58QRKdorCPYFrq89ev2eQEQgxmrWgQSVA","2NCex7e3mX8jEixQtED8Dbrk24zX8SmwQB8","2MxHaUUAMW47VeTYnRURG6MDWR2BWYhzsRp","2Mw7PXB737kvUb2gQZkHPEobsekBc1zJS4J","2MyghR9Pq8JPsn54resXvu7jEtfCKQGYk7q","2N5HsjNhNr9YMeg7mMR1AxkCPtQ1KzUmosA","2NAnshE3gpGAnxiP8hdpSi1BwphPkFFQ2bo","2MzfLizkqBGfm7N8Xav7RmWjZKNMu8MD9Su","2N8MWAYtndoL43EmmRwWyApsrQi8gU24U1f","2N5wY9ktLgXgxSAqVnuBqGx7ieKDZ4WDbM8","2N8VbZChVA9aLFqb3MavbJohhWArYc36QSq","2N9xerR3EjSzdkFZujnvGZ63YJvncwbAhoT","2MurZKzr7oqvkpbby2D275fGpNEYkVZr5F1","2N2tBPEcafrhdQY8wA1FwD36zSVNxvFL7ui","2NEfjAxHZiU3fTCjaH5Fi1cM7Gv5xMRXx75","2MzoEgXFs5bLk98PGZAut9rWoPf5Vyig8f4","2N2RFDg8Gi1ykFAYKTcedPyawPk1MDRpLkg","2NFN8zUKEyiRMUgRB5xdWCffj5mdkuz2BiT","2N8berkJ8CFaYWFETUdCvsoQP5FSgqsh3JV","2N7QrPRT2tA8mmmz7vwit7p8NvQJR15GBwT","2Mzu3nyZmfFZST6fpjwPPiYdUPYsmH25LL3","2Mwg2Ex24RaE3oUqQq1cQWvmSwaXvrn3DYg","2NCNM6FyrUz74gQQehtAJNAMhNhZgiyeTV1","2MzSYKRb1H7PozDXokyKC8oEX62QpurhgTo","2Mv5VQMZzRS7Eg43sehSSTK24WzkGrMkVPD","2N71QdMU5FWFguEA3DkDGGPiGwYYDSRmaCC","2N7pF8uuYV7n2U7XRSvr559Wq5FafFCzjqb","2N5g4Ymod4uT4D7Z5tWA5aAWiFRVosCb6qE","2N8gH2ufS2JgYeJZoo5u6nQkmNV7btWqwrS","2N85gm9yXck7ULnFYPVi5VBgcGDo9G1fiQm","2Mv3GFvVHEpNzc2cCcCcD8sBNDZrG7pUE6V","2N9MuyrpQF568gtjEcE5T96c4cP52V2Jzgb","2N7gEXhoXHuLsCZVp5rczrm2zK1S7V6HHc8","2N5PwikEmQCEJevVm8ac7d18c2f3BbHf8RP","2NBYkKHQDUb43KeR9UPwbPChe5W3u3wcm6y","2N9hurkMm9L5xLyXM6BfsgyuAmtLcaYfPB3","2N8aQZssrGrQpPAt5FN9XvYCQHpdDtHK5P5","2Mv6SnrfXEdbhkyCUJ2zS4mgRSwGLDhEGo3","2MsK6TA9ZPbuzcmWug7T3s1gBnwGu58DFs3","2MwXQCNYbKeiS47AYMGKAqKvfTyowdDLAAr","2N1GySTQwjyLVQxrjyRWd655ATM8Fs1niUa","2N69RLhne4hGy9LPQm1iJENAykM32wHJKRs","2N1WmJpQsWgmfuzGQ2zJAS3tA2Q9PwYrgar","2MyEEXh7e15atpu5bzZvUD1zY7XjcymrzEu","2Mtq6J2mM71MitnxY27jNAmnd2grfjZg5eo","2NBtgZf7FKu4pKxRqoapHrpQ1tRNupgQ9ym","2N5smkejWpBvUNUNScqNZ18MsdW6dDGPPAs","2NFhddTvwbFpPZrkpcMTmXf8cMcszny1AJk","2MuEjytuhTwwyMapvwCN1Cmw395EVrCyzsp","2MxGM3mR1wnzoDVDY7AyXAfGCasrFz5pZMb","2MvBuHNgsv6AkDWJqvN9TtJmSUEALU5SL9P","2N1w26a3DCwUiisn5J2E9gDWaXzsTQd5qgE","2NEEiLV5yCDetR3sfJrTvses6YkawEzuTqQ","2Mw8qSA3fhMdGbj5p62oUMjVwLtTVmb9Rn8","2MxrdgDwDNL2kzpjbkiRtMFxjuRsCU9sSNj","2Mzyg9FLTuyVZBMazJe4EudbW3LRwsr36ea","2MxmfYqh6aCszC9gPMVf9GKsTtxbT3AHzvb","2MzKT1UurBuMzxeGLZM8bgRF7vRvgFeWhEq","2MxzJdkUe4cBctTagugkQUe5qfoFQwvWHSj","2N2ng3BXbFvbqBLHy5V5jJGouEYFEM3Dd7D","2N9m2ABhSz6dvNrweigZqfJ2AxiqhavShBk","2NFXpB7aXHngWt9A6HcjgAnZZpQvdnRPBMy","2NB7Gg8QK8gLoZE5D4qtCPKVmZHzQEnj3MQ","2NB9BAJ3g51ANyH15WLHEQ8gHJoizagPC39","2N3dcpqM1atb9m9Vj2Gkk29ir6uGbEHFqTn","2N5nPH2zs5aGADSiLR2DDpD6NQFQZmbKrqT","2MsUrHe17VtL3BwQys2rfwKyJTAybwfkoF9","2Mvp5tSD3DqA4FfihRBA7UitzK26no7w68M","2N8EH8zTBwox5xqLDLJZmVDqb1776yPucvZ","2NAsfM2WLozSLWx2nbvWKxPZeA1VXJ9Lamj","2NEG8BcW1CdXLQSM362uCJzRY4UstW813Dk","2N3mMiZ5zSaCEvFCTH46isTUG6FtNv1y8k1","2NFQEaCzb6PdSnZu15oFy4Wa3HZH1fPu6FT","2N1UnjtqaAiJxQ8BshwdNEzDZHc8NguUj2k","2N45keLAoxpNj29oZG9GpZ3mwMHNbw2rAyc","2MwRnQ5h32sTaE2NUuXbhGnrGbGuFa1vHy5","2N71ytX1P56qYi7hCPomfXSCYxPr82GfMn9","2NA8kBXTZ63vvmRV45hiec3J6obXE4MQWYL","2MwcKJLiDPMaxJxvwpezNFWJ2aw5cjATDus","2NDnpvdvsx9k1FxZpYU5dk6QTfpiLVJLSzG","2NEtYiZFfNGKQtpKkDA23uDpjR7B73CEVbj","2N5ERfxJHFF1SNZ56vmbzw2Ldspwm3KMKK9","2NDWFm9vtRehHmXhFaMcqrMvkdoUAhQwpbB","2N2thCcBvLEyVa7N8dsR3xXW9xMPqmfKAjx","2NA2uCpKkSYuC9ycSFc7uNmDio3fMh9DsSK","2N8u1PX9S5FimoeCEvQgFdtEEV2kRFamdJi","2NATtNcURPuzFvxxfkPsezmVYFWVa5osNDz","2N68EGCSvTwZs2zMRTde5oAoVWaF5RkaF5T","2MzCafgec6eV9hDNkaMsuGtD1FfbMBbAL2x","2N7PoLSqzCCZmkq7Cj7H2gc94XZMxth9kch","2N1h3cfRVB2aChb6wvtjN8n4KijZnm2YcgZ","2N4kcChZsHza4nzthTG77K5t9VChyAobwAq","2NFeeaekausEiUVvTuntts5HfrjzSgCzDbJ","2NDwnfXLLAk1GLpzCbcHE6novqySTAxHbgu"]}',
			)
			.reply(
				200,
				'{"data":{"2NCZ7HVZE86KDFVPURBa7aCYmiDhKPc3Ens":false,"2NBq3Vn72BZyyxutTXsMXZSw7L4KdtMvSgW":false,"2N2LmgL5GkpMxsPsHdKBZwn5z1kdcnTxUJC":false,"2NAHKx4tmvRNTg1xrKdF6zP7mUK3iNejy8j":false,"2MzW7F5mD34y8HNF49moav5NWV7oK8YV74k":false,"2N5q4SwWPKySiES5CFzEkJjC4yfNL9ssdMx":false,"2N58QRKdorCPYFrq89ev2eQEQgxmrWgQSVA":false,"2NCex7e3mX8jEixQtED8Dbrk24zX8SmwQB8":false,"2MxHaUUAMW47VeTYnRURG6MDWR2BWYhzsRp":false,"2Mw7PXB737kvUb2gQZkHPEobsekBc1zJS4J":false,"2MyghR9Pq8JPsn54resXvu7jEtfCKQGYk7q":false,"2N5HsjNhNr9YMeg7mMR1AxkCPtQ1KzUmosA":false,"2NAnshE3gpGAnxiP8hdpSi1BwphPkFFQ2bo":false,"2MzfLizkqBGfm7N8Xav7RmWjZKNMu8MD9Su":false,"2N8MWAYtndoL43EmmRwWyApsrQi8gU24U1f":false,"2N5wY9ktLgXgxSAqVnuBqGx7ieKDZ4WDbM8":false,"2N8VbZChVA9aLFqb3MavbJohhWArYc36QSq":false,"2N9xerR3EjSzdkFZujnvGZ63YJvncwbAhoT":false,"2MurZKzr7oqvkpbby2D275fGpNEYkVZr5F1":false,"2N2tBPEcafrhdQY8wA1FwD36zSVNxvFL7ui":false,"2NEfjAxHZiU3fTCjaH5Fi1cM7Gv5xMRXx75":false,"2MzoEgXFs5bLk98PGZAut9rWoPf5Vyig8f4":false,"2N2RFDg8Gi1ykFAYKTcedPyawPk1MDRpLkg":false,"2NFN8zUKEyiRMUgRB5xdWCffj5mdkuz2BiT":false,"2N8berkJ8CFaYWFETUdCvsoQP5FSgqsh3JV":false,"2N7QrPRT2tA8mmmz7vwit7p8NvQJR15GBwT":false,"2Mzu3nyZmfFZST6fpjwPPiYdUPYsmH25LL3":false,"2Mwg2Ex24RaE3oUqQq1cQWvmSwaXvrn3DYg":false,"2NCNM6FyrUz74gQQehtAJNAMhNhZgiyeTV1":false,"2MzSYKRb1H7PozDXokyKC8oEX62QpurhgTo":false,"2Mv5VQMZzRS7Eg43sehSSTK24WzkGrMkVPD":false,"2N71QdMU5FWFguEA3DkDGGPiGwYYDSRmaCC":false,"2N7pF8uuYV7n2U7XRSvr559Wq5FafFCzjqb":false,"2N5g4Ymod4uT4D7Z5tWA5aAWiFRVosCb6qE":false,"2N8gH2ufS2JgYeJZoo5u6nQkmNV7btWqwrS":false,"2N85gm9yXck7ULnFYPVi5VBgcGDo9G1fiQm":false,"2Mv3GFvVHEpNzc2cCcCcD8sBNDZrG7pUE6V":false,"2N9MuyrpQF568gtjEcE5T96c4cP52V2Jzgb":false,"2N7gEXhoXHuLsCZVp5rczrm2zK1S7V6HHc8":false,"2N5PwikEmQCEJevVm8ac7d18c2f3BbHf8RP":false,"2NBYkKHQDUb43KeR9UPwbPChe5W3u3wcm6y":false,"2N9hurkMm9L5xLyXM6BfsgyuAmtLcaYfPB3":false,"2N8aQZssrGrQpPAt5FN9XvYCQHpdDtHK5P5":false,"2Mv6SnrfXEdbhkyCUJ2zS4mgRSwGLDhEGo3":false,"2MsK6TA9ZPbuzcmWug7T3s1gBnwGu58DFs3":false,"2MwXQCNYbKeiS47AYMGKAqKvfTyowdDLAAr":false,"2N1GySTQwjyLVQxrjyRWd655ATM8Fs1niUa":false,"2N69RLhne4hGy9LPQm1iJENAykM32wHJKRs":false,"2N1WmJpQsWgmfuzGQ2zJAS3tA2Q9PwYrgar":false,"2MyEEXh7e15atpu5bzZvUD1zY7XjcymrzEu":false,"2Mtq6J2mM71MitnxY27jNAmnd2grfjZg5eo":false,"2NBtgZf7FKu4pKxRqoapHrpQ1tRNupgQ9ym":false,"2N5smkejWpBvUNUNScqNZ18MsdW6dDGPPAs":false,"2NFhddTvwbFpPZrkpcMTmXf8cMcszny1AJk":false,"2MuEjytuhTwwyMapvwCN1Cmw395EVrCyzsp":false,"2MxGM3mR1wnzoDVDY7AyXAfGCasrFz5pZMb":false,"2MvBuHNgsv6AkDWJqvN9TtJmSUEALU5SL9P":false,"2N1w26a3DCwUiisn5J2E9gDWaXzsTQd5qgE":false,"2NEEiLV5yCDetR3sfJrTvses6YkawEzuTqQ":false,"2Mw8qSA3fhMdGbj5p62oUMjVwLtTVmb9Rn8":false,"2MxrdgDwDNL2kzpjbkiRtMFxjuRsCU9sSNj":false,"2Mzyg9FLTuyVZBMazJe4EudbW3LRwsr36ea":false,"2MxmfYqh6aCszC9gPMVf9GKsTtxbT3AHzvb":false,"2MzKT1UurBuMzxeGLZM8bgRF7vRvgFeWhEq":false,"2MxzJdkUe4cBctTagugkQUe5qfoFQwvWHSj":false,"2N2ng3BXbFvbqBLHy5V5jJGouEYFEM3Dd7D":false,"2N9m2ABhSz6dvNrweigZqfJ2AxiqhavShBk":false,"2NFXpB7aXHngWt9A6HcjgAnZZpQvdnRPBMy":false,"2NB7Gg8QK8gLoZE5D4qtCPKVmZHzQEnj3MQ":false,"2NB9BAJ3g51ANyH15WLHEQ8gHJoizagPC39":false,"2N3dcpqM1atb9m9Vj2Gkk29ir6uGbEHFqTn":false,"2N5nPH2zs5aGADSiLR2DDpD6NQFQZmbKrqT":false,"2MsUrHe17VtL3BwQys2rfwKyJTAybwfkoF9":false,"2Mvp5tSD3DqA4FfihRBA7UitzK26no7w68M":false,"2N8EH8zTBwox5xqLDLJZmVDqb1776yPucvZ":false,"2NAsfM2WLozSLWx2nbvWKxPZeA1VXJ9Lamj":false,"2NEG8BcW1CdXLQSM362uCJzRY4UstW813Dk":false,"2N3mMiZ5zSaCEvFCTH46isTUG6FtNv1y8k1":false,"2NFQEaCzb6PdSnZu15oFy4Wa3HZH1fPu6FT":false,"2N1UnjtqaAiJxQ8BshwdNEzDZHc8NguUj2k":false,"2N45keLAoxpNj29oZG9GpZ3mwMHNbw2rAyc":false,"2MwRnQ5h32sTaE2NUuXbhGnrGbGuFa1vHy5":false,"2N71ytX1P56qYi7hCPomfXSCYxPr82GfMn9":false,"2NA8kBXTZ63vvmRV45hiec3J6obXE4MQWYL":false,"2MwcKJLiDPMaxJxvwpezNFWJ2aw5cjATDus":false,"2NDnpvdvsx9k1FxZpYU5dk6QTfpiLVJLSzG":false,"2NEtYiZFfNGKQtpKkDA23uDpjR7B73CEVbj":false,"2N5ERfxJHFF1SNZ56vmbzw2Ldspwm3KMKK9":false,"2NDWFm9vtRehHmXhFaMcqrMvkdoUAhQwpbB":false,"2N2thCcBvLEyVa7N8dsR3xXW9xMPqmfKAjx":false,"2NA2uCpKkSYuC9ycSFc7uNmDio3fMh9DsSK":false,"2N8u1PX9S5FimoeCEvQgFdtEEV2kRFamdJi":false,"2NATtNcURPuzFvxxfkPsezmVYFWVa5osNDz":false,"2N68EGCSvTwZs2zMRTde5oAoVWaF5RkaF5T":false,"2MzCafgec6eV9hDNkaMsuGtD1FfbMBbAL2x":false,"2N7PoLSqzCCZmkq7Cj7H2gc94XZMxth9kch":false,"2N1h3cfRVB2aChb6wvtjN8n4KijZnm2YcgZ":false,"2N4kcChZsHza4nzthTG77K5t9VChyAobwAq":false,"2NFeeaekausEiUVvTuntts5HfrjzSgCzDbJ":false,"2NDwnfXLLAk1GLpzCbcHE6novqySTAxHbgu":false}}',
			)
			.post(
				"/api/wallets/transactions/unspent",
				'{"addresses":["2N789HT3aXABch6TqknX2TCekPEUGLMfurn","2N6PNXPhGCbuSH2vbKBAw3yV6Shx9xhVmdT","2MyHRvRGabh3rLgKTxm9w6ACwiismanVYcB"]}',
			)
			.reply(
				200,
				'{"data":[{"address":"2MyHRvRGabh3rLgKTxm9w6ACwiismanVYcB","txId":"a83039456f422ffc901e5d90315092fc12ff2f29b9be5c0b82c053b80c3ef2aa","outputIndex":0,"script":"a914423b8c503dfb7307e75c8c11705e34e8fd95301b87","satoshis":1000000},{"address":"2N6PNXPhGCbuSH2vbKBAw3yV6Shx9xhVmdT","txId":"14bb019ede5cb6905dd66dbc439a4e2c3efd3db074b917a1ed49c3c8fcdea4b7","outputIndex":0,"script":"a914902416b2e65a859146788006b9ade2907d13d52187","satoshis":1000000},{"address":"2N789HT3aXABch6TqknX2TCekPEUGLMfurn","txId":"bca46b2625258e4f9e3c4c6efcbe0ec352be31cc0bb3ab2132323fa1ff686744","outputIndex":0,"script":"a914983aec29890d89c391f99a680e577a6449c6bc1287","satoshis":1000000}],"links":{"first":"https:\\/\\/btc-test.payvo.com\\/api\\/wallets\\/transactions\\/unspent?page=1","last":"https:\\/\\/btc-test.payvo.com\\/api\\/wallets\\/transactions\\/unspent?page=1","prev":null,"next":null},"meta":{"current_page":1,"from":1,"last_page":1,"links":[{"url":null,"label":"&laquo; Previous","active":false},{"url":"https:\\/\\/btc-test.payvo.com\\/api\\/wallets\\/transactions\\/unspent?page=1","label":"1","active":true},{"url":null,"label":"Next &raquo;","active":false}],"path":"https:\\/\\/btc-test.payvo.com\\/api\\/wallets\\/transactions\\/unspent","per_page":15,"to":3,"total":3}}',
			)
			.post(
				"/api/wallets/transactions/raw",
				'{"transaction_ids":["a83039456f422ffc901e5d90315092fc12ff2f29b9be5c0b82c053b80c3ef2aa","14bb019ede5cb6905dd66dbc439a4e2c3efd3db074b917a1ed49c3c8fcdea4b7","bca46b2625258e4f9e3c4c6efcbe0ec352be31cc0bb3ab2132323fa1ff686744"]}',
			)
			.reply(
				200,
				'{"data":{"a83039456f422ffc901e5d90315092fc12ff2f29b9be5c0b82c053b80c3ef2aa":"01000000000101cca6aa63103c12b5ff497f09bd26ab961f47eb3f4915f6fc642a66331bda7b9f0100000000f0ffffff0340420f000000000017a914423b8c503dfb7307e75c8c11705e34e8fd95301b8783362000000000001600149d53915415905ad17559c38dbd2bc3249daebff40000000000000000196a1768747470733a2f2f746274632e6269746170732e636f6d02483045022100aada0a8285081c24d2b0baa29a72c5b5459fc0541fe67da026dd1487345e10cf0220284cb85fbc9b428fc67857ffa5516a611dc2a28ad5eb2ebdbdf2ac995fbcbb8f01210312ad7bb0a18773e9ee7f0564ed1d0bb3972c93859af8c3a0a85d641bde8c617300000000","14bb019ede5cb6905dd66dbc439a4e2c3efd3db074b917a1ed49c3c8fcdea4b7":"01000000000101c4b7d50951c0b86aad444b16b29614a0f670f4ce668a6e8f3350f7430bf2040d0100000000f0ffffff0340420f000000000017a914902416b2e65a859146788006b9ade2907d13d521876976210000000000160014c96573cf0ce7bbc4ca6ed3cc18473e518fb064cb0000000000000000196a1768747470733a2f2f746274632e6269746170732e636f6d02483045022100d694c4c6cf8e0fe2c5167e1afe678c5cd6bd21523c9eac60fc1e142fd6ad4339022060ec6b22a3e63c2e304573fee65d442cf4bc54b3928a2b6478590652dd93b30401210273517c2fe055a0599a675b944648f3f374fb00671aafbddab44167e4160c6e2f00000000","bca46b2625258e4f9e3c4c6efcbe0ec352be31cc0bb3ab2132323fa1ff686744":"010000000001010b9e58235a6e17f8477fe8f5997562437f9ac5b9373a3e002af6ad34d5e4fa440100000000f0ffffff0340420f000000000017a914983aec29890d89c391f99a680e577a6449c6bc128757ee240000000000160014e000c454f7d2063d607ea6c7d26468014412a4bf0000000000000000196a1768747470733a2f2f746274632e6269746170732e636f6d02483045022100be12416e311ff604503520218e9bdffe88e7e34d7e12d1613fb4eb66bc3bc69302201aeb426d81dfe64b61a126ffd9821aa58f532968e1e5033301de9c947241240f012103374079bc604a31173d21ae2b7b8a694d07293ea66e0c2a8863aad83a9c420dcb00000000"}}',
			)
			.get("/api/fees")
			.reply(200, {
				data: {
					min: 0.00001074,
					avg: 0.00001,
					max: 0.00180617,
				},
			})
			.persist();
	});

	it("should generate and sign a transfer transaction", async (context) => {
		const signatory = new Signatories.Signatory(
			new Signatories.MnemonicSignatory({
				signingKey: mnemonic,
				address: "address",
				publicKey: "publicKey",
				privateKey: "privateKey",
				options: {
					bip49: {
						account: 0,
					},
				},
			}),
		);

		const result = await context.subject.transfer({
			data: {
				amount: 0.001,
				to: "tb1q705a7ak4ejlmfc5uq3afg2q45v4yw7kyv8jgsn",
			},
			signatory,
		});

		assert.is(result.id(), "e0d736fd2f5774b7499fc557d22e6f99303b8b592d32481206f99d54de5df5de");
		assert.is(result.sender(), "2N789HT3aXABch6TqknX2TCekPEUGLMfurn");
		assert.is(result.recipient(), "tb1q705a7ak4ejlmfc5uq3afg2q45v4yw7kyv8jgsn");
		assert.is(result.amount().toNumber(), 100_000);
		assert.is(result.fee().toNumber(), 165_000);
		assert.instance(result.timestamp(), DateTime);
		assert.is(
			result.toBroadcast(),
			"02000000000101aaf23e0cb853c0820b5cbeb9292fff12fc925031905d1e90fc2f426f453930a80000000017160014ad5d241c585fd25d3271875af67a077ba4cf7324ffffffff02a086010000000000160014f3e9df76d5ccbfb4e29c047a942815a32a477ac418370b000000000017a914d3cc481599f154c8cf7f9111681f7da53e54cd4b8702483045022100f10c644094fec83dba98f5ea346e5df441f76ba2250edbe1fe8d19646edb4e1d0220675e13b257c973902f8289692a3f7ef661f3610a1867aa8505b3d7538ad8dc74012103987e47d69f9980f32363e40f50224fba7e22482459dc34d75e6f2353e9465d7600000000",
		);
	});
});

describe("BIP84 wallet", ({ afterEach, beforeEach, it, nock, assert }) => {
	beforeEach(async (context) => {
		await createLocalServices(context);

		nock.fake("https://btc-test.payvo.com:443", { encodedQueryParams: true })
			.post(
				"/api/wallets/addresses",
				'{"addresses":["tb1q705a7ak4ejlmfc5uq3afg2q45v4yw7kyv8jgsn","tb1qnyupre6mtmhzguffsucrz40sy2katy8vkt8zfu","tb1q4hel24zseq8xkdeq6vha54n6384kgeu95hyyv3","tb1q8g0j9eqtntqnh3tvsfvw74j546td7c5996wyn6","tb1qzu6m9fkjut4lazp3r0ng8vffckzjtw09yuynwr","tb1q5szhk63gy5kcjss5k9lczuvrrdkj0s47ys5d7n","tb1qft4e63naynzfv6cuq8fmzqw6vm5h0826y975zq","tb1qwm4e2thywjze204pyy3dl4q7367jl7dx5gemys","tb1qg83jwmwz30gkgxye58t98tkdplseurgjt3w8ef","tb1qvtu2n0wf4k2wxw347l9jyqcv3m3f9g2afz8jxd","tb1qjc3d58wx2k534xwhpxn7rn9ztfztvxpf47rtzr","tb1qn5yntgep5vwyvgaqpuadywnykaeahmujydhs0y","tb1qc3wayhruahwwu98j9pmqdv7zsktm78n79ekgz3","tb1q2qkcmydj76kcpf7k9mugmjufts5x7756gp6ktx","tb1q3vemskd4app577n47yrnrsz62zv6anz45r8j5m","tb1q8yyhk6ujynw32d6vg2xgdnln4c5t9k0vesuvrw","tb1q7mhg4pfudy02eegcjwnzey237sveggtdfldgh7","tb1qnq8teyxjvl856zlzd0grggt3r8j57q3yglmmm8","tb1q287042u5t4jxlwu0pjdal2ewnzm0k3urf595y0","tb1qrmem58ypay69y29lh4pfk3d5r4hsl3a4kgd7cd","tb1qpwum56tqxj3gs269f7tcy7sawrc2gs8ry8fpk4","tb1q5dk3crwgmqachcpdrl0d0hfs3ufu464nmkndvj","tb1q0247au5mcn8qf862z2c8aejjfxzwsu2m9gehlu","tb1qr095h3mc7zkkypx8y6fhtjmv0e7dl4nst9lcxv","tb1qlhkvctujxxfyxldvqsurqhxn854vqv7we2uqlu","tb1qzdvs64mt38t8nxrvwczt3wphfclkdgwhysmejk","tb1q5rrec57glqjq40l6uncswrkxg6yw23vdcr9mlz","tb1qafpwdv45cj3wuc2y0dz737rjagdx0vxu5rnmyv","tb1qtw845dktyuh9em4g6spf60l73kcazfa8tscxvm","tb1qzglhldv20xlwu9y9zc8ra0785nvrg0fljmzqlt","tb1q6srmkcmqjup2a6kelks7d8erlqqecz6uspwecw","tb1qgy49nf8tevqptsvzke4ld0w3aa73r7he6h77d6","tb1qthjufnk4k80mpzcj2ylmh87dkw5rzfvmfq4752","tb1q7aaapr73fzlyvt7350k2wy5kmnr9cgwedfejc3","tb1q2k29k05gtyukjnhmy2d3x07gg50rruz7xk2uwu","tb1qd63u72htfuazgdg2y95g93tytvjszt9882hhjd","tb1qfj2nxcu3gqtny9rftryxrcmr7yzgqejlpnl2sy","tb1qq3etva0ycdkvxln8q5uw836ccjmp28r6c0d2ws","tb1qtdmpktudjn6h22rp50pz8wqnp8pjc5582w6zuq","tb1qvnqkjml2td327hrwkc2p2ktxca5wfas8sx7rmm","tb1qtz6023w334akvfdp6mke7wu68f5mfdtuwwvp0w","tb1qka7lmpa08fryucx6jkwmjagu0u5ht99nqevz5g","tb1qxduwknmu3epxqtvptcxmg8dm7calf4rmeah0ce","tb1qxv4as5np4hswyzlgcm8jjg8sd7yhda2rvy4wv7","tb1qlfee29rd4r8pyq69mqwm8dx6ym5jgcfaj8yvlv","tb1qhak9pdn00lrctrjg43zkwk9gcmfwyh7ctru2lt","tb1q3ady3drv05qgex0ckldlmr7jua4mzh7g8ywpua","tb1qsaj63xdqla8tfydk7yufyk4qpg33xke9t0kpna","tb1q6prya27nf3aku6le939n3trvq9hm9vvggw3q29","tb1q9n8nzxv5pt64h3x20sdmngppd6smrczps8s8r5","tb1qvrgkjra3kzm6mzgddptzp8h6r2fv2nyu38qy36","tb1qjgkjr0wracp8hc3yl8w24eg7amktf3hlj05hcp","tb1qmah2zdm3eu6nlq2383h99sv08yux8qkmxc6qpc","tb1qc4nwmq367a48jmzvnfav6vme5nyxntyg5dkakk","tb1qtmhm86se75j2el84gdurz209v72g5w23c43u0m","tb1qwp8fupq52ez6z9gpzg4rg7rr46c5s4qjx59xq6","tb1qgtuhutm6msxq9rvd5k0uj7vet8rxc5l0sqxfut","tb1q205nkwd23h6j8mkagvvezl3av56gu3k08zm3rf","tb1qvgpjkryzkdc5r9clsqln32c6s0980cjs6p7csz","tb1qh0dsjewn3yn4v6s88k6ksvpfv0nuytwucvqf7j","tb1q4fsuxvf9se3x0yu9hkys7unmht82fxyyyqju36","tb1qc3cqsgyp6d5p00a777lruchlkqh294wy308hyw","tb1qyus7f3ef0wle99fu73tu3a52chz0y6m5td6vhk","tb1qnddsnsj5n3zgl6uy4kp9rgzpynfgy3gres6zt4","tb1qhvq9jdvt5nrf5hxhqgsa95227ty7g6wjk2lnv5","tb1q0p2tt0t7tz6nrekg2rt7y0dmn2yhkp7nclak6v","tb1q8nd8uaqlc83y3d3m2sm8qfpj23aegj8he88xrl","tb1qst0txydc5q9nkeyqv58346hrvtfxfquyw7dmsn","tb1qjyv67rdgfhav3cgzp3kun2qhr9jmajqhunce95","tb1q550t3wt8ddvytftfpvay0yywrjmjzkcsm6fuzd","tb1ql8r5596kq9hm4vzamvv9576zup6d7s2ccq3rg9","tb1q90jx45swj5f78wh5fg2jz7cexeppy7teanr4xv","tb1q0pp2647uekaj7ew3ymp07x684v838lgwh78swa","tb1qefgkdfdvwgzl9gctvudyuvxa8fd7rujuhg9pyl","tb1q8gxjp3yt7pr7h2yepw93pwasmfudv4ls3vff7t","tb1qga0xqgwndrvs87quycav3t520c3jn7s6pym5ek","tb1qszms32540n60kymp9542ar2r23y3df0q3j9zxp","tb1q23jkrgu0glt2ghdxlm233uy54jg97aegumxq9k","tb1qk6fxhqz592xe5ttqzdzdlxx8um0nmk3jtjz5uw","tb1qlvzq53sttx5556g02tmxjfr5647jspwnd7k33e","tb1q82n0h930vvewmnph9k7204re8g6k30x6cv5466","tb1qz5trkf0le9hmvvsclpl596e7c63v4at6e80sv5","tb1qk69dg527ykhtzg8zns6zhztasgzpxttn8gw9fe","tb1qmk780025qyjkm8ys8mv6mh6um6ddf55dc99yfy","tb1qg6p77jqp26y9qa35dxuhzl9ztf84ngd4wcqgxk","tb1qffgre788as3rs3nwdeu84d4j2nl790a846zdj7","tb1qfu5tdchmlmdhh7svjw6qs95p6net2kglvudqcr","tb1q924a4x6dqteaw0e4z62cvg9gqdsp7w2xpepww4","tb1qp0t256s06glsupjjf9znfg5v0k7aeuwtxhh99t","tb1qr05syarj38wxjdn65y0mdm0kyp82dpl6zdw7cl","tb1qzzknzfxatdhjus66fnd7pl4gpclv0r7ljju7kk","tb1q7hjfm7503vl9vkx9nell34du0tulstf0dh0ch8","tb1q7hjujwr6hpd90rw7w2ctf0ldtehgehjy6rxt25","tb1qeqllgy73sv6wh5fexdyvnjzrhv6mvnucatarjz","tb1qjwxn45a8mluhevzyvtavyp486k9mg7qh3777px","tb1qhvgr6va55xhqdg6sjwqn43j5vpt872nvp3asxn","tb1qfmzsm7ttqfmzw6um7vq3ndf6w2q8u2n9tj8lcw","tb1qnz6zh6j9uuxkfslr6qc3x8xau9djz8a438xhe2","tb1qmw2p34lzdp8cwyhqdjyj3qd232yymlyx0vcjqp","tb1qxxp206q44rkljappkdtp5zq8ed55ekax97zauh"]}',
			)
			.reply(
				200,
				'{"data":{"tb1q705a7ak4ejlmfc5uq3afg2q45v4yw7kyv8jgsn":true,"tb1qnyupre6mtmhzguffsucrz40sy2katy8vkt8zfu":true,"tb1q4hel24zseq8xkdeq6vha54n6384kgeu95hyyv3":false,"tb1q8g0j9eqtntqnh3tvsfvw74j546td7c5996wyn6":true,"tb1qzu6m9fkjut4lazp3r0ng8vffckzjtw09yuynwr":false,"tb1q5szhk63gy5kcjss5k9lczuvrrdkj0s47ys5d7n":false,"tb1qft4e63naynzfv6cuq8fmzqw6vm5h0826y975zq":false,"tb1qwm4e2thywjze204pyy3dl4q7367jl7dx5gemys":false,"tb1qg83jwmwz30gkgxye58t98tkdplseurgjt3w8ef":false,"tb1qvtu2n0wf4k2wxw347l9jyqcv3m3f9g2afz8jxd":false,"tb1qjc3d58wx2k534xwhpxn7rn9ztfztvxpf47rtzr":false,"tb1qn5yntgep5vwyvgaqpuadywnykaeahmujydhs0y":false,"tb1qc3wayhruahwwu98j9pmqdv7zsktm78n79ekgz3":false,"tb1q2qkcmydj76kcpf7k9mugmjufts5x7756gp6ktx":false,"tb1q3vemskd4app577n47yrnrsz62zv6anz45r8j5m":false,"tb1q8yyhk6ujynw32d6vg2xgdnln4c5t9k0vesuvrw":false,"tb1q7mhg4pfudy02eegcjwnzey237sveggtdfldgh7":false,"tb1qnq8teyxjvl856zlzd0grggt3r8j57q3yglmmm8":false,"tb1q287042u5t4jxlwu0pjdal2ewnzm0k3urf595y0":false,"tb1qrmem58ypay69y29lh4pfk3d5r4hsl3a4kgd7cd":false,"tb1qpwum56tqxj3gs269f7tcy7sawrc2gs8ry8fpk4":false,"tb1q5dk3crwgmqachcpdrl0d0hfs3ufu464nmkndvj":false,"tb1q0247au5mcn8qf862z2c8aejjfxzwsu2m9gehlu":false,"tb1qr095h3mc7zkkypx8y6fhtjmv0e7dl4nst9lcxv":false,"tb1qlhkvctujxxfyxldvqsurqhxn854vqv7we2uqlu":false,"tb1qzdvs64mt38t8nxrvwczt3wphfclkdgwhysmejk":false,"tb1q5rrec57glqjq40l6uncswrkxg6yw23vdcr9mlz":false,"tb1qafpwdv45cj3wuc2y0dz737rjagdx0vxu5rnmyv":false,"tb1qtw845dktyuh9em4g6spf60l73kcazfa8tscxvm":false,"tb1qzglhldv20xlwu9y9zc8ra0785nvrg0fljmzqlt":false,"tb1q6srmkcmqjup2a6kelks7d8erlqqecz6uspwecw":false,"tb1qgy49nf8tevqptsvzke4ld0w3aa73r7he6h77d6":false,"tb1qthjufnk4k80mpzcj2ylmh87dkw5rzfvmfq4752":false,"tb1q7aaapr73fzlyvt7350k2wy5kmnr9cgwedfejc3":false,"tb1q2k29k05gtyukjnhmy2d3x07gg50rruz7xk2uwu":false,"tb1qd63u72htfuazgdg2y95g93tytvjszt9882hhjd":false,"tb1qfj2nxcu3gqtny9rftryxrcmr7yzgqejlpnl2sy":false,"tb1qq3etva0ycdkvxln8q5uw836ccjmp28r6c0d2ws":false,"tb1qtdmpktudjn6h22rp50pz8wqnp8pjc5582w6zuq":false,"tb1qvnqkjml2td327hrwkc2p2ktxca5wfas8sx7rmm":false,"tb1qtz6023w334akvfdp6mke7wu68f5mfdtuwwvp0w":false,"tb1qka7lmpa08fryucx6jkwmjagu0u5ht99nqevz5g":false,"tb1qxduwknmu3epxqtvptcxmg8dm7calf4rmeah0ce":false,"tb1qxv4as5np4hswyzlgcm8jjg8sd7yhda2rvy4wv7":false,"tb1qlfee29rd4r8pyq69mqwm8dx6ym5jgcfaj8yvlv":false,"tb1qhak9pdn00lrctrjg43zkwk9gcmfwyh7ctru2lt":false,"tb1q3ady3drv05qgex0ckldlmr7jua4mzh7g8ywpua":false,"tb1qsaj63xdqla8tfydk7yufyk4qpg33xke9t0kpna":false,"tb1q6prya27nf3aku6le939n3trvq9hm9vvggw3q29":false,"tb1q9n8nzxv5pt64h3x20sdmngppd6smrczps8s8r5":false,"tb1qvrgkjra3kzm6mzgddptzp8h6r2fv2nyu38qy36":false,"tb1qjgkjr0wracp8hc3yl8w24eg7amktf3hlj05hcp":false,"tb1qmah2zdm3eu6nlq2383h99sv08yux8qkmxc6qpc":false,"tb1qc4nwmq367a48jmzvnfav6vme5nyxntyg5dkakk":false,"tb1qtmhm86se75j2el84gdurz209v72g5w23c43u0m":false,"tb1qwp8fupq52ez6z9gpzg4rg7rr46c5s4qjx59xq6":false,"tb1qgtuhutm6msxq9rvd5k0uj7vet8rxc5l0sqxfut":false,"tb1q205nkwd23h6j8mkagvvezl3av56gu3k08zm3rf":false,"tb1qvgpjkryzkdc5r9clsqln32c6s0980cjs6p7csz":false,"tb1qh0dsjewn3yn4v6s88k6ksvpfv0nuytwucvqf7j":false,"tb1q4fsuxvf9se3x0yu9hkys7unmht82fxyyyqju36":false,"tb1qc3cqsgyp6d5p00a777lruchlkqh294wy308hyw":false,"tb1qyus7f3ef0wle99fu73tu3a52chz0y6m5td6vhk":false,"tb1qnddsnsj5n3zgl6uy4kp9rgzpynfgy3gres6zt4":false,"tb1qhvq9jdvt5nrf5hxhqgsa95227ty7g6wjk2lnv5":false,"tb1q0p2tt0t7tz6nrekg2rt7y0dmn2yhkp7nclak6v":false,"tb1q8nd8uaqlc83y3d3m2sm8qfpj23aegj8he88xrl":false,"tb1qst0txydc5q9nkeyqv58346hrvtfxfquyw7dmsn":false,"tb1qjyv67rdgfhav3cgzp3kun2qhr9jmajqhunce95":false,"tb1q550t3wt8ddvytftfpvay0yywrjmjzkcsm6fuzd":false,"tb1ql8r5596kq9hm4vzamvv9576zup6d7s2ccq3rg9":false,"tb1q90jx45swj5f78wh5fg2jz7cexeppy7teanr4xv":false,"tb1q0pp2647uekaj7ew3ymp07x684v838lgwh78swa":false,"tb1qefgkdfdvwgzl9gctvudyuvxa8fd7rujuhg9pyl":false,"tb1q8gxjp3yt7pr7h2yepw93pwasmfudv4ls3vff7t":false,"tb1qga0xqgwndrvs87quycav3t520c3jn7s6pym5ek":false,"tb1qszms32540n60kymp9542ar2r23y3df0q3j9zxp":false,"tb1q23jkrgu0glt2ghdxlm233uy54jg97aegumxq9k":false,"tb1qk6fxhqz592xe5ttqzdzdlxx8um0nmk3jtjz5uw":false,"tb1qlvzq53sttx5556g02tmxjfr5647jspwnd7k33e":false,"tb1q82n0h930vvewmnph9k7204re8g6k30x6cv5466":false,"tb1qz5trkf0le9hmvvsclpl596e7c63v4at6e80sv5":false,"tb1qk69dg527ykhtzg8zns6zhztasgzpxttn8gw9fe":false,"tb1qmk780025qyjkm8ys8mv6mh6um6ddf55dc99yfy":false,"tb1qg6p77jqp26y9qa35dxuhzl9ztf84ngd4wcqgxk":false,"tb1qffgre788as3rs3nwdeu84d4j2nl790a846zdj7":false,"tb1qfu5tdchmlmdhh7svjw6qs95p6net2kglvudqcr":false,"tb1q924a4x6dqteaw0e4z62cvg9gqdsp7w2xpepww4":false,"tb1qp0t256s06glsupjjf9znfg5v0k7aeuwtxhh99t":false,"tb1qr05syarj38wxjdn65y0mdm0kyp82dpl6zdw7cl":false,"tb1qzzknzfxatdhjus66fnd7pl4gpclv0r7ljju7kk":false,"tb1q7hjfm7503vl9vkx9nell34du0tulstf0dh0ch8":false,"tb1q7hjujwr6hpd90rw7w2ctf0ldtehgehjy6rxt25":false,"tb1qeqllgy73sv6wh5fexdyvnjzrhv6mvnucatarjz":false,"tb1qjwxn45a8mluhevzyvtavyp486k9mg7qh3777px":false,"tb1qhvgr6va55xhqdg6sjwqn43j5vpt872nvp3asxn":false,"tb1qfmzsm7ttqfmzw6um7vq3ndf6w2q8u2n9tj8lcw":false,"tb1qnz6zh6j9uuxkfslr6qc3x8xau9djz8a438xhe2":false,"tb1qmw2p34lzdp8cwyhqdjyj3qd232yymlyx0vcjqp":false,"tb1qxxp206q44rkljappkdtp5zq8ed55ekax97zauh":false}}',
			)
			.post(
				"/api/wallets/addresses",
				'{"addresses":["tb1qdggppphsk6fjz9uzyc03806th023du4k75pns8","tb1qh620ghv4prx8tk0k9g9q9mr4kwz6795u9a0eke","tb1qd3emae32a9kec0j62clpj2ssywppul87k8ck0u","tb1qjyqqt67cthz6xt43kjt4k0pt24nads6y53u57c","tb1q9vuljwpeenh65a06mfm3t3sccx467j0w3hejx9","tb1qqx4643eev7xkp82c39alpcfczcc75vzcjxym0s","tb1q2g2qdnwxjecdvsq3z8ycmz3uh4enpdhc03cfqc","tb1qk2vv5dakwkq7h0rqsukn4xe389kct0t9e6qclj","tb1q06lfdjzxyw3tp83a80qwlhxjnegmt0pj7auq95","tb1qhselk3ee0gp2r32xh49xxr7n3ljnmpy2rt9cde","tb1qegpu8x4uexsyty6xjjwjdunvgunvenjtetk5pa","tb1q8zyswkhelgad9m0kqk3kj4uf3zcrz5fzrl7a5c","tb1q8hhajvnm6mzt2ectk5ccx3kp28pykj2mncqx8f","tb1qgmt60ymavumqmcj69zcfznpjfjxsuvlrycv39k","tb1qhjd0rwlnee5kewd0wm0xl8n8pj7uvtwjnccrvw","tb1q6xquyat34fjkv4nc2r2amuq7kfueflh7yftucy","tb1q6h0zl6q2p5h8kh82387zjqpp50654qzprt8agr","tb1qgvsh9tlqsn6hfefwfcczee86kmk8h54w0eu9dg","tb1q6h8n9h392kgpgyrvn6vrm2qaxj3a7acpx7y82t","tb1q6esh8h7aepj45rmm4le5zalg243ul3nc77w450","tb1q64rj9xnz2p08vvfpd533nqhlgj8s2lkd22xf9u","tb1qex9z6nzrva0z3eqa9r5uqf6tc3f838genelral","tb1qp5hequyhtxmcat0s5tl6ytvtvn2xlejwu0q533","tb1q2tz73m2lqxsy7cgcxzf0eacadxulpjnusqynnm","tb1qet23glj4asrsxs9c5qvecz4c3nmwu2fn2dyg76","tb1qpql0rl9xssg2dyec6mkans4dc30qsryur80u5t","tb1qtrd8p7py89qxfekhadze4uw06sy3gnf9um4cep","tb1qa9sfzhwkx2k76yznefx0cv25ez28a9zwlfqgc3","tb1qeyxufvjz6qdam78zf40l5l84pjkrcrgqcp0nv7","tb1qqy7663rm2t9y8esjtpjgtds2ufcknwc60mz3n6","tb1qrdv75a8wcfrqnnak56f0uwn90j35yu8h5msv5h","tb1q7qumstk7t8fdw5zl0ye4nk24qqw5u4qntmd34x","tb1qwpnjhnudw4v5wue4c8q4l4detaqtzyfyvpg60m","tb1qte8vp2cek947a6xmuny72sfprxhe7mff8kgr8d","tb1q9nxmat6af5ldrrsfv9c06x2lvksag7hqz4nvxr","tb1q30f2kypq3gfyzursyj32aa2vq8lsr23xcj6h34","tb1qk77wm73sfds2fv4wheqx3wzu9j0xxccplpqse7","tb1qwrgwautleh6qlptjks83nc4888qtpjpvecuxxl","tb1qm4zlg80z245umu3ptxg7qc7rrpep97h27jy98e","tb1q03dzpyq75zq6rmtzzq9jwuyyzdn7yrfrq5p6k3","tb1qtd7rd06g9s9pzjhjxztjm2l3kzugrx46nhxxa0","tb1qyvpzl8kevsgvl96cqjdsr8mp823y7uc4q3x84l","tb1qdjs0l5hq8hzddmnp9e2q5l2tqw6h2w6t32xwg9","tb1q07yw2adq4m5qghdrs8l62y9w2temj4kr3qplhe","tb1qqft6qnfvyafap5n76ejjkmvet7enjpmzrfrujw","tb1q4s988w2xeapshf23xfk5r6xpm966dllu6ncmj9","tb1qaejqhwzppqrhja4r943mvhm6nc8wtdv88h4cjq","tb1q8z0fhpz9zg240jyyq3ydzp4emsv4ud3t85pcuw","tb1qttj3736ys5eeee96555ep3ng6x60uvpymv58jr","tb1q57tn30auaq60k8lsgeuthhfqvn23qfn80apzzk","tb1qpc9lgn8z8yxnttwxqhwsqm4v6x847u0xvdrant","tb1q3f00n24k0sj5v74uzgnr48vn2xh4wq787xcgw2","tb1quz7yrk5tdn08pdwgx03v0a5pnznsluj7mp322v","tb1qnkfxws75rhtcln5uqy3p2xnnuvxm9gyn86hlun","tb1q8zwdqr0vjavrzqjlhvetmff22xr62ftwp36k0a","tb1qmxclylwaeh78kngg6zwf90men7fgp837f5ghpl","tb1qhvjguqhe9urmugrja24k64kpmjuqgy3yc7gt40","tb1q8t44q5gevd43aa2nsgkuh6ppt4a7fjcay0paww","tb1qzqem7glkkwhrzw2ur6ju0azqlrxhhqq95dhcy6","tb1qzhxrm35vdkfz32dtah5qek8fw72fnz2s630k4y","tb1qnrk5fsylvu6hdcsgkvv02cpher5wcxxce6x45s","tb1q24ft7syv9x0ytj6vg26gqpjkrn3tfkfwcnxfzg","tb1q05kv9kg0zdsl8t0andchwqm7tq7ne7jmvvk4y8","tb1qc9y972kkwayh6dqgevhyncpacxlmd4e3x5hds3","tb1qnw0pg88ss8450zqqsdthvlqqx4vvssxz057fpp","tb1qeclgv3gcfdkulmderue9xkylx2rdjeefqz7za5","tb1q56j6sljfnuqjpsarp5zq9htx3wapmayuc52al4","tb1qm2ghhu2uth9vwajs6pkf5fvp3tclpm360lqj9e","tb1qnjqzhtr9rytgvjpc4t7zrwk24x08k05m5x2nld","tb1qx66uuvpd80pav4qj30yu9kz0xues87363d4jd0","tb1q5ezam3fzet4ytkw36zv3gcu57fztah2psns9vd","tb1qlul4m387pmj4r3y22jyxc40z53fw4356ya9vzu","tb1qgd3rd0nq6d0qgyv22mqm3rr4gz9zt46jpdw59f","tb1qnd9qpzcd0vxkrky5rmj8l79hlm9eutu92cxe64","tb1qx2642d4heaey8nd48c3dftdl0865uvx3074z6e","tb1qr8su2cdaxyqe4z30zlrrmy8nhct6uqdnl3hrr3","tb1qnxa6wupgdxz5nvh97u80vct2e5rc9csywwvsgr","tb1qrcfqatvx7m9n0z2pfx3ljkjspmlm73k9xnuqkx","tb1q2z6gtphhxy62aasm6v2n2slu25yj5f9vq6jrwm","tb1qns39633aurl2a6nvtqfef6z6x9c7vgwa3h0fr7","tb1qpw0pgq8f4zy75frwsrhw3zr9xhzq4f44kz4656","tb1q82rptdkp4xkh7ajw8l6aspu6u7hwweeclxjmfa","tb1q0kf6sr22rtlmgy5y8dj6202nv80ua7gl6zccpc","tb1qwryfq87zsdtg07xjycyr2xhwcwh6gr386e276s","tb1qxhj7wlw82el0dv8sg5csm63ryc7lhwv5l28e5m","tb1q6xhh3fnkn4t2ye953ma5g7jh40xts5tqm4nny7","tb1qhph8yvxz8r90yq5t6s3wr50jch6zuuw8gnreg3","tb1qey0e5cs5tm7hclc0r288eweq0tpwpn0458kc3x","tb1qgcfppyr45jks5xe6p3pljf7uf0kg65qn2v4tsj","tb1qmlslf93w87ulamwvwvgqfhtlue772k9emncxee","tb1q8dz8mr9wes6wqd43h3k2zy3y38rwl0jnunqrnd","tb1qqmeap0eqwdh7jtxpypp2twjwe94w96mrxqnj89","tb1qdwagxrejud386lhyz73wzd8meq9k9p6r2nkvu4","tb1q38uef9388sfhhd2gvplfn0fm99cpp0zxje0rps","tb1q7vd9ty2svwf7yu8tyl497eu0k23hnfneq7akdt","tb1qwq6zg7lky0w0uwjg9ucth9wl7vlpuge3d2yaf4","tb1qj4kev9lydakdwnrkx5whu8ga3phadpaey6hnx0","tb1q6dv007hmrfer7nqqpgzxyt2awr0j0r62twmh6p","tb1qfryty6ckzf7c6vlx3hu6mav4uky7x6mtwgtkmf","tb1qpzcu5svaghwrgl4u8peuk0xpt6377v24vjyqsu"]}',
			)
			.reply(
				200,
				'{"data":{"tb1qdggppphsk6fjz9uzyc03806th023du4k75pns8":false,"tb1qh620ghv4prx8tk0k9g9q9mr4kwz6795u9a0eke":false,"tb1qd3emae32a9kec0j62clpj2ssywppul87k8ck0u":false,"tb1qjyqqt67cthz6xt43kjt4k0pt24nads6y53u57c":false,"tb1q9vuljwpeenh65a06mfm3t3sccx467j0w3hejx9":false,"tb1qqx4643eev7xkp82c39alpcfczcc75vzcjxym0s":false,"tb1q2g2qdnwxjecdvsq3z8ycmz3uh4enpdhc03cfqc":false,"tb1qk2vv5dakwkq7h0rqsukn4xe389kct0t9e6qclj":false,"tb1q06lfdjzxyw3tp83a80qwlhxjnegmt0pj7auq95":false,"tb1qhselk3ee0gp2r32xh49xxr7n3ljnmpy2rt9cde":false,"tb1qegpu8x4uexsyty6xjjwjdunvgunvenjtetk5pa":false,"tb1q8zyswkhelgad9m0kqk3kj4uf3zcrz5fzrl7a5c":false,"tb1q8hhajvnm6mzt2ectk5ccx3kp28pykj2mncqx8f":false,"tb1qgmt60ymavumqmcj69zcfznpjfjxsuvlrycv39k":false,"tb1qhjd0rwlnee5kewd0wm0xl8n8pj7uvtwjnccrvw":false,"tb1q6xquyat34fjkv4nc2r2amuq7kfueflh7yftucy":false,"tb1q6h0zl6q2p5h8kh82387zjqpp50654qzprt8agr":false,"tb1qgvsh9tlqsn6hfefwfcczee86kmk8h54w0eu9dg":false,"tb1q6h8n9h392kgpgyrvn6vrm2qaxj3a7acpx7y82t":false,"tb1q6esh8h7aepj45rmm4le5zalg243ul3nc77w450":false,"tb1q64rj9xnz2p08vvfpd533nqhlgj8s2lkd22xf9u":false,"tb1qex9z6nzrva0z3eqa9r5uqf6tc3f838genelral":false,"tb1qp5hequyhtxmcat0s5tl6ytvtvn2xlejwu0q533":false,"tb1q2tz73m2lqxsy7cgcxzf0eacadxulpjnusqynnm":false,"tb1qet23glj4asrsxs9c5qvecz4c3nmwu2fn2dyg76":false,"tb1qpql0rl9xssg2dyec6mkans4dc30qsryur80u5t":false,"tb1qtrd8p7py89qxfekhadze4uw06sy3gnf9um4cep":false,"tb1qa9sfzhwkx2k76yznefx0cv25ez28a9zwlfqgc3":false,"tb1qeyxufvjz6qdam78zf40l5l84pjkrcrgqcp0nv7":false,"tb1qqy7663rm2t9y8esjtpjgtds2ufcknwc60mz3n6":false,"tb1qrdv75a8wcfrqnnak56f0uwn90j35yu8h5msv5h":false,"tb1q7qumstk7t8fdw5zl0ye4nk24qqw5u4qntmd34x":false,"tb1qwpnjhnudw4v5wue4c8q4l4detaqtzyfyvpg60m":false,"tb1qte8vp2cek947a6xmuny72sfprxhe7mff8kgr8d":false,"tb1q9nxmat6af5ldrrsfv9c06x2lvksag7hqz4nvxr":false,"tb1q30f2kypq3gfyzursyj32aa2vq8lsr23xcj6h34":false,"tb1qk77wm73sfds2fv4wheqx3wzu9j0xxccplpqse7":false,"tb1qwrgwautleh6qlptjks83nc4888qtpjpvecuxxl":false,"tb1qm4zlg80z245umu3ptxg7qc7rrpep97h27jy98e":false,"tb1q03dzpyq75zq6rmtzzq9jwuyyzdn7yrfrq5p6k3":false,"tb1qtd7rd06g9s9pzjhjxztjm2l3kzugrx46nhxxa0":false,"tb1qyvpzl8kevsgvl96cqjdsr8mp823y7uc4q3x84l":false,"tb1qdjs0l5hq8hzddmnp9e2q5l2tqw6h2w6t32xwg9":false,"tb1q07yw2adq4m5qghdrs8l62y9w2temj4kr3qplhe":false,"tb1qqft6qnfvyafap5n76ejjkmvet7enjpmzrfrujw":false,"tb1q4s988w2xeapshf23xfk5r6xpm966dllu6ncmj9":false,"tb1qaejqhwzppqrhja4r943mvhm6nc8wtdv88h4cjq":false,"tb1q8z0fhpz9zg240jyyq3ydzp4emsv4ud3t85pcuw":false,"tb1qttj3736ys5eeee96555ep3ng6x60uvpymv58jr":false,"tb1q57tn30auaq60k8lsgeuthhfqvn23qfn80apzzk":false,"tb1qpc9lgn8z8yxnttwxqhwsqm4v6x847u0xvdrant":false,"tb1q3f00n24k0sj5v74uzgnr48vn2xh4wq787xcgw2":false,"tb1quz7yrk5tdn08pdwgx03v0a5pnznsluj7mp322v":false,"tb1qnkfxws75rhtcln5uqy3p2xnnuvxm9gyn86hlun":false,"tb1q8zwdqr0vjavrzqjlhvetmff22xr62ftwp36k0a":false,"tb1qmxclylwaeh78kngg6zwf90men7fgp837f5ghpl":false,"tb1qhvjguqhe9urmugrja24k64kpmjuqgy3yc7gt40":false,"tb1q8t44q5gevd43aa2nsgkuh6ppt4a7fjcay0paww":false,"tb1qzqem7glkkwhrzw2ur6ju0azqlrxhhqq95dhcy6":false,"tb1qzhxrm35vdkfz32dtah5qek8fw72fnz2s630k4y":false,"tb1qnrk5fsylvu6hdcsgkvv02cpher5wcxxce6x45s":false,"tb1q24ft7syv9x0ytj6vg26gqpjkrn3tfkfwcnxfzg":false,"tb1q05kv9kg0zdsl8t0andchwqm7tq7ne7jmvvk4y8":false,"tb1qc9y972kkwayh6dqgevhyncpacxlmd4e3x5hds3":false,"tb1qnw0pg88ss8450zqqsdthvlqqx4vvssxz057fpp":false,"tb1qeclgv3gcfdkulmderue9xkylx2rdjeefqz7za5":false,"tb1q56j6sljfnuqjpsarp5zq9htx3wapmayuc52al4":false,"tb1qm2ghhu2uth9vwajs6pkf5fvp3tclpm360lqj9e":false,"tb1qnjqzhtr9rytgvjpc4t7zrwk24x08k05m5x2nld":false,"tb1qx66uuvpd80pav4qj30yu9kz0xues87363d4jd0":false,"tb1q5ezam3fzet4ytkw36zv3gcu57fztah2psns9vd":false,"tb1qlul4m387pmj4r3y22jyxc40z53fw4356ya9vzu":false,"tb1qgd3rd0nq6d0qgyv22mqm3rr4gz9zt46jpdw59f":false,"tb1qnd9qpzcd0vxkrky5rmj8l79hlm9eutu92cxe64":false,"tb1qx2642d4heaey8nd48c3dftdl0865uvx3074z6e":false,"tb1qr8su2cdaxyqe4z30zlrrmy8nhct6uqdnl3hrr3":false,"tb1qnxa6wupgdxz5nvh97u80vct2e5rc9csywwvsgr":false,"tb1qrcfqatvx7m9n0z2pfx3ljkjspmlm73k9xnuqkx":false,"tb1q2z6gtphhxy62aasm6v2n2slu25yj5f9vq6jrwm":false,"tb1qns39633aurl2a6nvtqfef6z6x9c7vgwa3h0fr7":false,"tb1qpw0pgq8f4zy75frwsrhw3zr9xhzq4f44kz4656":false,"tb1q82rptdkp4xkh7ajw8l6aspu6u7hwweeclxjmfa":false,"tb1q0kf6sr22rtlmgy5y8dj6202nv80ua7gl6zccpc":false,"tb1qwryfq87zsdtg07xjycyr2xhwcwh6gr386e276s":false,"tb1qxhj7wlw82el0dv8sg5csm63ryc7lhwv5l28e5m":false,"tb1q6xhh3fnkn4t2ye953ma5g7jh40xts5tqm4nny7":false,"tb1qhph8yvxz8r90yq5t6s3wr50jch6zuuw8gnreg3":false,"tb1qey0e5cs5tm7hclc0r288eweq0tpwpn0458kc3x":false,"tb1qgcfppyr45jks5xe6p3pljf7uf0kg65qn2v4tsj":false,"tb1qmlslf93w87ulamwvwvgqfhtlue772k9emncxee":false,"tb1q8dz8mr9wes6wqd43h3k2zy3y38rwl0jnunqrnd":false,"tb1qqmeap0eqwdh7jtxpypp2twjwe94w96mrxqnj89":false,"tb1qdwagxrejud386lhyz73wzd8meq9k9p6r2nkvu4":false,"tb1q38uef9388sfhhd2gvplfn0fm99cpp0zxje0rps":false,"tb1q7vd9ty2svwf7yu8tyl497eu0k23hnfneq7akdt":false,"tb1qwq6zg7lky0w0uwjg9ucth9wl7vlpuge3d2yaf4":false,"tb1qj4kev9lydakdwnrkx5whu8ga3phadpaey6hnx0":false,"tb1q6dv007hmrfer7nqqpgzxyt2awr0j0r62twmh6p":false,"tb1qfryty6ckzf7c6vlx3hu6mav4uky7x6mtwgtkmf":false,"tb1qpzcu5svaghwrgl4u8peuk0xpt6377v24vjyqsu":false}}',
			)
			.post(
				"/api/wallets/transactions/unspent",
				'{"addresses":["tb1q705a7ak4ejlmfc5uq3afg2q45v4yw7kyv8jgsn","tb1qnyupre6mtmhzguffsucrz40sy2katy8vkt8zfu","tb1q8g0j9eqtntqnh3tvsfvw74j546td7c5996wyn6"]}',
			)
			.reply(
				200,
				'{"data":[{"address":"tb1q705a7ak4ejlmfc5uq3afg2q45v4yw7kyv8jgsn","txId":"2f718af139fa92be03803a62bf79087b0f366c3eeb0ed797fe261a482c79c694","outputIndex":0,"script":"0014f3e9df76d5ccbfb4e29c047a942815a32a477ac4","satoshis":100000},{"address":"tb1q705a7ak4ejlmfc5uq3afg2q45v4yw7kyv8jgsn","txId":"912ff5cac9d386fad9ad59a7661ed713990a8db12a801b34a3e8de0f27057371","outputIndex":0,"script":"0014f3e9df76d5ccbfb4e29c047a942815a32a477ac4","satoshis":100000},{"address":"tb1q705a7ak4ejlmfc5uq3afg2q45v4yw7kyv8jgsn","txId":"2d4b716451be03935885ec5fc99afb2b2cedb6656d9776e0342a643767430535","outputIndex":0,"script":"0014f3e9df76d5ccbfb4e29c047a942815a32a477ac4","satoshis":1000000},{"address":"tb1q8g0j9eqtntqnh3tvsfvw74j546td7c5996wyn6","txId":"07b2af052139176381d7245b78be65bcb68ee3f3d0d624fe738cc2e6d04be04b","outputIndex":0,"script":"00143a1f22e40b9ac13bc56c8258ef5654ae96df6285","satoshis":1000000},{"address":"tb1qnyupre6mtmhzguffsucrz40sy2katy8vkt8zfu","txId":"c84ecdca84fd746859fa51519e12ddc8d475e66787b55d74a966a1601a1c7008","outputIndex":0,"script":"0014993811e75b5eee24712987303155f022add590ec","satoshis":1000000}],"links":{"first":"https:\\/\\/btc-test.payvo.com\\/api\\/wallets\\/transactions\\/unspent?page=1","last":"https:\\/\\/btc-test.payvo.com\\/api\\/wallets\\/transactions\\/unspent?page=1","prev":null,"next":null},"meta":{"current_page":1,"from":1,"last_page":1,"links":[{"url":null,"label":"&laquo; Previous","active":false},{"url":"https:\\/\\/btc-test.payvo.com\\/api\\/wallets\\/transactions\\/unspent?page=1","label":"1","active":true},{"url":null,"label":"Next &raquo;","active":false}],"path":"https:\\/\\/btc-test.payvo.com\\/api\\/wallets\\/transactions\\/unspent","per_page":15,"to":5,"total":5}}',
			)
			.post(
				"/api/wallets/transactions/raw",
				'{"transaction_ids":["2f718af139fa92be03803a62bf79087b0f366c3eeb0ed797fe261a482c79c694","912ff5cac9d386fad9ad59a7661ed713990a8db12a801b34a3e8de0f27057371","2d4b716451be03935885ec5fc99afb2b2cedb6656d9776e0342a643767430535","07b2af052139176381d7245b78be65bcb68ee3f3d0d624fe738cc2e6d04be04b","c84ecdca84fd746859fa51519e12ddc8d475e66787b55d74a966a1601a1c7008"]}',
			)
			.reply(
				200,
				'{"data":{"2f718af139fa92be03803a62bf79087b0f366c3eeb0ed797fe261a482c79c694":"02000000000101aaf23e0cb853c0820b5cbeb9292fff12fc925031905d1e90fc2f426f453930a80000000017160014ad5d241c585fd25d3271875af67a077ba4cf7324ffffffff02a086010000000000160014f3e9df76d5ccbfb4e29c047a942815a32a477ac4128b0d000000000017a914983aec29890d89c391f99a680e577a6449c6bc12870247304402202c36d500cdc51bb23749b1c4137cadde4540ad30f3c0c30f2e9999dbe4bda51102204e4cabb31e37e73bf0b76c08b2c58119933ce362b2b674b968127605aef41e33012103987e47d69f9980f32363e40f50224fba7e22482459dc34d75e6f2353e9465d7600000000","912ff5cac9d386fad9ad59a7661ed713990a8db12a801b34a3e8de0f27057371":"0200000001e6eb100bcd16a7347f3405b804b372726e761c2e13f0557aee1ade1a796a3394000000006b483045022100a731e9b6c1092cfc20532c3f6b1091816fcd314f5d4332eb4b8a98a59ef07e3a02201654fdcf9bb653f8af9e8ae6de1ede2654a92f6779f18846a3dedaadf8994804012102692389c4f8121468f18e779b66253b7eb9495fe215dc1edf0e11cbaeff3f67c8ffffffff02a086010000000000160014f3e9df76d5ccbfb4e29c047a942815a32a477ac4128b0d00000000001976a914a08a89d81d7a9be55a18d12f9808dcd572e2cd1c88ac00000000","2d4b716451be03935885ec5fc99afb2b2cedb6656d9776e0342a643767430535":"010000000001014bd579923bb0b270d72b0f9ee7f91eca0691002019fa95c69e518b5aded3b39f0100000000f0ffffff0340420f0000000000160014f3e9df76d5ccbfb4e29c047a942815a32a477ac4e5df2400000000001600142d0de4d1eb44019d58cd4145e1c5d0533b33d31b0000000000000000196a1768747470733a2f2f746274632e6269746170732e636f6d02483045022100bfdc818acb34732ec6dd27d2403145933cef6847e3b748b3e20d5e44dd292d060220160ce62e5573d4a54a70fad2b9819b75ebc0ad684400b9659f8685850883362a012103fc256844336cdd7425a56fbcf583b18ff6ef58f890080625cc43cd1c3fd8618900000000","07b2af052139176381d7245b78be65bcb68ee3f3d0d624fe738cc2e6d04be04b":"0100000000010106dc2bdf045b928247e50f29b8985e039d0b4b6748c6cb3d28c7823f6ffbcde50100000000f0ffffff0340420f00000000001600143a1f22e40b9ac13bc56c8258ef5654ae96df6285ad2d220000000000160014cdc110e962030f8ba6f9d4d913e9e2d1035ca96f0000000000000000196a1768747470733a2f2f746274632e6269746170732e636f6d0247304402204cf5ea8dc821836d3d210d8508c50a1c4a34205b33debd29114d0493845aa6720220345743c9e8ed48a7b9341e64a309e09e4ce12206e6a0c801d189f231aacb903e0121035fbd76bdf5ee796a5c78613c54d082617a36d41d736e73a0f12d83f957825e3400000000","c84ecdca84fd746859fa51519e12ddc8d475e66787b55d74a966a1601a1c7008":"01000000000101ad2d6e4caaf9becb41b45c5540ab2188bd316867c42755b3b096c94e16d7b77a0100000000f0ffffff0340420f0000000000160014993811e75b5eee24712987303155f022add590ecb0542300000000001600147e3a64f855b18cfe78a372a3669bdf4d9031be380000000000000000196a1768747470733a2f2f746274632e6269746170732e636f6d0247304402203e0a47686a2c9593aa8ae9c49ddc845e839961edfbd6e033c78c177f04a94e980220078eddaaadd0bca65eb1eb0439f80bf7605c6b7f04251c6bca928a376c4c91380121020dc805b6cbc9d0b975bdd4ddaa69227801cd74cef9913845bbaa93e2cef30a4f00000000"}}',
			)
			.get("/api/fees")
			.reply(200, {
				data: {
					min: 0.00001074,
					avg: 0.00001,
					max: 0.00180617,
				},
			})
			.persist();
	});

	it("should generate and sign a transfer transaction", async (context) => {
		const signatory = new Signatories.Signatory(
			new Signatories.MnemonicSignatory({
				signingKey: mnemonic,
				address: "address",
				publicKey: "publicKey",
				privateKey: "privateKey",
				options: {
					bip84: {
						account: 0,
					},
				},
			}),
		);

		const result = await context.subject.transfer({
			data: {
				amount: 0.001,
				to: "mv9pNZs3d65sjL68JueZDphWe3vHNmmSn6",
			},
			signatory,
		});

		assert.is(result.id(), "1fbed27b452d2cc130234774e81e92e7b3f84a5e8e0a977cd82587a8a43a98d8");
		assert.is(result.sender(), "tb1q705a7ak4ejlmfc5uq3afg2q45v4yw7kyv8jgsn");
		assert.is(result.recipient(), "mv9pNZs3d65sjL68JueZDphWe3vHNmmSn6");
		assert.is(result.amount().toNumber(), 100_000);
		assert.is(result.fee().toNumber(), 163_000);
		assert.instance(result.timestamp(), DateTime);
		assert.is(
			result.toBroadcast(),
			"020000000001013505436737642a34e076976d65b6ed2c2bfb9ac95fec85589303be5164714b2d0000000000ffffffff02a0860100000000001976a914a08a89d81d7a9be55a18d12f9808dcd572e2cd1c88ace83e0b00000000001600146a101086f0b693211782261f13bf4bbbd516f2b60247304402204e38c7afe2318a8d5e7d26cc6a5205ef6b9155582e741255457438d6d84e444602206d76110a3a788d3863e926fdeac6952392e46898f31803f5093a7660975d626b0121023604afdf13cda171630e1e4dddade91d5984d54f1b7dbdf06ed7cd1977fe7ef400000000",
		);
	});
});

describe("legacy multisignature wallet", ({ afterEach, beforeEach, it, nock, assert }) => {
	beforeEach(async (context) => {
		await createLocalServices(context);

		nock.fake("https://btc-test.payvo.com:443", { encodedQueryParams: true })
			.post(
				"/api/wallets/addresses",
				'{"addresses":["2Mzq2GgWGQShdNr7H2hCxvC6pGrqzb64R3k","2NAga16irQ8iaMEU3db3k7ZTmg7eaGSpzvy","2MzLoh1jz3QJ8DARk99NuQvy2Mfg954J4HE","2MuDecKd8h4CwLJCD2vUSdtKGTopiR9QkVC","2N2sUjyiXGxBYo39MeuppR57ZUuPTFCbAhU","2MsmPAUNGwNSHqJeHwfsRF2bzuC8k8UGRB5","2N99WuTbJPvbhPj4Lch6USatqrJ8Sptjh62","2My8s3TaWBkhpAwWu1d8pHG8vNL2t2GXv6z","2N4q4BZE4sfQn4Fbv34ooezNZpnY2HShJFS","2NADDKDFCDwEuxdGnXrUBBqT4z1zASos7Kn","2MyRRQwfxgj7RLxB1WrGzgZk76Ybrd8aBA9","2N7Yeq6sdskLbByHzuVkFE6cW7fYuDLhyoY","2NDymWV8J1HReHPrxQLJt2SiqpWGDtrHcB9","2N5X2tx625hmLbS2szFJQNrANaFtTAok2HK","2MwWEaYH25jfJFzVkUUQ3E5vJvaDLJ6d2o7","2NGL4D6ypy45tVDu5wp58qmHZQzLVbg9XGF","2N2GhTcKw5x8t8bH8VgwJL5xmZwEyxFhL6w","2MsPsFoDKY5TDHQFykFrcLjZsxbCtL6rGnW","2NDFMbhEcPiveuP5aRGb9LysuS4ABPV9kGR","2NEy9NY8WcKyzRbLx413zgm1HmcohCLTAx5","2Mshmmh3UDPdepELxXYNNYWvmad4ibisYG4","2MzReeKG18uN2nkWUnsrirnBNJoBBYTvCaC","2NCNVYMJvrtXZXCfX62i6XaUemGkXygjP5h","2NGHiREgdM1DWT9QPohuMQfYkL4XKBC2p4R","2N5XgNC1qYrvM4gU2ZsgiYjMb2zPHYP4iur","2N7bnpxjpfBnu7sAUJaRguddY5G8Rg1dwLr","2NGEex9AYZmCe7vyhTjUcjGhGaF4L369n2c","2N8poQRukhmLZyARnBCd4hhttFsrr1UQNtp","2N4ebzXwqxbDNjXLTq9i4c5Rzkb2azsfWUF","2Mt9Kh1aLA9x3KEzyDTrbC8z7GE56wo49Ep","2N9mvnbsPHofThC6Jo3Mp6qg8TeJAh6RzsN","2NFNoxCAB8P77Yss39uhNBbJF5kvah39oBT","2N3BSZj88eWjc2PXAXEBChTmokQxLxNjeeG","2Mz7h15waFNRfCvhEXTkMG8S6s5MDeWjX2r","2N3sW2WVDYAMvZ9ridRjuVKZjXvJRGDhLa4","2N6GLd93Q2PtViHXsMrH6QQteZu48zddXhy","2N43s4UPNzUZpggzjsR3Ky4gHevoVDtsK73","2N6ik2Z3YZMps6bdJrvmRH23Ly3jHWpDksp","2MvMWnxaFhxTAs3j8v3r5abmaZPTMyAQG8j","2N2imDRsGinrK2U9yKQAEiEpFExJoCagZSq","2N52i6MhRnQVsaFYB4oVKx8UysmQXWhLWva","2Mzt5YoPysrsNVEMnoRbaawZE824CXUCbJN","2NEQtQXqrQMyoCc84H2fkBme6UrG7eVB8ce","2NFx7kkDf4vvMRMBJHENgm9go6VwvDegQie","2N1jSjzmyMXArjBwJsfwJfgfmkvenfwERp3","2MtPYwEt8atVwGsXyptg9RPBP9AkYphykmt","2N2jXKG7pEzaaQ7SMfYhbLK9Lf7c41PKo6J","2NC3qmfuxediUYHwerieAeY8PefWQ2RsYdJ","2N43t5S8eQhYjYboLL2w96yGTEou7vJtNAw","2N6amaJZUb3DtkpEsFWo4nEAQMZUpRjkAZ3","2N9pm7a5MAoVtMT5fmmiQM8Dnskzb5gcL9T","2N7tpWUCRMiDmCzkkbbnGZEVJnpjXsDQdJV","2MzQQzCJ3ASwmPXPuaJVTuqUueLd6Y9bYJr","2MvR7LgpKDd8sQ4DBgBCS4YP2yFPfte4vLa","2NETAdQ19YibtdpuVP48jNoPTX5FnXk8Qdk","2MwuqXiT5hLPhSDDRwcAaUr6mZD1q1QxEGS","2NCZQQLNDkFUtQ9gBF2kBmbgtvoi2pCuXrJ","2MveeHvE8nfhaDtXzHT1JUuYHd1rs1iX6yc","2MzkYDH7ZpdTXYn15qfpFnieDnJHrWgg6Qk","2MsjxkF78K7AX3ueGS8ytb9ampoXMctHin4","2NBmvPGXfQQYk8fPEhtYPYpe1FGwiyhq4Ss","2MyvDW6npiF95DPGAEBRR7ND6PrqKo2yxEK","2N4hJe6YDHaVGwjZX3qJnS954ifr4pTBdqo","2N3jjQev7dLHLYmojiaoZdLgFdSrMmdopHv","2N2YP37NuUg1Wo1m6pMARQNuExaughZLDsz","2ND4NwHC853wuWDzfLL2vUKYGvUDn9VGTjM","2NEoebEVPWseaMA5A3W8pe2ugY1uyxmqApA","2N95cG6zRafn2d3CZkKkHeRL3fn1p8eZFDU","2MusfviKsuqKEoman9sN7y7EDAWFQKMbzrB","2MzwniAC4TtCzTSiVdf52GGVgf4FUVsKt8A","2MwTjueWV4XYsAgpbeAfbbhgYyKXbbc4N6c","2N658QDFnMTqNLTyfZbVShQonxRcgDxtvMB","2NBtvtF1Y1S3Gb3Fw87DmZGwAybZFpHhJde","2N1PcDHnLKFzwVNoUaxxGLNbG7TwK4J5a2i","2NDtv5EiLtQ146sqSoBpZZ92GgVACvAUp3M","2N1yoYNCCwBK64YpurAp2JmXj6zreWaLbW6","2MzR7qGRCozRTtrqpyZpNX321xz1xJPePjU","2N8Xk8VXRDQJpUhMyUxEHcPdPM7xC6QxKG4","2NEQc3Kw5ttVPkeFVs9LioZEFw1qTwPe4FM","2MyMVLRxdqSC4pfuzFtrqjU6jteas4Yq47C","2NFKcdvRTxvRPM894hBrcoELVyQ74AsPo8U","2MxxdR1EB2r52iYBc1yQ3tEBCNHe7hMhdQ5","2NEcS5fJJjFq2E84wD9uqQVw5MUbaKqMFHi","2N1zdZzw58MxkVN44unaCfpa4VdJxYuPtpa","2N19qNAzeQ7tvrLpFdf5ncEEz2DqzWPT917","2MwQ6RdXyoFFK7tSKehGJkRhkFWFLiweWqr","2Mv5KUW3kVBdNCf6KnXFYR3kNHT1BvZmL8r","2N8gT1XUcjJK5yd3TK72ExqSAMmFzrAqJtM","2N4o5CuPWJNFbBrNuhCyY9A7SFnhzHaEyPy","2NARsar2aLWfFWWsACukG2aYS28sxZ3g4mz","2NEkBFBanbLuU8XiHPjFxbuV8vqKJqUAKog","2NBR4ZDUDDGXnUwwTjifZnrHkpAurpnxWAU","2NDWJPS4BT8ishZWMbqeKGgQCrxtXgLgKHE","2NEGBQxZTV3MQDML42YYRvbCBWL4GKrSon9","2N89zd657Y4v9SvThXgEjnbuKhEKvTQRAHE","2N3mZVGEKYn6LErJCoaWGAiLfbd1xfyfwj9","2NArmXzSEeekEh1zVaZqbouESKfDDvwiAZV","2NC4demeenvY8XHZ8pFvD88rZyz7m4xpQuk","2NEzFub2aPomAXnLDvoKtFhhNxYgTrkE6HU","2Mz3fPZiR6T9QW7n3zpiDJLpatqK6K4HBgf"]}',
			)
			.reply(
				200,
				'{"data":{"2Mzq2GgWGQShdNr7H2hCxvC6pGrqzb64R3k":true,"2NAga16irQ8iaMEU3db3k7ZTmg7eaGSpzvy":false,"2MzLoh1jz3QJ8DARk99NuQvy2Mfg954J4HE":false,"2MuDecKd8h4CwLJCD2vUSdtKGTopiR9QkVC":false,"2N2sUjyiXGxBYo39MeuppR57ZUuPTFCbAhU":false,"2MsmPAUNGwNSHqJeHwfsRF2bzuC8k8UGRB5":false,"2N99WuTbJPvbhPj4Lch6USatqrJ8Sptjh62":false,"2My8s3TaWBkhpAwWu1d8pHG8vNL2t2GXv6z":false,"2N4q4BZE4sfQn4Fbv34ooezNZpnY2HShJFS":false,"2NADDKDFCDwEuxdGnXrUBBqT4z1zASos7Kn":false,"2MyRRQwfxgj7RLxB1WrGzgZk76Ybrd8aBA9":false,"2N7Yeq6sdskLbByHzuVkFE6cW7fYuDLhyoY":false,"2NDymWV8J1HReHPrxQLJt2SiqpWGDtrHcB9":false,"2N5X2tx625hmLbS2szFJQNrANaFtTAok2HK":false,"2MwWEaYH25jfJFzVkUUQ3E5vJvaDLJ6d2o7":false,"2NGL4D6ypy45tVDu5wp58qmHZQzLVbg9XGF":false,"2N2GhTcKw5x8t8bH8VgwJL5xmZwEyxFhL6w":false,"2MsPsFoDKY5TDHQFykFrcLjZsxbCtL6rGnW":false,"2NDFMbhEcPiveuP5aRGb9LysuS4ABPV9kGR":false,"2NEy9NY8WcKyzRbLx413zgm1HmcohCLTAx5":false,"2Mshmmh3UDPdepELxXYNNYWvmad4ibisYG4":false,"2MzReeKG18uN2nkWUnsrirnBNJoBBYTvCaC":false,"2NCNVYMJvrtXZXCfX62i6XaUemGkXygjP5h":false,"2NGHiREgdM1DWT9QPohuMQfYkL4XKBC2p4R":false,"2N5XgNC1qYrvM4gU2ZsgiYjMb2zPHYP4iur":false,"2N7bnpxjpfBnu7sAUJaRguddY5G8Rg1dwLr":false,"2NGEex9AYZmCe7vyhTjUcjGhGaF4L369n2c":false,"2N8poQRukhmLZyARnBCd4hhttFsrr1UQNtp":false,"2N4ebzXwqxbDNjXLTq9i4c5Rzkb2azsfWUF":false,"2Mt9Kh1aLA9x3KEzyDTrbC8z7GE56wo49Ep":false,"2N9mvnbsPHofThC6Jo3Mp6qg8TeJAh6RzsN":false,"2NFNoxCAB8P77Yss39uhNBbJF5kvah39oBT":false,"2N3BSZj88eWjc2PXAXEBChTmokQxLxNjeeG":false,"2Mz7h15waFNRfCvhEXTkMG8S6s5MDeWjX2r":false,"2N3sW2WVDYAMvZ9ridRjuVKZjXvJRGDhLa4":false,"2N6GLd93Q2PtViHXsMrH6QQteZu48zddXhy":false,"2N43s4UPNzUZpggzjsR3Ky4gHevoVDtsK73":false,"2N6ik2Z3YZMps6bdJrvmRH23Ly3jHWpDksp":false,"2MvMWnxaFhxTAs3j8v3r5abmaZPTMyAQG8j":false,"2N2imDRsGinrK2U9yKQAEiEpFExJoCagZSq":false,"2N52i6MhRnQVsaFYB4oVKx8UysmQXWhLWva":false,"2Mzt5YoPysrsNVEMnoRbaawZE824CXUCbJN":false,"2NEQtQXqrQMyoCc84H2fkBme6UrG7eVB8ce":false,"2NFx7kkDf4vvMRMBJHENgm9go6VwvDegQie":false,"2N1jSjzmyMXArjBwJsfwJfgfmkvenfwERp3":false,"2MtPYwEt8atVwGsXyptg9RPBP9AkYphykmt":false,"2N2jXKG7pEzaaQ7SMfYhbLK9Lf7c41PKo6J":false,"2NC3qmfuxediUYHwerieAeY8PefWQ2RsYdJ":false,"2N43t5S8eQhYjYboLL2w96yGTEou7vJtNAw":false,"2N6amaJZUb3DtkpEsFWo4nEAQMZUpRjkAZ3":false,"2N9pm7a5MAoVtMT5fmmiQM8Dnskzb5gcL9T":false,"2N7tpWUCRMiDmCzkkbbnGZEVJnpjXsDQdJV":false,"2MzQQzCJ3ASwmPXPuaJVTuqUueLd6Y9bYJr":false,"2MvR7LgpKDd8sQ4DBgBCS4YP2yFPfte4vLa":false,"2NETAdQ19YibtdpuVP48jNoPTX5FnXk8Qdk":false,"2MwuqXiT5hLPhSDDRwcAaUr6mZD1q1QxEGS":false,"2NCZQQLNDkFUtQ9gBF2kBmbgtvoi2pCuXrJ":false,"2MveeHvE8nfhaDtXzHT1JUuYHd1rs1iX6yc":false,"2MzkYDH7ZpdTXYn15qfpFnieDnJHrWgg6Qk":false,"2MsjxkF78K7AX3ueGS8ytb9ampoXMctHin4":false,"2NBmvPGXfQQYk8fPEhtYPYpe1FGwiyhq4Ss":false,"2MyvDW6npiF95DPGAEBRR7ND6PrqKo2yxEK":false,"2N4hJe6YDHaVGwjZX3qJnS954ifr4pTBdqo":false,"2N3jjQev7dLHLYmojiaoZdLgFdSrMmdopHv":false,"2N2YP37NuUg1Wo1m6pMARQNuExaughZLDsz":false,"2ND4NwHC853wuWDzfLL2vUKYGvUDn9VGTjM":false,"2NEoebEVPWseaMA5A3W8pe2ugY1uyxmqApA":false,"2N95cG6zRafn2d3CZkKkHeRL3fn1p8eZFDU":false,"2MusfviKsuqKEoman9sN7y7EDAWFQKMbzrB":false,"2MzwniAC4TtCzTSiVdf52GGVgf4FUVsKt8A":false,"2MwTjueWV4XYsAgpbeAfbbhgYyKXbbc4N6c":false,"2N658QDFnMTqNLTyfZbVShQonxRcgDxtvMB":false,"2NBtvtF1Y1S3Gb3Fw87DmZGwAybZFpHhJde":false,"2N1PcDHnLKFzwVNoUaxxGLNbG7TwK4J5a2i":false,"2NDtv5EiLtQ146sqSoBpZZ92GgVACvAUp3M":false,"2N1yoYNCCwBK64YpurAp2JmXj6zreWaLbW6":false,"2MzR7qGRCozRTtrqpyZpNX321xz1xJPePjU":false,"2N8Xk8VXRDQJpUhMyUxEHcPdPM7xC6QxKG4":false,"2NEQc3Kw5ttVPkeFVs9LioZEFw1qTwPe4FM":false,"2MyMVLRxdqSC4pfuzFtrqjU6jteas4Yq47C":false,"2NFKcdvRTxvRPM894hBrcoELVyQ74AsPo8U":false,"2MxxdR1EB2r52iYBc1yQ3tEBCNHe7hMhdQ5":false,"2NEcS5fJJjFq2E84wD9uqQVw5MUbaKqMFHi":false,"2N1zdZzw58MxkVN44unaCfpa4VdJxYuPtpa":false,"2N19qNAzeQ7tvrLpFdf5ncEEz2DqzWPT917":false,"2MwQ6RdXyoFFK7tSKehGJkRhkFWFLiweWqr":false,"2Mv5KUW3kVBdNCf6KnXFYR3kNHT1BvZmL8r":false,"2N8gT1XUcjJK5yd3TK72ExqSAMmFzrAqJtM":false,"2N4o5CuPWJNFbBrNuhCyY9A7SFnhzHaEyPy":false,"2NARsar2aLWfFWWsACukG2aYS28sxZ3g4mz":false,"2NEkBFBanbLuU8XiHPjFxbuV8vqKJqUAKog":false,"2NBR4ZDUDDGXnUwwTjifZnrHkpAurpnxWAU":false,"2NDWJPS4BT8ishZWMbqeKGgQCrxtXgLgKHE":false,"2NEGBQxZTV3MQDML42YYRvbCBWL4GKrSon9":false,"2N89zd657Y4v9SvThXgEjnbuKhEKvTQRAHE":false,"2N3mZVGEKYn6LErJCoaWGAiLfbd1xfyfwj9":false,"2NArmXzSEeekEh1zVaZqbouESKfDDvwiAZV":false,"2NC4demeenvY8XHZ8pFvD88rZyz7m4xpQuk":false,"2NEzFub2aPomAXnLDvoKtFhhNxYgTrkE6HU":false,"2Mz3fPZiR6T9QW7n3zpiDJLpatqK6K4HBgf":false}}',
			)
			.post(
				"/api/wallets/addresses",
				'{"addresses":["2N5ETorn5JyFdWYYnAb9PVC3Hz1bgMjWQPU","2N5WAJtL3hhc9TwNJp6JjSNeUhg16o4D9T3","2MufXVhLZfhQSBgVaghCMdHvPZjWxCZBnSx","2NEPqy9v3jAuorUWjB5WsztDhb5vpLMU4uL","2MuJtEaiibDn2Kd9aF9qKocaof5vdHXHg3W","2Mw4Npp8CmwuH47oHAuPSMeXtZPgZN32mpv","2MuzcqQ2Bdk4JaXynJ9vavdpQbgJErks2LS","2NE7iC154tQ9y4ayhvELHRY1UDjtKxSfvak","2N6vJGS2y7mDqawac3acYAxSV2xtfzrUTv3","2N6DFQEcDWLBE4tqAjkpqm4kV1emkkv1GbD","2N8kR8DxSYRetrtaq7cGHczPSf7gqefUpKi","2N4rFQuiC3YaCFTHDCjegbpN1EU1hsiwMMG","2MsV6AGxYmvALsoSYNDjaM6gkEaAc4KHT9n","2MwahKdPFCrKq4y4vnBqZPCZ7Ev4a7vDPVC","2NDHbxy4maFWCiz2J8oGnGFfV8hF3GgdPFL","2MvLPw4PaH8UpzDR6fHEou4qcJGvpJgJNdw","2N4vWhzYpd3qhwNg3MnaSE3ViKoBytD82ay","2N7Hq3zg5VLtNvArwMm6HrJ9LEwV6Wc2qFc","2N5UzTGjnxKN1HvmZjfDJ9VPXnhCt7cLnpw","2N79t5eTR3hoW4RXyyV1NUpHtpsEywJ5XTv","2MzoqXmsvkmbne2L8DREym1HkRYGStDgpK5","2N2rtAqceXKVdvMGDfURgtWtNJnoz8ESP26","2N6et6RjjrYAHJvZfWUH7HiH8Y5NLHngZni","2N6Hzf5o9ApU9ETJL3DoDpXbtYbi5bNw4gZ","2NBerPgfA9a4m7NmYiCAokrNqP31VW3ptEX","2N3i9j3EPuUDqUdmfy6tJVo5UKSgoH6HnzX","2NDe5DdnqP27VBeJHGZqFpkoCDwq9wb1oo2","2N4PWNeR7q2MgEXeMfHGfTZxM81p1NK2ewa","2NBzTNr3E6qpQv7UrtF2aAehyJqj5EZ8tQc","2Mua3BkdAdZ84auwNdu66yQynmekcAUssiD","2MzbPW1mRWXkkBE2ofukUQXZa6ozvqimPG1","2NCobP6FmmriZKN2na8pT1ZBkBad7exau5N","2NF9HZSsKpQSqYvRmyyAoQQTLvnERmDnCJd","2NGY92p2VuGpnGNjEQe149pqzkdcxHCcLxU","2N4n2EWzDNozEDxyfzKwMjhv7cXXXNAuJBw","2N4Xbx38uYjt2tUfYqhVwYKks6DS81pQeH7","2N5DyZnXMfPCnNFACPSD4XNeWHtxrLgheGQ","2MwcEs68evEBEzQLc7D6xonB3gKmCqEb3VE","2Mxo1G3tHJgwFEMt49SqxxauyoMFMAF8kmF","2Mzhyq4SjpL6gZJbvwnzazmb8RxdLRn1XY4","2Mu7RgWt82XuvwWMLNVE2ur5fbYCSQnP2eq","2NG1nYPmkbQ4sjjLzY1JLsv3wPJyVqH3nYf","2N5inBrLLdgGyJgptJvPFi1w8ZkrsRw1DqW","2NCSj9Ki6hRkiD8mVjHLBqCShzhiUb4AW8c","2MzBzn5xEJmcaYubKPnFUFjHQi3JEGFLhg9","2MuDfViyXNinRxvyjCUEpAW7iMdexg6nzrJ","2MsgwWXRsuNoo7eTzSDSy6bpbbWrMDwbqfR","2MwJDSSv7pSAZq4M3nhkRedydihzKr9Vvjx","2N5ziCLDhupPNhBsg1jLp6FSw9XfPkpHCDR","2N36yA5XZeuGnJgLmL71stQRavZEs6b2tjY","2MvXdqzXNJAPoXZTyaqnrzf5zM16XyJBWN6","2NBBPucUX24QFYEbyi3p5uWD9DaHhhDtWoE","2NAAxenvJmd3v7K5gj2GvySFjfgRAak7m3Q","2MuxFTPd54PtR8jDMDd9rzvK79qhTTVss3a","2N6tcRp2kN3eJyUvzR4kY3bnGhFv9DTafRd","2Mwqas93AGzL8JQBXPn7WeCt16q6YMJXg4E","2N6bRzh5HGDUqw1jEsCzuWYz1BwPJqSM6TC","2MzfX91KUkB9Yx4k44k1cdqc4THwbhApa4a","2MvKN4v394HasuRTRvBWtdkkSUzE9tKKkxr","2N41ctEYgrYzZ8VouNCmeKjLrzXQKWmnjDP","2N6RbxwiWjZ3QyP2bo4ta1G2ScLN6jcBaju","2NAXgNTNpFa2nVUxXCk85pb3J4AjL3WaEsM","2NBpadBMWkanCPL7W2HfTqGL64iJipVQ4WB","2N5sRcsjyMAHRKLnnPMweLt66YzDMcuTVC2","2N3c5VndeJrNDrVreN5xZtKsLiGb73UT7uJ","2N9TnkEMNsNrUcHnCLjBwXyqGAcKVs729FC","2NEkuQdbjkvXz68zE8nPfL6SN2tv3nq8QPK","2N2AQr9jr8fkaJTfh2Vtx7wYBpMQrLgWD5j","2MzHhzSBae1qqHsbjnLk6RgXwKe7xNBuMkW","2N4cHKJbGCuBZTSMh7RwU7F7iFsNaNEkaT6","2MsQT5weLaceM5nZWFKYBNuK7rtJpiCuL1M","2NAYrYLJmbvSdrWWeA4oUuqcieUtEcjF9Pq","2MwmGUfQYVfxGPH4qp5WsW1VPS1Bh3HkWc6","2NCqsG8bgJ6g7EuA8diMHPhq4Bu58UHYCnc","2N638nCgvgeiwTSiFJ4V1R24pqnKDfBosqH","2MtjjNxHaWWFiWUt3Db3PU8dPohRoMKgZfm","2MtjAxYQQsdXiG96vUac9iNw3xy11R2j9VA","2MvugW6pX1SaqXU58yDTsJmRDosaJ2mWRtv","2NBr7WHPz7oPqig5n7JN1G545K2N1CWAvYu","2Mx4UDSYeN4cmhMPx6VLXbDQ4P4faPkWgih","2N3JgpWntUpApjfW6cv4KxsASPgJbYDySYP","2MtS64nyhXcgUVP1LNSxD3b6L8yrqB9KhjY","2MuAfEyEHcmdmnHD6Edwg391qaDW1S85E4h","2N693i7JTKx1xXUeAYbDmh7Uhj4zBiHccxh","2NEMEYgaezunQZWJr7Ezg9WBVxuM3B3S4ac","2NGLtNZhvp92vMV1uruWg7uw5AXmjjZrkvs","2MzvZGMJZ1ienAnLmKmiU2xrnJ8gzGoaQHT","2NCojkJdUhXKmVLQQyPnfakHn5k8bvUFsKh","2N53J6jSqJruYXDDmgtw89849TVig7yeWGP","2NGV7nrdfxfGLnwLrdQxYaga8JjzVhASvfZ","2NG9hP4pGpPaFGzNAFZbAtsjCmn2FKb1Zpr","2MztRGcL74pzPhCJdQbeDZ8KXFFSfGQbUNd","2MvHCXg45LBHkSh1ZPKgDZzNngC7veqsMfZ","2N72iAx88ob9RiDx8kweqA8umoRMjRY9HJN","2NDtkPqP5g1mREubwHnzxvLeiG1wgLKoXSm","2N5gzMWAfcKJZQ1EizxkeETgCJY7s4LApBo","2N6ykqZDexqaUMoBReHtMVeCVrjfKTqePLt","2MwpbvktYBKUUrpFj3aJiPgvcY47DmcUQcr","2NFegdrY7Q614Tv5F7qaU2pEPK3CNt7NuqL","2N3cvnPrT74CkmEtvgwSSbyjVi9DL6Mbjyv"]}',
			)
			.reply(
				200,
				'{"data":{"2N5ETorn5JyFdWYYnAb9PVC3Hz1bgMjWQPU":false,"2N5WAJtL3hhc9TwNJp6JjSNeUhg16o4D9T3":false,"2MufXVhLZfhQSBgVaghCMdHvPZjWxCZBnSx":false,"2NEPqy9v3jAuorUWjB5WsztDhb5vpLMU4uL":false,"2MuJtEaiibDn2Kd9aF9qKocaof5vdHXHg3W":false,"2Mw4Npp8CmwuH47oHAuPSMeXtZPgZN32mpv":false,"2MuzcqQ2Bdk4JaXynJ9vavdpQbgJErks2LS":false,"2NE7iC154tQ9y4ayhvELHRY1UDjtKxSfvak":false,"2N6vJGS2y7mDqawac3acYAxSV2xtfzrUTv3":false,"2N6DFQEcDWLBE4tqAjkpqm4kV1emkkv1GbD":false,"2N8kR8DxSYRetrtaq7cGHczPSf7gqefUpKi":false,"2N4rFQuiC3YaCFTHDCjegbpN1EU1hsiwMMG":false,"2MsV6AGxYmvALsoSYNDjaM6gkEaAc4KHT9n":false,"2MwahKdPFCrKq4y4vnBqZPCZ7Ev4a7vDPVC":false,"2NDHbxy4maFWCiz2J8oGnGFfV8hF3GgdPFL":false,"2MvLPw4PaH8UpzDR6fHEou4qcJGvpJgJNdw":false,"2N4vWhzYpd3qhwNg3MnaSE3ViKoBytD82ay":false,"2N7Hq3zg5VLtNvArwMm6HrJ9LEwV6Wc2qFc":false,"2N5UzTGjnxKN1HvmZjfDJ9VPXnhCt7cLnpw":false,"2N79t5eTR3hoW4RXyyV1NUpHtpsEywJ5XTv":false,"2MzoqXmsvkmbne2L8DREym1HkRYGStDgpK5":false,"2N2rtAqceXKVdvMGDfURgtWtNJnoz8ESP26":false,"2N6et6RjjrYAHJvZfWUH7HiH8Y5NLHngZni":false,"2N6Hzf5o9ApU9ETJL3DoDpXbtYbi5bNw4gZ":false,"2NBerPgfA9a4m7NmYiCAokrNqP31VW3ptEX":false,"2N3i9j3EPuUDqUdmfy6tJVo5UKSgoH6HnzX":false,"2NDe5DdnqP27VBeJHGZqFpkoCDwq9wb1oo2":false,"2N4PWNeR7q2MgEXeMfHGfTZxM81p1NK2ewa":false,"2NBzTNr3E6qpQv7UrtF2aAehyJqj5EZ8tQc":false,"2Mua3BkdAdZ84auwNdu66yQynmekcAUssiD":false,"2MzbPW1mRWXkkBE2ofukUQXZa6ozvqimPG1":false,"2NCobP6FmmriZKN2na8pT1ZBkBad7exau5N":false,"2NF9HZSsKpQSqYvRmyyAoQQTLvnERmDnCJd":false,"2NGY92p2VuGpnGNjEQe149pqzkdcxHCcLxU":false,"2N4n2EWzDNozEDxyfzKwMjhv7cXXXNAuJBw":false,"2N4Xbx38uYjt2tUfYqhVwYKks6DS81pQeH7":false,"2N5DyZnXMfPCnNFACPSD4XNeWHtxrLgheGQ":false,"2MwcEs68evEBEzQLc7D6xonB3gKmCqEb3VE":false,"2Mxo1G3tHJgwFEMt49SqxxauyoMFMAF8kmF":false,"2Mzhyq4SjpL6gZJbvwnzazmb8RxdLRn1XY4":false,"2Mu7RgWt82XuvwWMLNVE2ur5fbYCSQnP2eq":false,"2NG1nYPmkbQ4sjjLzY1JLsv3wPJyVqH3nYf":false,"2N5inBrLLdgGyJgptJvPFi1w8ZkrsRw1DqW":false,"2NCSj9Ki6hRkiD8mVjHLBqCShzhiUb4AW8c":false,"2MzBzn5xEJmcaYubKPnFUFjHQi3JEGFLhg9":false,"2MuDfViyXNinRxvyjCUEpAW7iMdexg6nzrJ":false,"2MsgwWXRsuNoo7eTzSDSy6bpbbWrMDwbqfR":false,"2MwJDSSv7pSAZq4M3nhkRedydihzKr9Vvjx":false,"2N5ziCLDhupPNhBsg1jLp6FSw9XfPkpHCDR":false,"2N36yA5XZeuGnJgLmL71stQRavZEs6b2tjY":false,"2MvXdqzXNJAPoXZTyaqnrzf5zM16XyJBWN6":false,"2NBBPucUX24QFYEbyi3p5uWD9DaHhhDtWoE":false,"2NAAxenvJmd3v7K5gj2GvySFjfgRAak7m3Q":false,"2MuxFTPd54PtR8jDMDd9rzvK79qhTTVss3a":false,"2N6tcRp2kN3eJyUvzR4kY3bnGhFv9DTafRd":false,"2Mwqas93AGzL8JQBXPn7WeCt16q6YMJXg4E":false,"2N6bRzh5HGDUqw1jEsCzuWYz1BwPJqSM6TC":false,"2MzfX91KUkB9Yx4k44k1cdqc4THwbhApa4a":false,"2MvKN4v394HasuRTRvBWtdkkSUzE9tKKkxr":false,"2N41ctEYgrYzZ8VouNCmeKjLrzXQKWmnjDP":false,"2N6RbxwiWjZ3QyP2bo4ta1G2ScLN6jcBaju":false,"2NAXgNTNpFa2nVUxXCk85pb3J4AjL3WaEsM":false,"2NBpadBMWkanCPL7W2HfTqGL64iJipVQ4WB":false,"2N5sRcsjyMAHRKLnnPMweLt66YzDMcuTVC2":false,"2N3c5VndeJrNDrVreN5xZtKsLiGb73UT7uJ":false,"2N9TnkEMNsNrUcHnCLjBwXyqGAcKVs729FC":false,"2NEkuQdbjkvXz68zE8nPfL6SN2tv3nq8QPK":false,"2N2AQr9jr8fkaJTfh2Vtx7wYBpMQrLgWD5j":false,"2MzHhzSBae1qqHsbjnLk6RgXwKe7xNBuMkW":false,"2N4cHKJbGCuBZTSMh7RwU7F7iFsNaNEkaT6":false,"2MsQT5weLaceM5nZWFKYBNuK7rtJpiCuL1M":false,"2NAYrYLJmbvSdrWWeA4oUuqcieUtEcjF9Pq":false,"2MwmGUfQYVfxGPH4qp5WsW1VPS1Bh3HkWc6":false,"2NCqsG8bgJ6g7EuA8diMHPhq4Bu58UHYCnc":false,"2N638nCgvgeiwTSiFJ4V1R24pqnKDfBosqH":false,"2MtjjNxHaWWFiWUt3Db3PU8dPohRoMKgZfm":false,"2MtjAxYQQsdXiG96vUac9iNw3xy11R2j9VA":false,"2MvugW6pX1SaqXU58yDTsJmRDosaJ2mWRtv":false,"2NBr7WHPz7oPqig5n7JN1G545K2N1CWAvYu":false,"2Mx4UDSYeN4cmhMPx6VLXbDQ4P4faPkWgih":false,"2N3JgpWntUpApjfW6cv4KxsASPgJbYDySYP":false,"2MtS64nyhXcgUVP1LNSxD3b6L8yrqB9KhjY":false,"2MuAfEyEHcmdmnHD6Edwg391qaDW1S85E4h":false,"2N693i7JTKx1xXUeAYbDmh7Uhj4zBiHccxh":false,"2NEMEYgaezunQZWJr7Ezg9WBVxuM3B3S4ac":false,"2NGLtNZhvp92vMV1uruWg7uw5AXmjjZrkvs":false,"2MzvZGMJZ1ienAnLmKmiU2xrnJ8gzGoaQHT":false,"2NCojkJdUhXKmVLQQyPnfakHn5k8bvUFsKh":false,"2N53J6jSqJruYXDDmgtw89849TVig7yeWGP":false,"2NGV7nrdfxfGLnwLrdQxYaga8JjzVhASvfZ":false,"2NG9hP4pGpPaFGzNAFZbAtsjCmn2FKb1Zpr":false,"2MztRGcL74pzPhCJdQbeDZ8KXFFSfGQbUNd":false,"2MvHCXg45LBHkSh1ZPKgDZzNngC7veqsMfZ":false,"2N72iAx88ob9RiDx8kweqA8umoRMjRY9HJN":false,"2NDtkPqP5g1mREubwHnzxvLeiG1wgLKoXSm":false,"2N5gzMWAfcKJZQ1EizxkeETgCJY7s4LApBo":false,"2N6ykqZDexqaUMoBReHtMVeCVrjfKTqePLt":false,"2MwpbvktYBKUUrpFj3aJiPgvcY47DmcUQcr":false,"2NFegdrY7Q614Tv5F7qaU2pEPK3CNt7NuqL":false,"2N3cvnPrT74CkmEtvgwSSbyjVi9DL6Mbjyv":false}}',
			)
			.post("/api/wallets/transactions/unspent", '{"addresses":["2Mzq2GgWGQShdNr7H2hCxvC6pGrqzb64R3k"]}')
			.reply(
				200,
				'{"data":[{"address":"2Mzq2GgWGQShdNr7H2hCxvC6pGrqzb64R3k","txId":"8b4f152b355ad2eedfa471de291b58bc91852e0a7ce9c16e17debf6a0ac89b6c","outputIndex":1,"script":"a914532d3dfa1c6c413a385f216ed2c2b51deb7aeddd87","satoshis":81000},{"address":"2Mzq2GgWGQShdNr7H2hCxvC6pGrqzb64R3k","txId":"002dd704b3df4eaa31abcadd2f60f7b47288d31595f8b83b49d13d64a0a12904","outputIndex":0,"script":"a914532d3dfa1c6c413a385f216ed2c2b51deb7aeddd87","satoshis":100000}],"links":{"first":"https:\\/\\/btc-test.payvo.com\\/api\\/wallets\\/transactions\\/unspent?page=1","last":"https:\\/\\/btc-test.payvo.com\\/api\\/wallets\\/transactions\\/unspent?page=1","prev":null,"next":null},"meta":{"current_page":1,"from":1,"last_page":1,"links":[{"url":null,"label":"&laquo; Previous","active":false},{"url":"https:\\/\\/btc-test.payvo.com\\/api\\/wallets\\/transactions\\/unspent?page=1","label":"1","active":true},{"url":null,"label":"Next &raquo;","active":false}],"path":"https:\\/\\/btc-test.payvo.com\\/api\\/wallets\\/transactions\\/unspent","per_page":15,"to":2,"total":2}}',
			)
			.post(
				"/api/wallets/transactions/raw",
				'{"transaction_ids":["8b4f152b355ad2eedfa471de291b58bc91852e0a7ce9c16e17debf6a0ac89b6c","002dd704b3df4eaa31abcadd2f60f7b47288d31595f8b83b49d13d64a0a12904"]}',
			)
			.reply(
				200,
				'{"data":{"8b4f152b355ad2eedfa471de291b58bc91852e0a7ce9c16e17debf6a0ac89b6c":"0200000000010192fe603fc7ad46549a47f66fed8d1265bd12e135f0657bbfd8d839888fd0c0f40100000000feffffff02e4f2c6eb00000000160014a1dcb4f5d6c16066155bbda7bdca72c3b4dd6521683c01000000000017a914532d3dfa1c6c413a385f216ed2c2b51deb7aeddd870247304402206052f3392a9886eefc0ee27864021e8be3dadeb089e8cd4aed352a203f9649f502202b778ef60669b46bf38ff4dbdeb3304854393173987e2e95963aa35a21baa288012103e5b942ce33a7fb43b161342e014d8e1395a872e716ca7b2794369636ffee547849042000","002dd704b3df4eaa31abcadd2f60f7b47288d31595f8b83b49d13d64a0a12904":"02000000000101326683d547d76fff487958bd73f0dcad90b9828d29c373f91771dea274a33fce0000000000feffffff02a08601000000000017a914532d3dfa1c6c413a385f216ed2c2b51deb7aeddd87fab86b000000000017a9145ca092c6ad33d1b8e56e78d634791ac843708380870247304402203c6d562030c380952130a81328c63cf969488320194009dc30c2734063f50bd50220389a7324b44538f1e697808b623db1bb34338da4be1605671629940482685e79012103823effd3ddd2ee2e120edc073c4bc9e7cdb8498c6f717be1036dd232037645bf49042000"}}',
			)
			.get("/api/fees")
			.reply(200, {
				data: {
					min: 0.00001074,
					avg: 0.00000002,
					max: 0.00180617,
				},
			})
			.persist();
	});

	it("should generate a transfer transaction", async (context) => {
		const multiSignatureAsset = {
			min: 2,
			publicKeys: musig.accounts.map((account) => account.legacyMasterPublicKey),
		};
		const signatory = new Signatories.Signatory(
			new Signatories.MultiSignatureSignatory(multiSignatureAsset, "address"),
			multiSignatureAsset,
		);
		const result = await context.subject.transfer({
			data: {
				amount: 0.0001,
				to: "tb1q705a7ak4ejlmfc5uq3afg2q45v4yw7kyv8jgsn",
			},
			signatory,
		});

		assert.is(result.id(), unsignedLegacyMusigTransferTx.id);
		assert.is(result.sender(), "2Mzq2GgWGQShdNr7H2hCxvC6pGrqzb64R3k");
		assert.is(result.recipient(), "tb1q705a7ak4ejlmfc5uq3afg2q45v4yw7kyv8jgsn");
		assert.is(result.amount().toNumber(), 10_000);
		assert.is(result.fee().toNumber(), 330);
		assert.instance(result.timestamp(), DateTime);
		assert.is(result.toBroadcast(), unsignedLegacyMusigTransferTx.psbt);

		// Now make participants sign their parts

		const wallet1 = {
			signingKey: musig.accounts[0].mnemonic,
			path: musig.accounts[0].legacyMasterPath,
		};
		const signatory1 = new Signatories.Signatory(
			new Signatories.MnemonicSignatory({
				signingKey: wallet1.signingKey,
				address: "address", // Not needed / used
				publicKey: wallet1.path, // TODO for now we use publicKey for passing path
				privateKey: "privateKey", // Not needed / used
			}),
		);

		const signed1 = await context.musigService.addSignature(
			{
				id: result.id(),
				...result.data(),
				psbt: result.toBroadcast(),
				signatures: [],
			},
			signatory1,
		);

		assert.is(signed1.id(), oneSignatureLegacyMusigTransferTx.id);
		assert.is(signed1.sender(), "2Mzq2GgWGQShdNr7H2hCxvC6pGrqzb64R3k");
		assert.is(signed1.recipient(), "tb1q705a7ak4ejlmfc5uq3afg2q45v4yw7kyv8jgsn");
		assert.is(signed1.amount().toNumber(), 10_000);
		assert.is(signed1.fee().toNumber(), 330);
		assert.instance(signed1.timestamp(), DateTime);
		assert.is(signed1.toBroadcast(), oneSignatureLegacyMusigTransferTx.psbt);

		const wallet2 = {
			signingKey: musig.accounts[1].mnemonic,
			path: musig.accounts[1].legacyMasterPath,
		};
		const signatory2 = new Signatories.Signatory(
			new Signatories.MnemonicSignatory({
				signingKey: wallet2.signingKey,
				address: "address", // Not needed / used
				publicKey: wallet2.path, // @TODO for now we use publicKey for passing path
				privateKey: "privateKey", // Not needed / used
			}),
		);

		const signed2 = await context.musigService.addSignature(
			{
				id: signed1.id(),
				...signed1.data(),
				psbt: signed1.toBroadcast(),
				signatures: [],
			},
			signatory2,
		);

		assert.is(signed2.id(), twoSignatureLegacyMusigTransferTx.id);
		assert.is(signed2.sender(), "2Mzq2GgWGQShdNr7H2hCxvC6pGrqzb64R3k");
		assert.is(signed2.recipient(), "tb1q705a7ak4ejlmfc5uq3afg2q45v4yw7kyv8jgsn");
		assert.is(signed2.amount().toNumber(), 10_000);
		assert.is(signed2.fee().toNumber(), 330);
		assert.instance(signed2.timestamp(), DateTime);
		assert.is(signed2.toBroadcast(), twoSignatureLegacyMusigTransferTx.psbt);

		const signedFinal = bitcoin.Psbt.fromBase64(signed2.toBroadcast());
		assert.true(signedFinal.validateSignaturesOfAllInputs(signatureValidator));

		signedFinal.finalizeAllInputs();
		assert.is(
			signedFinal.extractTransaction().toHex(),
			"02000000010429a1a0643dd1493bb8f89515d38872b4f7602fddcaab31aa4edfb304d72d0000000000fdfe00004830450221008e49b68e58a819e5e7199f69ca7aea8a0e83c137aa5d63334167f46263d13fa302203bbc8490e10e91a66cbef8dee64e41f46436caf5815702109211d3a37fa651fd01483045022100a1dcf290034f8f177b6069bf0b10b11c0d37c5dbdc6d9ff189cfb69d06026dd702200db05bcc907117d506af47a5648bfc81fc5a58e0766c1076401e5b4debfbb565014c69522102685c2d9e7743b278d57b8de9c81c4478737eb3453fe59e51b1e20020c583395621029015af20164d731b612990bee7a995c032abba83fa186a3ae3918f996f2173402103970f2c616181063e26fd970b9bc1308a78986f3f59053e554b1f297bde8e3d5053aeffffffff021027000000000000160014f3e9df76d5ccbfb4e29c047a942815a32a477ac4465e01000000000017a914837ca148b6a9559bd170cd99650fc3f1107c4ebc8700000000",
		);
	});
});

describe("p2sh segwit multisignature wallet", ({ afterEach, beforeEach, it, nock, assert }) => {
	beforeEach(async (context) => {
		await createLocalServices(context);

		nock.fake("https://btc-test.payvo.com:443", { encodedQueryParams: true })
			.post(
				"/api/wallets/addresses",
				'{"addresses":["2Mv8e5hWoFh9X8YdU4e4qCAv7m4wBCz2ytT","2MtQ9HwWz8wvax9YNLo3S35tcGWZMYTWW1B","2N9kwKrsHVgnTuTiTSqVoXoxk4nUGKSscey","2N63d778E43JWTa7yUtD7vS8YJn5n8Nfw7j","2MusbEv7ki5s1nQ3VJCtJ6zYr78PXtpzzGx","2N4LfpVsEyjcDvUNtHLdZCEUXPoW7D2QqLJ","2MxMHtPk2LBorEcPbfVGD7FgcKLeY5mnz8h","2NChVE97cYrdSo7KtC52gpfcadykbRU1QLL","2MssW4Smgz8NhgeGTnXQH5n79be8bVA9Z2J","2Muf4vBSVsbTtFmbymBkjEMJnjk9GGXocNs","2MteHjmju1aTHdEExVjHaQDpnNvMbS1eCYR","2NB8WS2q9AAfZf8LTqtL55FeiZ6A5He2Hib","2NFCuxxPQCErmJmvooLxfdydoJhWDhk2J5u","2NAGETNk2bnKkMhDHUZCzH2F3Af2gbdGCNe","2N5PZDaKmcM51SKRDT7vV4rJ2uixgeXGS1f","2N2Rbm9kYYpRNuJfGHcnb8PU2Hx3TsTDDMW","2N559RGP824hq3mkrmf5QZYtNb6rQkugV2m","2MsxH2shVEgcGSDKQwdoCNxYmDEU4t6H6gg","2N51z4vR1UU2i5f3ZcMSbYNXBdAMvPMgkHv","2NFEXJ21jVzJbFJ1pB5oitnRDmVkthqZM8d","2N6tQNP16aYZb3Xh5CTpKMStmWUHFT32sRe","2MyiiZAztyqakB14CiHeAZqqxSACu73Yc5R","2MwKXPNqumersjzWZh5BU5pvsag9X2xAcL5","2N1AKM2pZEmAy25iPGBDfkvENAQMbokGxE1","2NDo2sc6XhsCEqCNF97gr7uzrXcBv8gdRMV","2NEiAjpp5X6k7wDytx6oyJu22V5JKBGup2N","2N7Qn4XBjSDgEDnZRwRQNRKMKtfX4e2ovp8","2N4ytaAni3NEfu8K3F6yHyGSRxEnBbLPpFw","2NGDp9YWBBRWwcW6kRJMbBxjL6iDQHKhzDW","2Mx9R7LgcU2N41uhr5tWhznoJM7bKbxYkJ8","2N28fARc44TPZ5afbjj59WFERshqyKcDK7a","2NFUNB7widPqtMZhmFpSysVZZbWtn8G71HC","2N4KeoxHETQGMSzpW3Q8ZZbeyEAwuTYVAVF","2N3XiCJ24dopacSvMjV4BGHAtcW3cn7zAmv","2N2ZEfUtXkb4eEWu5M2qpfHstKXkdgZGPwc","2NE1MA4wCRAc6AFtEwBZ5w1UZqZoSk3FpEB","2NCYnPg8QNfMocUshxxvBaRTaTQoomGDe4A","2MtEhjJBext2s3hGuD9FB3t2xqXgqKmwhCF","2MvpM6Fe8mCj4C7nSrceHFFYwRZuibEKe2B","2MziCoxdaprPAkWzun3B5ioDwBG6mqzodmu","2NDq4g3geveBiQTBYZs1PYwqXqGKYZ98FPg","2NCPnpDKwRkfZfC8BXTYXEAuJFF8gs244wu","2NEG9dNurWNeYBd3EW6vjQVdot3DyaZVbph","2N9VrzQyBsUmZJX2zRTz4vtXeyFTKNwggCH","2MzhHTFH4HPk5exNDR8uMk3KLJm1gtFLKdg","2MyirN9mKe7CQkTYfsLcH1VdLdWFQXGrajT","2MwKk6pCKpWsexEtBMj5G4fBuc3pZHDyV8h","2MznSTC6k6WSwnXawoerW859T2BVDJYm4Fk","2N6RWLU3CAc1KnbE4HX3EEQS1qrZn4Hx6ih","2MsMoFZ76mjgLQQatPGHQrFTeG7dyMxPfV9","2NDsiBvb251gZrbfHBuhTjZ1X156gmYqiXK","2N726ABoeWEh3xaXrvLAAr4CSZrHnKD51JJ","2Mw2qnaq4zmayD9ct2ng4cRBP36kZVG7FLE","2N9YyWaLHPqNanNw8bu1uDaWERBzLKzpBx3","2N3KAwcaR9yFkK4cv55RGRxs99F2Mou26np","2MzU1bSjZwnaoHMuj8mL5p1S6LYsQhvanh2","2MsrmMK7F6HKthwLrD5qd8Qw95HwV7GXB6n","2NB93wCKg9Gz1eSHBPvaXe7gPbLtrC5ZSMi","2NAh4zvHYX92kWVDMXibwsEfimnUJwLWNMD","2NGCKjKZQjRgm3QBJhGakxM5SbnnjaoZ4mz","2MwVAfxhgymM4kj3d3o6ze2qsygeM32Bh5g","2N367GUW38H74DYxrM2QwTQ8Kv8G7NQPsC9","2N28x9tFLTVvjrM6NppRhwTKZNeLyyH3YG7","2NAdji8hRJopDorgUiQoPfRATEoihj1vNPU","2NFBDRaEJcmRGuzHMFUEFrp56GdBJg3zmy4","2MzcB7U1fdXK8bGeqZjHqzLUTC79v8PSubq","2MwraVaJYSWHCPkPTjk2TGKQaEajaYgmKtH","2N9WEg3SSjPJK3xYTNPTCdfxhefytVzYj2V","2MxeTviLN11wd52LSxVxbVjEYdyL3JSU5e4","2NCFfmNCyqBjJXmRsvHFGai62NugzAziXQs","2N4S1gtZ1mKXmeZVjfQX8d5oMPD6vqUwdMe","2Mz8AbkpMrcamjj79cakejMRL2Xy7cytNc4","2MuUNLaRrFwyex8qNew2pXEuofvFsEDWtn4","2NDnQa9Q6gRjrcwpPs2kPjr6dKpNfCo1UxD","2N6U3ZVA7kk4Kdp8gMnbEmstr7VkmesYGJW","2Mw4bv1p8BvtHqUoDBftLabs1Hph9HwvNB7","2N1mfFNZ22tszgr5v5Yvu6ogmp9Q5UoR9xj","2Mxz9UCoPv7QH96AcWHhdwg4mjowGR3cYYc","2MxokwYeSef4SKUMvt1CxCxoPNVePFxCsu9","2MwpS346JKGdPb5iDjbdKrryT8LSzEGH589","2MseoYhkf4SzhhFjszK59fDAeKuxuvXMooM","2N3LignBrJ9owsuPA8TKwphEDM9p2f12EKY","2Mz5nLpfiUZRQsZ9134phtNMEwYnGSE8ynz","2MspwCE3QKPMsYJEaRfuts9nXiYjdwHep5n","2Mtg7bcTPfJD97ibdVS3GwxsFjAfi4R3K1H","2NGMFAC3BkeKLSEEqfejfumCQgaiNnoCx2o","2MxWsLtirfUneEa9PgKLMYHvigYEgMaP6ag","2NAcwwnYjfpX4uqXs6XAcj6tis1DZX3VRUn","2NAdmk1exVoiH89qK3eUcnxUjWpdhDbhvyK","2N13cCQQw3BVeeGhDo7p8VBzRN29t9f3Zv2","2NG6dGumkFJ2rDL1e61ssgMV5pY4CgymuzM","2NGMurgGA5RPZwtXNf7Lrh76UJR86eLddQ3","2NDTVLFXAT1YEpAdse4uo457KAP3Hq6fAUM","2NC5ZC4JQ3sqVHBJH2TpH2hmtN735qQb2BT","2MsYoWCqBDJc6u5j8r7uHSVeyabKVwQ3Utp","2NATi3q4s1KwBtE58TKULRfbLnrT3Xsh1kY","2MskUTAg9sHWqGoEHWRcjYdr4tMNb8No7Mb","2MsYDVZCe7bzLWhdsYx6CB98VtonE42QpA2","2NCMtoLEw4qfR2yxyjaqauRVgsc9ykrG4fm","2N7QVnyRtpWUbnJn9cwwpRGsNFA5G42EbSk"]}',
			)
			.reply(
				200,
				'{"data":{"2Mv8e5hWoFh9X8YdU4e4qCAv7m4wBCz2ytT":true,"2MtQ9HwWz8wvax9YNLo3S35tcGWZMYTWW1B":false,"2N9kwKrsHVgnTuTiTSqVoXoxk4nUGKSscey":false,"2N63d778E43JWTa7yUtD7vS8YJn5n8Nfw7j":false,"2MusbEv7ki5s1nQ3VJCtJ6zYr78PXtpzzGx":false,"2N4LfpVsEyjcDvUNtHLdZCEUXPoW7D2QqLJ":false,"2MxMHtPk2LBorEcPbfVGD7FgcKLeY5mnz8h":false,"2NChVE97cYrdSo7KtC52gpfcadykbRU1QLL":false,"2MssW4Smgz8NhgeGTnXQH5n79be8bVA9Z2J":false,"2Muf4vBSVsbTtFmbymBkjEMJnjk9GGXocNs":false,"2MteHjmju1aTHdEExVjHaQDpnNvMbS1eCYR":false,"2NB8WS2q9AAfZf8LTqtL55FeiZ6A5He2Hib":false,"2NFCuxxPQCErmJmvooLxfdydoJhWDhk2J5u":false,"2NAGETNk2bnKkMhDHUZCzH2F3Af2gbdGCNe":false,"2N5PZDaKmcM51SKRDT7vV4rJ2uixgeXGS1f":false,"2N2Rbm9kYYpRNuJfGHcnb8PU2Hx3TsTDDMW":false,"2N559RGP824hq3mkrmf5QZYtNb6rQkugV2m":false,"2MsxH2shVEgcGSDKQwdoCNxYmDEU4t6H6gg":false,"2N51z4vR1UU2i5f3ZcMSbYNXBdAMvPMgkHv":false,"2NFEXJ21jVzJbFJ1pB5oitnRDmVkthqZM8d":false,"2N6tQNP16aYZb3Xh5CTpKMStmWUHFT32sRe":false,"2MyiiZAztyqakB14CiHeAZqqxSACu73Yc5R":false,"2MwKXPNqumersjzWZh5BU5pvsag9X2xAcL5":false,"2N1AKM2pZEmAy25iPGBDfkvENAQMbokGxE1":false,"2NDo2sc6XhsCEqCNF97gr7uzrXcBv8gdRMV":false,"2NEiAjpp5X6k7wDytx6oyJu22V5JKBGup2N":false,"2N7Qn4XBjSDgEDnZRwRQNRKMKtfX4e2ovp8":false,"2N4ytaAni3NEfu8K3F6yHyGSRxEnBbLPpFw":false,"2NGDp9YWBBRWwcW6kRJMbBxjL6iDQHKhzDW":false,"2Mx9R7LgcU2N41uhr5tWhznoJM7bKbxYkJ8":false,"2N28fARc44TPZ5afbjj59WFERshqyKcDK7a":false,"2NFUNB7widPqtMZhmFpSysVZZbWtn8G71HC":false,"2N4KeoxHETQGMSzpW3Q8ZZbeyEAwuTYVAVF":false,"2N3XiCJ24dopacSvMjV4BGHAtcW3cn7zAmv":false,"2N2ZEfUtXkb4eEWu5M2qpfHstKXkdgZGPwc":false,"2NE1MA4wCRAc6AFtEwBZ5w1UZqZoSk3FpEB":false,"2NCYnPg8QNfMocUshxxvBaRTaTQoomGDe4A":false,"2MtEhjJBext2s3hGuD9FB3t2xqXgqKmwhCF":false,"2MvpM6Fe8mCj4C7nSrceHFFYwRZuibEKe2B":false,"2MziCoxdaprPAkWzun3B5ioDwBG6mqzodmu":false,"2NDq4g3geveBiQTBYZs1PYwqXqGKYZ98FPg":false,"2NCPnpDKwRkfZfC8BXTYXEAuJFF8gs244wu":false,"2NEG9dNurWNeYBd3EW6vjQVdot3DyaZVbph":false,"2N9VrzQyBsUmZJX2zRTz4vtXeyFTKNwggCH":false,"2MzhHTFH4HPk5exNDR8uMk3KLJm1gtFLKdg":false,"2MyirN9mKe7CQkTYfsLcH1VdLdWFQXGrajT":false,"2MwKk6pCKpWsexEtBMj5G4fBuc3pZHDyV8h":false,"2MznSTC6k6WSwnXawoerW859T2BVDJYm4Fk":false,"2N6RWLU3CAc1KnbE4HX3EEQS1qrZn4Hx6ih":false,"2MsMoFZ76mjgLQQatPGHQrFTeG7dyMxPfV9":false,"2NDsiBvb251gZrbfHBuhTjZ1X156gmYqiXK":false,"2N726ABoeWEh3xaXrvLAAr4CSZrHnKD51JJ":false,"2Mw2qnaq4zmayD9ct2ng4cRBP36kZVG7FLE":false,"2N9YyWaLHPqNanNw8bu1uDaWERBzLKzpBx3":false,"2N3KAwcaR9yFkK4cv55RGRxs99F2Mou26np":false,"2MzU1bSjZwnaoHMuj8mL5p1S6LYsQhvanh2":false,"2MsrmMK7F6HKthwLrD5qd8Qw95HwV7GXB6n":false,"2NB93wCKg9Gz1eSHBPvaXe7gPbLtrC5ZSMi":false,"2NAh4zvHYX92kWVDMXibwsEfimnUJwLWNMD":false,"2NGCKjKZQjRgm3QBJhGakxM5SbnnjaoZ4mz":false,"2MwVAfxhgymM4kj3d3o6ze2qsygeM32Bh5g":false,"2N367GUW38H74DYxrM2QwTQ8Kv8G7NQPsC9":false,"2N28x9tFLTVvjrM6NppRhwTKZNeLyyH3YG7":false,"2NAdji8hRJopDorgUiQoPfRATEoihj1vNPU":false,"2NFBDRaEJcmRGuzHMFUEFrp56GdBJg3zmy4":false,"2MzcB7U1fdXK8bGeqZjHqzLUTC79v8PSubq":false,"2MwraVaJYSWHCPkPTjk2TGKQaEajaYgmKtH":false,"2N9WEg3SSjPJK3xYTNPTCdfxhefytVzYj2V":false,"2MxeTviLN11wd52LSxVxbVjEYdyL3JSU5e4":false,"2NCFfmNCyqBjJXmRsvHFGai62NugzAziXQs":false,"2N4S1gtZ1mKXmeZVjfQX8d5oMPD6vqUwdMe":false,"2Mz8AbkpMrcamjj79cakejMRL2Xy7cytNc4":false,"2MuUNLaRrFwyex8qNew2pXEuofvFsEDWtn4":false,"2NDnQa9Q6gRjrcwpPs2kPjr6dKpNfCo1UxD":false,"2N6U3ZVA7kk4Kdp8gMnbEmstr7VkmesYGJW":false,"2Mw4bv1p8BvtHqUoDBftLabs1Hph9HwvNB7":false,"2N1mfFNZ22tszgr5v5Yvu6ogmp9Q5UoR9xj":false,"2Mxz9UCoPv7QH96AcWHhdwg4mjowGR3cYYc":false,"2MxokwYeSef4SKUMvt1CxCxoPNVePFxCsu9":false,"2MwpS346JKGdPb5iDjbdKrryT8LSzEGH589":false,"2MseoYhkf4SzhhFjszK59fDAeKuxuvXMooM":false,"2N3LignBrJ9owsuPA8TKwphEDM9p2f12EKY":false,"2Mz5nLpfiUZRQsZ9134phtNMEwYnGSE8ynz":false,"2MspwCE3QKPMsYJEaRfuts9nXiYjdwHep5n":false,"2Mtg7bcTPfJD97ibdVS3GwxsFjAfi4R3K1H":false,"2NGMFAC3BkeKLSEEqfejfumCQgaiNnoCx2o":false,"2MxWsLtirfUneEa9PgKLMYHvigYEgMaP6ag":false,"2NAcwwnYjfpX4uqXs6XAcj6tis1DZX3VRUn":false,"2NAdmk1exVoiH89qK3eUcnxUjWpdhDbhvyK":false,"2N13cCQQw3BVeeGhDo7p8VBzRN29t9f3Zv2":false,"2NG6dGumkFJ2rDL1e61ssgMV5pY4CgymuzM":false,"2NGMurgGA5RPZwtXNf7Lrh76UJR86eLddQ3":false,"2NDTVLFXAT1YEpAdse4uo457KAP3Hq6fAUM":false,"2NC5ZC4JQ3sqVHBJH2TpH2hmtN735qQb2BT":false,"2MsYoWCqBDJc6u5j8r7uHSVeyabKVwQ3Utp":false,"2NATi3q4s1KwBtE58TKULRfbLnrT3Xsh1kY":false,"2MskUTAg9sHWqGoEHWRcjYdr4tMNb8No7Mb":false,"2MsYDVZCe7bzLWhdsYx6CB98VtonE42QpA2":false,"2NCMtoLEw4qfR2yxyjaqauRVgsc9ykrG4fm":false,"2N7QVnyRtpWUbnJn9cwwpRGsNFA5G42EbSk":false}}',
			)
			.post(
				"/api/wallets/addresses",
				'{"addresses":["2N3WVdraaxhMKizN2EQ4p6QaZupBXs6dnBp","2N9iWAxKvU7PF4nKqFX1j57f1rxFXoaVW8Q","2N1WTeWAJmMmsRL4VFnTEtL6jphUEPTJSvB","2MvrXDUi5eiD5awfXvemwjRswSBv2eFXHzS","2NF28HxRkDANWccZagmZSoUdm2ufhbg9SiV","2N2wSa9ejRCGkENq46LKWTPkrazmJ7APDQ7","2N7mXbicHHUCTfMDSoci3unSdUDAtGynsnX","2ND7yWqe24VSCeRyzWh8uvJ6bTupJKET9pm","2MsktuRCFnw4gX5t5vwvDTM1XSKP8ZX2SmC","2MyfE5Mrcxe6PX8QESYD5QQu9msZ9X55FTE","2ND6USaDrtxRGWJaawK9CxW3oqMnzLEtggT","2N8Tz7wTu8iTSQjPDbh72JqvkTqrMrqEk1E","2NDnQ7NrzLfnza7eKMBAF1L4AEquU9DhvaL","2MxMjGvJDnkAvEZJizfwDyLYC3cPPcXTCMw","2N6XVdy2taBf2mZoprZPYHyADd29q2HPGzr","2NGEiXNJ4YCyoWb28BCadNdLNfPH7TCKQvD","2MyvvmfSzUkCK2vZSL1utNHeevdhWuYd5SZ","2NEipc25kv7JSyqDxooNoiixyZcfaPb6LrU","2Mvg3hNbqV6aoZRVhtBoF3jZhjt6jZaDcbx","2NArckRgbNz1HJU1caMwqTptQRALoxsb54H","2MzVBpTfWpE3TEWdsVFzLts757wqVzwAj36","2MuWuSrduLbo4366Ts1kPzY42JC5EW1Uqx4","2MzQkAuZhHoL5bsQqKMBYQ7v1aU58Vrsju6","2NFdEBa9MpZ1WUJfQ5PwsmK72FVcY15drCA","2N9QeEWHkX7FjaAx8VX86ebkUw8b2u9Ugns","2NCJoKZDoU5PrpY7rZGFcMmtHoCjEM4N6Jn","2NFRF6XcN5tYYha9ksyHEAMpz2nMXigqCkh","2N2oyH5SY5ALeeJ7kHbBmA3tqyd1BpxtJDC","2MxtPCvPpdkrKtjArN8xBw7vYpp8gRcnLtk","2Mt2SYbdsz88YJkApru8kQGsb9A8NwaWa6R","2MsFf9oTYCN6A88m64aBrRWxDuYnhY8LhCf","2NE2a47G68Z8hEKyx4HanDEoFEyAwjoAQPF","2MybQcCbYWrCpNug3dF8abtDg5TUpbhUmwv","2N9uD5sMZNSwNqQC4Lbs8gao2uENWe7Xfj6","2N3noEDHhbWCY4AGWBJubg9ZboFE7rmDiSw","2N2AZZb2a1zyX1y3oV3rrbsxhza17n6hu72","2NAA2cZf1QbLGrUSdoe5nEhie6RGqcCT6yn","2N5bvZuPBCaM98UvHLwpF79Eqb35D54ju1A","2NEn9tySk495UsiFEQUZ1EpGPLnUcuXn5gL","2NGXfi2xpEtGpfd46eGhk4pHfS922p169cY","2N2LCTS9pRoNcTDzQ4fPsBzoUhYNinWtDq7","2MuJaayxBjCwWoiU3mLLC6tzYBXbCrkEHEg","2N6wez6e7WNtvXCitHiGquURWUhx5gaWwCQ","2NALMzkgCdCdZjJ3FDi1ZTs4fytZizWV4C6","2NAaA6mLPinaZHgqNSk4EyBnLrwHNGwF8RW","2MusHf5YRKHamufhEoKJbENeULhByWJZG6q","2NGBt2pJTWTaXMUG5YXSgsudwUw7Yc62daK","2MwZPfo2CdrEfnM2nLebParUYTUPhCmjsW9","2N1YUQ474uXSnQPjxtVe443NFwHJAwbudcf","2MsyCJ3UqKK41CGtxSjtRhzByZdTHr2kk2a","2NAiBdmiESWdwLe8dyZN3PuSCerRBZNNyfA","2N4q2Toms5v1mHQXdExBgjEHgp85b2gtGTp","2NDg7QvmooMAqfpeDK9psVTZFBmVBqYWPrb","2MzvfTr2Mwc8pSjUUejogV7eHuwfpnwhV4v","2MtigfuU3RGzVSnJ39RUwUh3YqWmpfaTDiT","2Mu1oPtKcEXZhtepbwb4tUsVASJzqH4hNSq","2Mv16fxEx86b3A5mzRHs3npNGuc299AxZiF","2Mu46rVuW2NrHAR2u81nm6fjPt9zFQeY51h","2MucX4Q3vtZxjNJ9TZq3MRgJ9YG3oDW4Bc1","2Mxwe4mC4Gx4bS3aVfJb5JXvShTMzJns7mK","2NBNy8fY7PxRoXuTNY2dZP2gVrciS99BDeD","2N3Kx8HKjm7jmpYnw5e5nTCAchNfXA8wrd5","2N92KesQaBe4SqaBFrTDC6wZSNk6GD7u1xL","2N5o5BKkVTKzbj9XtTyzGgcVefobgHr9ge7","2NBFnGxSru5sb3fvjLJ6PPZTDEwy9Bdwt3i","2NAAni8SjuD4VpiH3V1mwrASAxrKq4EgMkh","2NDWCVUGcEh8LGxuHKZ9Bt1Yiuqmw1NM47c","2MvvNqsxgrpoHpg9Wou9RtGJg6RnLbACofV","2NG66Jha6GNKuFA2JU7vQiuwcso22XSN917","2Msqo3FMT1kvud7myveWKsqQthphVx3ThcD","2N8iP1ztgwaZrabb1rxcz8mdmy4vC96vpcv","2Mtek29dwe56AwcGrMc6r1gYUH2ZqPzpRMW","2NCANRxoJg5Nay1Dfp4yaBLuJtJZqHGUFan","2Mzqo4JeQPuJ4AAn2i9t4Bx4UkiQKTHXBEK","2N3uZEedevrRzAZSVcKCCncxXQdt3qb13SR","2NEYDwV7t574owhhzBZaFNms9aUr2Rf455P","2Mz1snerqXV6FNHzybAazPtwr35mYBc5D1A","2N6B2jgQ9QwBB8NbiH19ja1yTCZXMb5pQYQ","2N7ckmHQWPCBWCb5NMWGtMecXBo7dMMLMpT","2NGCJ8YGqDY4rPGpNDAEwcEUJLkqW2hSGWb","2MzT19zhVo6bWvdmh8cCyUQYt9wqQcYV8N9","2NE5njg6pEAm3P6GnjALAkiWM2bXre8EUMJ","2MzC75QrSuCTjU8z31AwJYSSuV8ptYtW52F","2N5BWbmUezGe5xuSiUPt7wGRbqQWyaGrXsn","2N1ydDhZb3pTcQ3VCaeFhDfAJUX1tbH6QRC","2NFxv1aXdbqAXX7AxVGdb84ai6xMc8pvE3v","2NDFLVcRSH2odK3UgLf1kp5j4PBKVevudyi","2MxGzfn3uHsHN9gccbiZFgbis3QVEQAfvAg","2NA9wYuCEdFKVKGUG66UXuXGZZkhPaMGr4G","2Muio6we1rjv8dz6ignRqjZ2dh5HYPTaw9G","2NCwvSsbe5n149CPEP3h15F16Y9Znkk1d2F","2ND2QbNmQ24jxFc82NkNwcte9DVSSwZ6ZK5","2N5LS3Mp9xPxvKTC3WUvBvx7sKiQG5bs9Tt","2NA7tthGFCYCPVYbjCetYxX3B9acDSDN2rv","2N63UXG4hVZBgGkmoMYbbEai1c5T5yBoQR2","2MzW9FZVKC6Ekv6Ud8Hzy8kVeehRDDgZNUK","2N7Db8xTAyraY2FV9DbASnso8UEvZqDHje6","2NFWm3nfhMA9jdxU4egRhTY1RMJBshVZXcF","2NDNXDdfFB2Yr2tx2F3B6kKqcWtJYThbbVg","2NE6RLG5gSaWbFBGgPDboHJGj8g5EugycC4"]}',
			)
			.reply(
				200,
				'{"data":{"2N3WVdraaxhMKizN2EQ4p6QaZupBXs6dnBp":false,"2N9iWAxKvU7PF4nKqFX1j57f1rxFXoaVW8Q":false,"2N1WTeWAJmMmsRL4VFnTEtL6jphUEPTJSvB":false,"2MvrXDUi5eiD5awfXvemwjRswSBv2eFXHzS":false,"2NF28HxRkDANWccZagmZSoUdm2ufhbg9SiV":false,"2N2wSa9ejRCGkENq46LKWTPkrazmJ7APDQ7":false,"2N7mXbicHHUCTfMDSoci3unSdUDAtGynsnX":false,"2ND7yWqe24VSCeRyzWh8uvJ6bTupJKET9pm":false,"2MsktuRCFnw4gX5t5vwvDTM1XSKP8ZX2SmC":false,"2MyfE5Mrcxe6PX8QESYD5QQu9msZ9X55FTE":false,"2ND6USaDrtxRGWJaawK9CxW3oqMnzLEtggT":false,"2N8Tz7wTu8iTSQjPDbh72JqvkTqrMrqEk1E":false,"2NDnQ7NrzLfnza7eKMBAF1L4AEquU9DhvaL":false,"2MxMjGvJDnkAvEZJizfwDyLYC3cPPcXTCMw":false,"2N6XVdy2taBf2mZoprZPYHyADd29q2HPGzr":false,"2NGEiXNJ4YCyoWb28BCadNdLNfPH7TCKQvD":false,"2MyvvmfSzUkCK2vZSL1utNHeevdhWuYd5SZ":false,"2NEipc25kv7JSyqDxooNoiixyZcfaPb6LrU":false,"2Mvg3hNbqV6aoZRVhtBoF3jZhjt6jZaDcbx":false,"2NArckRgbNz1HJU1caMwqTptQRALoxsb54H":false,"2MzVBpTfWpE3TEWdsVFzLts757wqVzwAj36":false,"2MuWuSrduLbo4366Ts1kPzY42JC5EW1Uqx4":false,"2MzQkAuZhHoL5bsQqKMBYQ7v1aU58Vrsju6":false,"2NFdEBa9MpZ1WUJfQ5PwsmK72FVcY15drCA":false,"2N9QeEWHkX7FjaAx8VX86ebkUw8b2u9Ugns":false,"2NCJoKZDoU5PrpY7rZGFcMmtHoCjEM4N6Jn":false,"2NFRF6XcN5tYYha9ksyHEAMpz2nMXigqCkh":false,"2N2oyH5SY5ALeeJ7kHbBmA3tqyd1BpxtJDC":false,"2MxtPCvPpdkrKtjArN8xBw7vYpp8gRcnLtk":false,"2Mt2SYbdsz88YJkApru8kQGsb9A8NwaWa6R":false,"2MsFf9oTYCN6A88m64aBrRWxDuYnhY8LhCf":false,"2NE2a47G68Z8hEKyx4HanDEoFEyAwjoAQPF":false,"2MybQcCbYWrCpNug3dF8abtDg5TUpbhUmwv":false,"2N9uD5sMZNSwNqQC4Lbs8gao2uENWe7Xfj6":false,"2N3noEDHhbWCY4AGWBJubg9ZboFE7rmDiSw":false,"2N2AZZb2a1zyX1y3oV3rrbsxhza17n6hu72":false,"2NAA2cZf1QbLGrUSdoe5nEhie6RGqcCT6yn":false,"2N5bvZuPBCaM98UvHLwpF79Eqb35D54ju1A":false,"2NEn9tySk495UsiFEQUZ1EpGPLnUcuXn5gL":false,"2NGXfi2xpEtGpfd46eGhk4pHfS922p169cY":false,"2N2LCTS9pRoNcTDzQ4fPsBzoUhYNinWtDq7":false,"2MuJaayxBjCwWoiU3mLLC6tzYBXbCrkEHEg":false,"2N6wez6e7WNtvXCitHiGquURWUhx5gaWwCQ":false,"2NALMzkgCdCdZjJ3FDi1ZTs4fytZizWV4C6":false,"2NAaA6mLPinaZHgqNSk4EyBnLrwHNGwF8RW":false,"2MusHf5YRKHamufhEoKJbENeULhByWJZG6q":false,"2NGBt2pJTWTaXMUG5YXSgsudwUw7Yc62daK":false,"2MwZPfo2CdrEfnM2nLebParUYTUPhCmjsW9":false,"2N1YUQ474uXSnQPjxtVe443NFwHJAwbudcf":false,"2MsyCJ3UqKK41CGtxSjtRhzByZdTHr2kk2a":false,"2NAiBdmiESWdwLe8dyZN3PuSCerRBZNNyfA":false,"2N4q2Toms5v1mHQXdExBgjEHgp85b2gtGTp":false,"2NDg7QvmooMAqfpeDK9psVTZFBmVBqYWPrb":false,"2MzvfTr2Mwc8pSjUUejogV7eHuwfpnwhV4v":false,"2MtigfuU3RGzVSnJ39RUwUh3YqWmpfaTDiT":false,"2Mu1oPtKcEXZhtepbwb4tUsVASJzqH4hNSq":false,"2Mv16fxEx86b3A5mzRHs3npNGuc299AxZiF":false,"2Mu46rVuW2NrHAR2u81nm6fjPt9zFQeY51h":false,"2MucX4Q3vtZxjNJ9TZq3MRgJ9YG3oDW4Bc1":false,"2Mxwe4mC4Gx4bS3aVfJb5JXvShTMzJns7mK":false,"2NBNy8fY7PxRoXuTNY2dZP2gVrciS99BDeD":false,"2N3Kx8HKjm7jmpYnw5e5nTCAchNfXA8wrd5":false,"2N92KesQaBe4SqaBFrTDC6wZSNk6GD7u1xL":false,"2N5o5BKkVTKzbj9XtTyzGgcVefobgHr9ge7":false,"2NBFnGxSru5sb3fvjLJ6PPZTDEwy9Bdwt3i":false,"2NAAni8SjuD4VpiH3V1mwrASAxrKq4EgMkh":false,"2NDWCVUGcEh8LGxuHKZ9Bt1Yiuqmw1NM47c":false,"2MvvNqsxgrpoHpg9Wou9RtGJg6RnLbACofV":false,"2NG66Jha6GNKuFA2JU7vQiuwcso22XSN917":false,"2Msqo3FMT1kvud7myveWKsqQthphVx3ThcD":false,"2N8iP1ztgwaZrabb1rxcz8mdmy4vC96vpcv":false,"2Mtek29dwe56AwcGrMc6r1gYUH2ZqPzpRMW":false,"2NCANRxoJg5Nay1Dfp4yaBLuJtJZqHGUFan":false,"2Mzqo4JeQPuJ4AAn2i9t4Bx4UkiQKTHXBEK":false,"2N3uZEedevrRzAZSVcKCCncxXQdt3qb13SR":false,"2NEYDwV7t574owhhzBZaFNms9aUr2Rf455P":false,"2Mz1snerqXV6FNHzybAazPtwr35mYBc5D1A":false,"2N6B2jgQ9QwBB8NbiH19ja1yTCZXMb5pQYQ":false,"2N7ckmHQWPCBWCb5NMWGtMecXBo7dMMLMpT":false,"2NGCJ8YGqDY4rPGpNDAEwcEUJLkqW2hSGWb":false,"2MzT19zhVo6bWvdmh8cCyUQYt9wqQcYV8N9":false,"2NE5njg6pEAm3P6GnjALAkiWM2bXre8EUMJ":false,"2MzC75QrSuCTjU8z31AwJYSSuV8ptYtW52F":false,"2N5BWbmUezGe5xuSiUPt7wGRbqQWyaGrXsn":false,"2N1ydDhZb3pTcQ3VCaeFhDfAJUX1tbH6QRC":false,"2NFxv1aXdbqAXX7AxVGdb84ai6xMc8pvE3v":false,"2NDFLVcRSH2odK3UgLf1kp5j4PBKVevudyi":false,"2MxGzfn3uHsHN9gccbiZFgbis3QVEQAfvAg":false,"2NA9wYuCEdFKVKGUG66UXuXGZZkhPaMGr4G":false,"2Muio6we1rjv8dz6ignRqjZ2dh5HYPTaw9G":false,"2NCwvSsbe5n149CPEP3h15F16Y9Znkk1d2F":false,"2ND2QbNmQ24jxFc82NkNwcte9DVSSwZ6ZK5":false,"2N5LS3Mp9xPxvKTC3WUvBvx7sKiQG5bs9Tt":false,"2NA7tthGFCYCPVYbjCetYxX3B9acDSDN2rv":false,"2N63UXG4hVZBgGkmoMYbbEai1c5T5yBoQR2":false,"2MzW9FZVKC6Ekv6Ud8Hzy8kVeehRDDgZNUK":false,"2N7Db8xTAyraY2FV9DbASnso8UEvZqDHje6":false,"2NFWm3nfhMA9jdxU4egRhTY1RMJBshVZXcF":false,"2NDNXDdfFB2Yr2tx2F3B6kKqcWtJYThbbVg":false,"2NE6RLG5gSaWbFBGgPDboHJGj8g5EugycC4":false}}',
			)
			.post("/api/wallets/transactions/unspent", '{"addresses":["2Mv8e5hWoFh9X8YdU4e4qCAv7m4wBCz2ytT"]}')
			.reply(
				200,
				'{"data":[{"address":"2Mv8e5hWoFh9X8YdU4e4qCAv7m4wBCz2ytT","txId":"dfa81f23ae409a2b82184c05a8f8bb30d72997e45947577ee2a3e859bc712349","outputIndex":0,"script":"a9141fa993e76d714a6b603abea2361c20c0c7f003bb87","satoshis":98800}],"links":{"first":"https:\\/\\/btc-test.payvo.com\\/api\\/wallets\\/transactions\\/unspent?page=1","last":"https:\\/\\/btc-test.payvo.com\\/api\\/wallets\\/transactions\\/unspent?page=1","prev":null,"next":null},"meta":{"current_page":1,"from":1,"last_page":1,"links":[{"url":null,"label":"&laquo; Previous","active":false},{"url":"https:\\/\\/btc-test.payvo.com\\/api\\/wallets\\/transactions\\/unspent?page=1","label":"1","active":true},{"url":null,"label":"Next &raquo;","active":false}],"path":"https:\\/\\/btc-test.payvo.com\\/api\\/wallets\\/transactions\\/unspent","per_page":15,"to":1,"total":1}}',
			)
			.post("/api/wallets/transactions/raw", {
				transaction_ids: ["dfa81f23ae409a2b82184c05a8f8bb30d72997e45947577ee2a3e859bc712349"],
			})
			.reply(
				200,
				'{"data":{"dfa81f23ae409a2b82184c05a8f8bb30d72997e45947577ee2a3e859bc712349":"0200000000010106d3da99cdc6d87d89a1c0196ea105aa62ba0a431f163ed981a456646a3a067b0100000000ffffffff02f08101000000000017a9141fa993e76d714a6b603abea2361c20c0c7f003bb87c80000000000000022002081051a0839e678ede25d0fa89fa0b1dcc8a44fcc8f0739bb35b3e83c4d930d700400483045022100cdbd7729f8a25152e2eef2e4a737240dd553165c62370c12b9ee85f67c0c512302203a69e1285e21aff88f75ed144fe90a1bd1a826c9b2f042b9360ffdf54c33055b0147304402205150444107b40c102ae1455fe7099653216de2eba83009105722e5d879e2be9602200443f5866804005e0f37dcf7b343ad56c137b9c49eaaf19e54b5c52a5561b6ca016952210314e9ec814e8f5c7e7b16e17a0a8a65efea64c88f01085aaed41ebac7df9bf6e121032b0996a84fb0449a899616ca746c8e6cfc5d8f823114ba6bd7aed5b4e90442e221033830fa105ee889ae98074506e9d5f1153aafa64fa828904843204564f95a492653ae00000000"}}',
			)
			.get("/api/fees")
			.reply(200, {
				data: {
					min: 0.00001074,
					avg: 0.00000002,
					max: 0.00180617,
				},
			})
			.persist();
	});

	it("should generate a transfer transaction", async (context) => {
		const multiSignatureAsset = {
			min: 2,
			publicKeys: musig.accounts.map((account) => account.p2shSegwitMasterPublicKey),
		};
		const signatory = new Signatories.Signatory(
			new Signatories.MultiSignatureSignatory(multiSignatureAsset, "address"),
			multiSignatureAsset,
		);
		const result = await context.subject.transfer({
			data: {
				amount: 0.0001,
				to: "tb1q705a7ak4ejlmfc5uq3afg2q45v4yw7kyv8jgsn",
			},
			signatory,
		});

		assert.is(result.id(), unsignedMusigP2shSegwitTransferTx.id);
		assert.is(result.sender(), "2Mv8e5hWoFh9X8YdU4e4qCAv7m4wBCz2ytT");
		assert.is(result.recipient(), "tb1q705a7ak4ejlmfc5uq3afg2q45v4yw7kyv8jgsn");
		assert.is(result.amount().toNumber(), 10_000);
		assert.is(result.fee().toNumber(), 330);
		assert.instance(result.timestamp(), DateTime);
		assert.is(result.toBroadcast(), unsignedMusigP2shSegwitTransferTx.psbt);

		// Now make participants sign their parts

		const wallet1 = {
			signingKey: musig.accounts[0].mnemonic,
			path: musig.accounts[0].p2shSegwitMasterPath,
		};
		const signatory1 = new Signatories.Signatory(
			new Signatories.MnemonicSignatory({
				signingKey: wallet1.signingKey,
				address: "address", // Not needed / used
				publicKey: wallet1.path, // TODO for now we use publicKey for passing path
				privateKey: "privateKey", // Not needed / used
			}),
		);

		const signed1 = await context.musigService.addSignature(
			{
				id: result.id(),
				...result.data(),
				psbt: result.toBroadcast(),
				signatures: [],
			},
			signatory1,
		);

		assert.is(signed1.id(), oneSignatureMusigP2shSegwitTransferTx.id);
		assert.is(signed1.sender(), "2Mv8e5hWoFh9X8YdU4e4qCAv7m4wBCz2ytT");
		assert.is(signed1.recipient(), "tb1q705a7ak4ejlmfc5uq3afg2q45v4yw7kyv8jgsn");
		assert.is(signed1.amount().toNumber(), 10_000);
		assert.is(signed1.fee().toNumber(), 330);
		assert.instance(signed1.timestamp(), DateTime);
		assert.is(signed1.toBroadcast(), oneSignatureMusigP2shSegwitTransferTx.psbt);

		const wallet2 = {
			signingKey: musig.accounts[1].mnemonic,
			path: musig.accounts[1].p2shSegwitMasterPath,
		};
		const signatory2 = new Signatories.Signatory(
			new Signatories.MnemonicSignatory({
				signingKey: wallet2.signingKey,
				address: "address", // Not needed / used
				publicKey: wallet2.path, // @TODO for now we use publicKey for passing path
				privateKey: "privateKey", // Not needed / used
			}),
		);

		const signed2 = await context.musigService.addSignature(
			{
				id: signed1.id(),
				...signed1.data(),
				psbt: signed1.toBroadcast(),
				signatures: [],
			},
			signatory2,
		);

		assert.is(signed2.id(), twoSignatureMusigP2shSegwitTransferTx.id);
		assert.is(signed2.sender(), "2Mv8e5hWoFh9X8YdU4e4qCAv7m4wBCz2ytT");
		assert.is(signed2.recipient(), "tb1q705a7ak4ejlmfc5uq3afg2q45v4yw7kyv8jgsn");
		assert.is(signed2.amount().toNumber(), 10_000);
		assert.is(signed2.fee().toNumber(), 330);
		assert.instance(signed2.timestamp(), DateTime);
		assert.is(signed2.toBroadcast(), twoSignatureMusigP2shSegwitTransferTx.psbt);

		const signedFinal = bitcoin.Psbt.fromBase64(signed2.toBroadcast());
		assert.true(signedFinal.validateSignaturesOfAllInputs(signatureValidator));

		signedFinal.finalizeAllInputs();
		assert.is(
			signedFinal.extractTransaction().toHex(),
			"02000000000101492371bc59e8a3e27e574759e49729d730bbf8a8054c18822b9a40ae231fa8df000000002322002094bffa57fc318c02c22d0c0a73aebe0f3bbf0e943f6ee3f5be69d8af51eec1faffffffff021027000000000000160014f3e9df76d5ccbfb4e29c047a942815a32a477ac4965901000000000017a91470948f338431375ca5ea007ba4ba287712d459f3870400483045022100fbd10b1104d55aeda1e889bee0bb1fc03aab94f7854f816a4fbf0ae838fb34de022008e3df71716593353a53c2afdd39b3d48851b3d98cd1b009ee8e7e0bdd32bb3201483045022100b3da66f4604551b6e5327496cc895ab8cf7354f4b5ac2ffdf9b6452f589ca41402201aa8b331522a525b4734b263958e8cd15e7be6e1c82b473543a94839f906a1e90169522102398cf7167bbabcec35a34d07d3597592a55d0ebd8e6ab8c911bfa6b0519bc8202102806ff2a45228d117e4723d6db6943b7fcb8713971a59c7c7051f6c12dfdba68021031a69f4d735f153a39c83f16765fccb0f2e66673ec47c6bfbc3b2fac1a9fca04753ae00000000",
		);
	});
});

describe("native segwit multisignature wallet", ({ afterEach, beforeEach, it, nock, assert }) => {
	beforeEach(async (context) => {
		await createLocalServices(context);

		nock.fake("https://btc-test.payvo.com:443", { encodedQueryParams: true })
			.post(
				"/api/wallets/addresses",
				'{"addresses":["tb1qzdtkhgwyqnufeuc3tq88d74plcagcryzmfwclyadxgj90kwvhpps0gu965","tb1qq57mp9ygm7d6ps9mzgelzwj806dfszw4paqzmuds8n24q9eacspq4t20kv","tb1qu74mke55g3645qz2phgvej24k4qpmq33mkywyn5yyqknh7lcag5qapfmxv","tb1qhy9td6wyklj8cf0r5y8jxefrace6txkwaqj72aumm5jn703e2geqt3y5mj","tb1quwzh2lh27rr4gr6jm9ajhgd3kl42rhmgmt7clyfl8uvyhj0msstsj44x6q","tb1qrvg0evduwlpqcegehxe67850fa6ks7m2ggmrcdfdqt0v99fr4xds6g8c25","tb1q53370mfkprpzhy3amx86jdz2dt4h6jtwy6h86z7hr5ls6yzca5hq6t380v","tb1q44w9jpfmh2lppzw5qdm967tyd52n7c38xarhz9sgzhp5nmr66tnsrel5vx","tb1ql52r8a5z0a9enjff0xze483rcdywehhcdaja2h0ska33ch3dklsq96hx5f","tb1qdl6wmannd5rrtyy7qt8rkssldr9t8l33c5dk380pzd0qnu346w9qq8x4g6","tb1qd39n5952y7ayq9saq0l8kl6dvr0zuufa62pxdk566q4qpg0kp6dqvtu4j4","tb1qj2veuskz4m5hkx4hu6m8kew2mxmer5qkx9rzqmcpp585jj3wt5eqgk055h","tb1qj0hpe62hw99cqe6q65pjg2gfp2kf5eymt536tgd548u44q433hwsa7vapp","tb1q34x3atvc8h7s5ptqthlkh6f578avnnugn8rtwpn9egmaclvy53jsescqxq","tb1qkusd957vyd0kktg7s6lw5sajm3tlr7akzhxsselxyme5hcy86uashssgcy","tb1qs92g8nqskcjtyp593tlkmqg5wprpdfpg6m4g9x7ynnxac68an38s08ahcj","tb1qhfzlatav6vvfs593ppd3gkadpgdqq575wt8ffqnh9tkjaflcse0syyv9vg","tb1qpuqj28cdaa4wdw9lma36k4nrrxqnhtvt3pq6dj6h4c4r0u43e2vsr4rw7r","tb1qvfpqldfkqmg8pczyy360uxp74a57c2224f9edrae69jc2tun749qp2yz6f","tb1qtv6kgceeedq929syhtpg3rvdkdmyjscp3ncy6pcy4jkxujlaxsuqj5v3fv","tb1qmwhu5hw4ea3ktdwj4dn04l4t5rv0zzs4t6xmpgmch8rnghtcnc6s5nrczz","tb1qx3ywunss5ewqntpy4539yjhz3453ya3y76qy64829zwdfnnslanq6mxhn8","tb1qeukh8r0jtalhu0a2y8c22qkuj5wx2lw236fgqasvsk0y5zxqj9kqruz9g0","tb1qjs33vw030f03tygudt7xccetrcggg4e4xu2lfaw2jvh5s7ehw6zscdfudy","tb1qpl3jwtug967y87k6kfkvev5dlh3kwyupjypgham3qqlu9y3f625qx8nsmz","tb1qdsvzjzw5kdg4l7ylxakrguctq2cenaqg5p6dz0swjysl74y5gnfqkn5p3z","tb1qlx7tvfd345gvenemydsfacxn7vw0smw84n2pgc9v7j90uuh0qh4q0gp7ng","tb1quqkcmznkmlrnjehnujec2fqcavnk6c9wd3jqtnhlgrpxkaup4e4qnk6xct","tb1qpega6z25a0nwft7d2wgqj45w6wzzdwafgqk99ru7rnkm8wtkysgq2588v6","tb1q7z89dpp4mv34wxy3glccha0mawvafwpwge6gjthmz7fl3skv3y0s50mtt5","tb1qs52dcvl5yeuvjt50uy5ws6f939cwcyyk5dcyhj48zu7s0ggr2pcs0rm073","tb1q53sgy4ex4qn2la2uzn5gdgn4q9fz6w6g75u0myayjd373pxdwa7q3aqut4","tb1qu0naz3tjhu0lk8v5v5qc4gakz39qlnq3w3wnjvx77f32w9vce7csmklv7w","tb1qc0phtm60v9y49z03c0ym9jthepns377072yhlwwt0xp9fxhlpguqz8z4kh","tb1qzweuvgem733ads70krmf0gk9m62rpcgupfaal36qk2d27f9zaf2sae7cmj","tb1ql8gwlsfmkq3xsrjm3ternuj4ny09ss3zfmd4zdg4ycycyywqqfcqr9cxpp","tb1qwjqg249rdrggnkhjfw4gg890ha4hxcjuhaylppfe2fvhkgtqhxpstjw3jh","tb1q5dv65q30ehx0qh749edze49xcvqsf6ylkyzyckm4u6mpxwy3f09smlsryv","tb1qwnma40s4zcrht65tpxthzvc58vq6azwj3udu6ns7uh5zvwgv8nfqv9u7k8","tb1qyxkghscsxuqwsf4hntdns3u2mxjlpnkqgux274e6ua4lgxfurvlsz0prld","tb1q4dka3shget65x0e7t4wxasgdnmxfny4ut8wpwx5mvcfpl9fhsmzqwwjl9p","tb1qaga4x68ap9rctf75ktvmjyvrry64k0gheseksr3npnkxlkkdp83q0azlrz","tb1q7scsecp5uvsajcuxl8f4g2kfdk5z5knewmms7jc8dl6kv3qmnmwq9w7ljk","tb1qqdsmqt29ylkuz92xaqm0sle3aakc6a402unwxmfkq7aue9tz47vsquyzuv","tb1q0uugyd4ccnkawj72adxs40f6649wm8dj9dkcxha83t0jhkdzletqllka25","tb1q4hm4p9vla4wm6xgf8wqqn4k3lqu2ra8l9t9hlw60vwhkvsa499ps85unuy","tb1qy06xwxefpgd69e4rr42vugug3hjc6kdww6mq3lzxjjydsj8t22qqfccvjz","tb1qcm29h84uu4ptelml57gnnv2ml762fn86rqtckcp7pjfjssnpj0lsmu56fz","tb1qw7d6yvckd0mmzmx3fhenrtn938mus79dl2t8cyqmhphcnner6v7sqntg35","tb1qvemevdm7pyseeaksea6dgp6rafczvp7z4f4evtwy3q7nkn800qfs9xvhck","tb1qdmc80qfxm7e93lcgptg7wsvhqzwp2mfamxhamthpkqrexq9rhtysqcjfvt","tb1q5lgxzhzpcv7xgu73klp2nzmdp9h085tuywkdad4x7dkuh0cjq08q6usjjw","tb1qt8xcxqxvyjha32npwlsu36yn534phy5c2dykg6dsuz3cwjh0k63q789gsx","tb1qfu9wynwjlle2etrcm7ee4yjpd5mhhk4c4dn3hrgh8666dlae8zesu32vpy","tb1qdxd8tetdnwf2j0jrxsa9ne6fd96k352svxanypfufwkx3j0d3tsqsjfywu","tb1qadwrq8ecm97ruldza8nfrnv3fx429lrfe52lgmgeh55qj2j62epsl5p3x4","tb1qjff902tq557hrppg2mnkzxk464369g280wp86z9mscwy5z5xesaq4fn9xc","tb1qtwh0r2aughuvtj3zq67pxcx4q8pnzsaw5styeehq0ffp9z0xfrlqdz7zya","tb1qymnd70ky64fesrp4gm5sjvkeg3ycly7nee9r89rryrsn547ty4jsqsxmff","tb1qrtk9mha9ck7ydudgrdyfn48ttldlk6739ekgqslendhx4ruskagqktx4vz","tb1qsttp3pd68658zvtcmhx7dzpz0l7p6nwryaqmqwn4mtjr79rzuvrskgr26d","tb1q8py2zv0qpje3cdr6zhn62ev28ps8sw5lwmdxu7kczrhpq9vndccswpswzc","tb1qpu68s278ulzp9sj6wwltj4e7ssdptmy3dvm2g7estaj5m7tg5v6sp66p0a","tb1qetuf0vpqknz9vpa47efv2fc769hlqudavn8k52tmzj95c7hed78q3v0d4h","tb1qcfw6l0d56upv77hw5dqzqu892fy87dcvlv3thy244tcya0w6d8mqklnjvg","tb1q5j5zlayztgshguc4hcdx2gyuzypw99hesl3r4eany3p9rk54ks8sm0grq6","tb1q3j0v0yv49hagax0kzefra90shrspvcssykumam2zge79ryclag3sn27uss","tb1qu4v2u6k6cjh9phz6z40kxrcwm7ljmnhl4w0ky5d7ejnyz06ddgus0xykah","tb1qhmngyjlxmywhxhe2jyl67cj7rgvxafcmhcusuzewl46uugmaw7aswqn7zz","tb1qxta2grupj8jyw6h7arpgswuhrq867w8uwd3l0a2hhdhwu33d5syqhf9frc","tb1qg3087y743kwz7l4z9edqxp9cmqsldvlvdlz0pcnzelpppcxl6v8s5vwyvk","tb1qa4gukdglrtscxw9cy86cevvqu93a43n9rvge8ksuk6jpqqmxngusx4cx7g","tb1qd85s22ky4hz0mae8jd2kv2n3gmf7yxa3scydeaey9jllvz9mavjsmupt83","tb1qcnwxgsaa7jkxwxl3yjsw6f8wdmd3c53wlsshc4yh2kv9s0vd9t7s0mzhnu","tb1q3e2p0s7ns95d0kdmwqtlax6t5qe6ua9wcjjkz7j0ljhtss6plw6syy0qza","tb1qtyghqvye3tlvka3p39yx6yy4hr8rkcac5yzlm32ryk8ks254pdmqxp9qw5","tb1qyusd3uunftjhpcl5ygp4aklnh6qgdsjznkek6epd7pt6y0tq5y8s9llm6h","tb1qda66hc47czk3z7qj709jgsm6muqzah3qq07uf5ww38rtkpng5m7szwcaqs","tb1qcksnsxfptln66dgwwgljm0ktlwh9pdcmwze8l7qr03z9gan9yshqd65fen","tb1qkggt5x6msdn26a7f4uzz2edfa9mhqhul7dzqud9gaezyz5fmwpfsj7x5ry","tb1qmkuecn6m2hq43yd7vzjq5v906f84v6cl9y32ecwcd00tt2z8zpash3s6f5","tb1qa8qzgzj3666a2dsgcskwwxjh9crgn9e7zztjlt43hcufdxuaamtq9wnfl5","tb1q8lpl0sf70ryx205qtmf8w3a40j5u4waqcjzlgllr70daam87zdzs5k2p4w","tb1qtcuqxpa86fp7lslvq3u2evpklje3jyt73m37hwrjzcnmql4vy5ps5vuasj","tb1qxfzf87txk5uknfuaw0nfu0mawveap9084ewgeu3u70z5yxs094csp5d9g0","tb1qxqehg7qaue5q2yhc73xa8s8cekswp0qvvfuajrkm42k368wgvg2s5k5h66","tb1qr7cwmue7fmmdlj526u8t5pca2d73jrcfkvvqc6l83jwm4c9jkzyqhmta8w","tb1q9xtmpmcwvudr4n07tursynk8nldpuda6ypn4q27jt2j8395mcgrq9pmu8x","tb1qcqmd9z0dsstj7han2dt8sm59qmvs47gd5h0wcccq3atxxrrmfa6q9jwekw","tb1qnv0zyfglp5e93jzsvnncmdjmy9zg9433v6wxyh9wqzgsmlehvjnq5rnscx","tb1qh0tpkurympgepwkwdsnn5n2rx2d3pehp0vxgxlpdxsgz3x5f5zyseptjp8","tb1qq3ezhqe8jzp9dh362tl9uyr0hfty9dj7ldyxlfftvuldmffaas6skrmdt9","tb1q48xf0lje9f2fl53j9mcuk3au5wy2f7569sgjlsnnuvuug5wknt5s9t8jpl","tb1qmhu3a7q4u9lml7j3ulqlt0fu33m5ay6t9jq49psgsdyc9949sx8s07npyz","tb1qun4apsdelhydazn8zjschmjqnrpxd72p72u5yetp240ujs5xzggqfqaqyk","tb1qs07snkpsaggqhqj0n3uwf49kckkl8wl202p4p67hh4e33wkwe6fsdz95ls","tb1q42pd9zegquvl0uwfpg4fjs80yn3qjw823t3n30k6vfl3j8we2gqs6u354f","tb1q6p75yzxj2pc3w46gxa0w6vqg9yftkc665adfh5d0v35rqam8vclshgjrlt","tb1qezqpes0s5sm46vf5ymctnkqp4dqgft8weakchp469g3j96l6hxxquan0hr","tb1qqr667p2ac8848f523mytzy4hfcf5m93z79s8nvmvgd8d25sk89csatqs4m"]}',
			)
			.reply(
				200,
				'{"data":{"tb1qzdtkhgwyqnufeuc3tq88d74plcagcryzmfwclyadxgj90kwvhpps0gu965":true,"tb1qq57mp9ygm7d6ps9mzgelzwj806dfszw4paqzmuds8n24q9eacspq4t20kv":true,"tb1qu74mke55g3645qz2phgvej24k4qpmq33mkywyn5yyqknh7lcag5qapfmxv":false,"tb1qhy9td6wyklj8cf0r5y8jxefrace6txkwaqj72aumm5jn703e2geqt3y5mj":false,"tb1quwzh2lh27rr4gr6jm9ajhgd3kl42rhmgmt7clyfl8uvyhj0msstsj44x6q":false,"tb1qrvg0evduwlpqcegehxe67850fa6ks7m2ggmrcdfdqt0v99fr4xds6g8c25":false,"tb1q53370mfkprpzhy3amx86jdz2dt4h6jtwy6h86z7hr5ls6yzca5hq6t380v":false,"tb1q44w9jpfmh2lppzw5qdm967tyd52n7c38xarhz9sgzhp5nmr66tnsrel5vx":false,"tb1ql52r8a5z0a9enjff0xze483rcdywehhcdaja2h0ska33ch3dklsq96hx5f":false,"tb1qdl6wmannd5rrtyy7qt8rkssldr9t8l33c5dk380pzd0qnu346w9qq8x4g6":false,"tb1qd39n5952y7ayq9saq0l8kl6dvr0zuufa62pxdk566q4qpg0kp6dqvtu4j4":false,"tb1qj2veuskz4m5hkx4hu6m8kew2mxmer5qkx9rzqmcpp585jj3wt5eqgk055h":false,"tb1qj0hpe62hw99cqe6q65pjg2gfp2kf5eymt536tgd548u44q433hwsa7vapp":false,"tb1q34x3atvc8h7s5ptqthlkh6f578avnnugn8rtwpn9egmaclvy53jsescqxq":false,"tb1qkusd957vyd0kktg7s6lw5sajm3tlr7akzhxsselxyme5hcy86uashssgcy":false,"tb1qs92g8nqskcjtyp593tlkmqg5wprpdfpg6m4g9x7ynnxac68an38s08ahcj":false,"tb1qhfzlatav6vvfs593ppd3gkadpgdqq575wt8ffqnh9tkjaflcse0syyv9vg":false,"tb1qpuqj28cdaa4wdw9lma36k4nrrxqnhtvt3pq6dj6h4c4r0u43e2vsr4rw7r":false,"tb1qvfpqldfkqmg8pczyy360uxp74a57c2224f9edrae69jc2tun749qp2yz6f":false,"tb1qtv6kgceeedq929syhtpg3rvdkdmyjscp3ncy6pcy4jkxujlaxsuqj5v3fv":false,"tb1qmwhu5hw4ea3ktdwj4dn04l4t5rv0zzs4t6xmpgmch8rnghtcnc6s5nrczz":false,"tb1qx3ywunss5ewqntpy4539yjhz3453ya3y76qy64829zwdfnnslanq6mxhn8":false,"tb1qeukh8r0jtalhu0a2y8c22qkuj5wx2lw236fgqasvsk0y5zxqj9kqruz9g0":false,"tb1qjs33vw030f03tygudt7xccetrcggg4e4xu2lfaw2jvh5s7ehw6zscdfudy":false,"tb1qpl3jwtug967y87k6kfkvev5dlh3kwyupjypgham3qqlu9y3f625qx8nsmz":false,"tb1qdsvzjzw5kdg4l7ylxakrguctq2cenaqg5p6dz0swjysl74y5gnfqkn5p3z":false,"tb1qlx7tvfd345gvenemydsfacxn7vw0smw84n2pgc9v7j90uuh0qh4q0gp7ng":false,"tb1quqkcmznkmlrnjehnujec2fqcavnk6c9wd3jqtnhlgrpxkaup4e4qnk6xct":false,"tb1qpega6z25a0nwft7d2wgqj45w6wzzdwafgqk99ru7rnkm8wtkysgq2588v6":false,"tb1q7z89dpp4mv34wxy3glccha0mawvafwpwge6gjthmz7fl3skv3y0s50mtt5":false,"tb1qs52dcvl5yeuvjt50uy5ws6f939cwcyyk5dcyhj48zu7s0ggr2pcs0rm073":false,"tb1q53sgy4ex4qn2la2uzn5gdgn4q9fz6w6g75u0myayjd373pxdwa7q3aqut4":false,"tb1qu0naz3tjhu0lk8v5v5qc4gakz39qlnq3w3wnjvx77f32w9vce7csmklv7w":false,"tb1qc0phtm60v9y49z03c0ym9jthepns377072yhlwwt0xp9fxhlpguqz8z4kh":false,"tb1qzweuvgem733ads70krmf0gk9m62rpcgupfaal36qk2d27f9zaf2sae7cmj":false,"tb1ql8gwlsfmkq3xsrjm3ternuj4ny09ss3zfmd4zdg4ycycyywqqfcqr9cxpp":false,"tb1qwjqg249rdrggnkhjfw4gg890ha4hxcjuhaylppfe2fvhkgtqhxpstjw3jh":false,"tb1q5dv65q30ehx0qh749edze49xcvqsf6ylkyzyckm4u6mpxwy3f09smlsryv":false,"tb1qwnma40s4zcrht65tpxthzvc58vq6azwj3udu6ns7uh5zvwgv8nfqv9u7k8":false,"tb1qyxkghscsxuqwsf4hntdns3u2mxjlpnkqgux274e6ua4lgxfurvlsz0prld":false,"tb1q4dka3shget65x0e7t4wxasgdnmxfny4ut8wpwx5mvcfpl9fhsmzqwwjl9p":false,"tb1qaga4x68ap9rctf75ktvmjyvrry64k0gheseksr3npnkxlkkdp83q0azlrz":false,"tb1q7scsecp5uvsajcuxl8f4g2kfdk5z5knewmms7jc8dl6kv3qmnmwq9w7ljk":false,"tb1qqdsmqt29ylkuz92xaqm0sle3aakc6a402unwxmfkq7aue9tz47vsquyzuv":false,"tb1q0uugyd4ccnkawj72adxs40f6649wm8dj9dkcxha83t0jhkdzletqllka25":false,"tb1q4hm4p9vla4wm6xgf8wqqn4k3lqu2ra8l9t9hlw60vwhkvsa499ps85unuy":false,"tb1qy06xwxefpgd69e4rr42vugug3hjc6kdww6mq3lzxjjydsj8t22qqfccvjz":false,"tb1qcm29h84uu4ptelml57gnnv2ml762fn86rqtckcp7pjfjssnpj0lsmu56fz":false,"tb1qw7d6yvckd0mmzmx3fhenrtn938mus79dl2t8cyqmhphcnner6v7sqntg35":false,"tb1qvemevdm7pyseeaksea6dgp6rafczvp7z4f4evtwy3q7nkn800qfs9xvhck":false,"tb1qdmc80qfxm7e93lcgptg7wsvhqzwp2mfamxhamthpkqrexq9rhtysqcjfvt":false,"tb1q5lgxzhzpcv7xgu73klp2nzmdp9h085tuywkdad4x7dkuh0cjq08q6usjjw":false,"tb1qt8xcxqxvyjha32npwlsu36yn534phy5c2dykg6dsuz3cwjh0k63q789gsx":false,"tb1qfu9wynwjlle2etrcm7ee4yjpd5mhhk4c4dn3hrgh8666dlae8zesu32vpy":false,"tb1qdxd8tetdnwf2j0jrxsa9ne6fd96k352svxanypfufwkx3j0d3tsqsjfywu":false,"tb1qadwrq8ecm97ruldza8nfrnv3fx429lrfe52lgmgeh55qj2j62epsl5p3x4":false,"tb1qjff902tq557hrppg2mnkzxk464369g280wp86z9mscwy5z5xesaq4fn9xc":false,"tb1qtwh0r2aughuvtj3zq67pxcx4q8pnzsaw5styeehq0ffp9z0xfrlqdz7zya":false,"tb1qymnd70ky64fesrp4gm5sjvkeg3ycly7nee9r89rryrsn547ty4jsqsxmff":false,"tb1qrtk9mha9ck7ydudgrdyfn48ttldlk6739ekgqslendhx4ruskagqktx4vz":false,"tb1qsttp3pd68658zvtcmhx7dzpz0l7p6nwryaqmqwn4mtjr79rzuvrskgr26d":false,"tb1q8py2zv0qpje3cdr6zhn62ev28ps8sw5lwmdxu7kczrhpq9vndccswpswzc":false,"tb1qpu68s278ulzp9sj6wwltj4e7ssdptmy3dvm2g7estaj5m7tg5v6sp66p0a":false,"tb1qetuf0vpqknz9vpa47efv2fc769hlqudavn8k52tmzj95c7hed78q3v0d4h":false,"tb1qcfw6l0d56upv77hw5dqzqu892fy87dcvlv3thy244tcya0w6d8mqklnjvg":false,"tb1q5j5zlayztgshguc4hcdx2gyuzypw99hesl3r4eany3p9rk54ks8sm0grq6":false,"tb1q3j0v0yv49hagax0kzefra90shrspvcssykumam2zge79ryclag3sn27uss":false,"tb1qu4v2u6k6cjh9phz6z40kxrcwm7ljmnhl4w0ky5d7ejnyz06ddgus0xykah":false,"tb1qhmngyjlxmywhxhe2jyl67cj7rgvxafcmhcusuzewl46uugmaw7aswqn7zz":false,"tb1qxta2grupj8jyw6h7arpgswuhrq867w8uwd3l0a2hhdhwu33d5syqhf9frc":false,"tb1qg3087y743kwz7l4z9edqxp9cmqsldvlvdlz0pcnzelpppcxl6v8s5vwyvk":false,"tb1qa4gukdglrtscxw9cy86cevvqu93a43n9rvge8ksuk6jpqqmxngusx4cx7g":false,"tb1qd85s22ky4hz0mae8jd2kv2n3gmf7yxa3scydeaey9jllvz9mavjsmupt83":false,"tb1qcnwxgsaa7jkxwxl3yjsw6f8wdmd3c53wlsshc4yh2kv9s0vd9t7s0mzhnu":false,"tb1q3e2p0s7ns95d0kdmwqtlax6t5qe6ua9wcjjkz7j0ljhtss6plw6syy0qza":false,"tb1qtyghqvye3tlvka3p39yx6yy4hr8rkcac5yzlm32ryk8ks254pdmqxp9qw5":false,"tb1qyusd3uunftjhpcl5ygp4aklnh6qgdsjznkek6epd7pt6y0tq5y8s9llm6h":false,"tb1qda66hc47czk3z7qj709jgsm6muqzah3qq07uf5ww38rtkpng5m7szwcaqs":false,"tb1qcksnsxfptln66dgwwgljm0ktlwh9pdcmwze8l7qr03z9gan9yshqd65fen":false,"tb1qkggt5x6msdn26a7f4uzz2edfa9mhqhul7dzqud9gaezyz5fmwpfsj7x5ry":false,"tb1qmkuecn6m2hq43yd7vzjq5v906f84v6cl9y32ecwcd00tt2z8zpash3s6f5":false,"tb1qa8qzgzj3666a2dsgcskwwxjh9crgn9e7zztjlt43hcufdxuaamtq9wnfl5":false,"tb1q8lpl0sf70ryx205qtmf8w3a40j5u4waqcjzlgllr70daam87zdzs5k2p4w":false,"tb1qtcuqxpa86fp7lslvq3u2evpklje3jyt73m37hwrjzcnmql4vy5ps5vuasj":false,"tb1qxfzf87txk5uknfuaw0nfu0mawveap9084ewgeu3u70z5yxs094csp5d9g0":false,"tb1qxqehg7qaue5q2yhc73xa8s8cekswp0qvvfuajrkm42k368wgvg2s5k5h66":false,"tb1qr7cwmue7fmmdlj526u8t5pca2d73jrcfkvvqc6l83jwm4c9jkzyqhmta8w":false,"tb1q9xtmpmcwvudr4n07tursynk8nldpuda6ypn4q27jt2j8395mcgrq9pmu8x":false,"tb1qcqmd9z0dsstj7han2dt8sm59qmvs47gd5h0wcccq3atxxrrmfa6q9jwekw":false,"tb1qnv0zyfglp5e93jzsvnncmdjmy9zg9433v6wxyh9wqzgsmlehvjnq5rnscx":false,"tb1qh0tpkurympgepwkwdsnn5n2rx2d3pehp0vxgxlpdxsgz3x5f5zyseptjp8":false,"tb1qq3ezhqe8jzp9dh362tl9uyr0hfty9dj7ldyxlfftvuldmffaas6skrmdt9":false,"tb1q48xf0lje9f2fl53j9mcuk3au5wy2f7569sgjlsnnuvuug5wknt5s9t8jpl":false,"tb1qmhu3a7q4u9lml7j3ulqlt0fu33m5ay6t9jq49psgsdyc9949sx8s07npyz":false,"tb1qun4apsdelhydazn8zjschmjqnrpxd72p72u5yetp240ujs5xzggqfqaqyk":false,"tb1qs07snkpsaggqhqj0n3uwf49kckkl8wl202p4p67hh4e33wkwe6fsdz95ls":false,"tb1q42pd9zegquvl0uwfpg4fjs80yn3qjw823t3n30k6vfl3j8we2gqs6u354f":false,"tb1q6p75yzxj2pc3w46gxa0w6vqg9yftkc665adfh5d0v35rqam8vclshgjrlt":false,"tb1qezqpes0s5sm46vf5ymctnkqp4dqgft8weakchp469g3j96l6hxxquan0hr":false,"tb1qqr667p2ac8848f523mytzy4hfcf5m93z79s8nvmvgd8d25sk89csatqs4m":false}}',
			)
			.post(
				"/api/wallets/addresses",
				'{"addresses":["tb1qsyz35zpeueuwmcjap75flg93mny2gn7v3urnnwe4k05rcnvnp4cqq7hew2","tb1q9dpf5gjwgwmdftn22tfmq4cmw3qt825nf3xgd4wkdg3ktw6z2shsa5wauj","tb1qlj3qkv9c5j5gfqgfnqjl0nkwuvw8ktq9u3ahg0du4jnde852nrcstf4cka","tb1qes5lcckv97t0umnyvwxcjh7y4lemad0utwjl4lcg54yhxkdtlgyq35hlw3","tb1qv42ern8yjn3lq9rywl4ky2kdxtk783w8vtvsf3qf4u8r9lj4cjesu9htw6","tb1q0jhddny2g66g9w9e5nnsy7a0wpmtee60tcdx5jkwd9eq408vdueqv89r3z","tb1qs4jcfl66n7kjvml04ggj4qaqsygnkzxy5fznc8tek8l9js8dda7s0dfdxd","tb1qjqtgnkr24p7snzd7tfrvaw730ncsgk8vyg9z278a8gdcw2vln7dsezhp45","tb1q5q6vxfgvfx2pnsusrhhcjda7nt34v7m5hsd3909pvvjvcxg796zq8jccdc","tb1q6y0hr6sskangsempgej9udsw6q8xqgg5m4gejhww3tl9dphyy4ks0ggefg","tb1q486z3sqhlmk50q7fwuevvle75dpezylhw9jfe8hhe0f6f4vuhu9qfhjxa2","tb1qewyw7fwzm94l4z3xvtqgr7clx0z3f0r0z8lxd9tcr8s7ps9n8gqq787nql","tb1qh62yhwxt4jlmdhjj6qg8q77evhgpsfrr0t9gkgvu7luacdjl8snsudzhxn","tb1qznlwvphh66m0j39g5mpp8fxkydxcutngsj7d9f0x42sc5s9tv5xq6rpzuc","tb1qmu92s68qtal0wkq53l4yh6q70ke28p6nzm5wux2dk3kyu3g96xvsz4cgdl","tb1qdh0r96zj7news5l64uklwp36nhglcens4tpcvr95xxureq4f7vnsgr8y5y","tb1qrrn3pzqfnw39yxfhhhprluyy357977s220r0ja2edkgkf5q70rpsj7jpex","tb1qaxxrvgyjxrcjgy06ds2ljv8hnn298nthdf4l4gjc2typ2kfu0wqqjzgr2z","tb1qdrczmglape6ag62smukzne8wuvg8c7ggkfu7azktq3vxlwjej0ksl94drz","tb1q0kpqnp2hxp4l8jckp5ppvvdvdvntd8yslsdwv760yn4f29n3n8sqhzuz29","tb1qwr3z7clyuhffdp08e0dnkq93gfdeac3m07df25y40gjuq9zgwm4qrcyfvt","tb1q82yksm7jn93k7u5y9pke3mknztrw3asux84g7dm4drvq6m4fg8tsdnjuse","tb1qqf9r2g8pm2fcwth4f566khtzwelsg2f950qhgy0gww9kfnudxjuq5xgdtn","tb1q5h9hfm9ywgkggjnaz5c93qz5kukm3lgykxf737s7veexhprzgmxqhtz7s9","tb1que7sm42cu7kmg56zj9p8jwewphtmfwm58ghrlqgud5977zkwqxkqug7hzu","tb1qp0yg4p6fzk86fr489d3arcdshgg0wz5ep7876e7n7y79kdmeg0hsmczd8j","tb1qssa4q8zj2xkmvk02pwhe6el5p3y2n8p8lffzuk82w9gne25fmqgsksd0vu","tb1qensuvjf6qyd2xc0fva07ajcc6m450h2ftp5zxmpwgcf7fggtew0sq99uf6","tb1q4stfz7f8004n3fr5ujm9vuuv3eyxz63a65zr3yddl3q77pvelutq0lznac","tb1q9n6uzs3twfnzdqspy9u3lr4ynqcwrcsyc4sjvwfns4rc4tdzp0yszvvnf0","tb1q3xqnux9pc7wxmlmezztezdrst0gqhf6l50z3xvguz2yw6ukzv6eqr4fp9v","tb1qwruumlpyrkfgm5dsy40pp3259w8vxsrz0x7dvhhape59a27sk2yq57nyzl","tb1qwjjdnmf6fndyztphs7rgq0j46hannsmzxcjyfhedwcpq0v6aszeqyclphv","tb1q0g9afx3ewsy5a5uhp9p7p4n8crcmkh69dyetr5u0radavmdshrwshzznm6","tb1qy99hykem62a70r6ahsnljkp0gfpxyykv8ex3530cvurxdm7ccwtqzdvghf","tb1qghyr3p9e40uqev09petul667lmjsrf82xg4ns5fnwtmxytm3y5wqehrl32","tb1q4xue89lc34n3j0xpfn9hjjzame387tvx7t95fhpu2e8pswneq7ascp975r","tb1qqgr4wqqt5g8qv9jmwg5p034snqfud8zgk8dj3fhxtg5mpvsnzywsl3qg9f","tb1qngx9m0rp53z2mtyavlz753cwr3mcw34ep0q2vszk7ng0ae8e5f7qurj6vs","tb1qe224f77gzgt83ukgr67ddgsu40f0u5l4vhaz43wg3k8kq9j9s5cshha5xp","tb1qz8773msdl5ns83dcefk372mwr0exrfrht8ktd9qr4y74dqwc6xnq5qrn0j","tb1q3aqr7rc9selufk4cwk969k7tu9p94zgfzfmw2dvypw3tzkpfy23sgu9n9n","tb1qrf0eg2yz8sfyldn66zztccpfy7sm75waf5ksncrau6l33qr5tgfsndj5r3","tb1qzhf2en6txh4sudtpeczwkey280rk23hhw0qpmrrzuuxjfmzynytshtd0ey","tb1q2k8wghl6q62t7hqyau0h24lewffvy9akwjcw68jfr2z2kxpazhlsw9dz9f","tb1q5hly0a5x203gwttaat0d4rqk3zy7ekmyv90yusa0vawzkcg5fj6scflj3x","tb1qxu95r2fhrqfjmnm25y4f33pcnernx64ms602ruerzjmtgufguagsc3rxu0","tb1q5e2de4t0xg3jnn988vswkake0qnvz22uqy0s0hfmk27plvzqm9zqu4vfa2","tb1q7wztc5wdw7nugw00tuemhlhjq7efjgugsdcn6sht4fhnquhu7a8szda5j7","tb1qjwxc6e50edtmhajnm7kt36rjs7els4f2mvqrwc9yzrcdz54tj34syunpyv","tb1qtwtnmx4n76tlnl5j6p7rp8t6yu32y03dngxm8ya3pwrs0jrn4sdqpvcyk4","tb1qupyyudc53knneugdz7qynrdjjane88gkw7wclm7y936gfud3n8sqyuht2l","tb1qxkl7njf7lyt9njr3tyhcxyt87y3262ayxyrz3at0c5ea9gdeaj9s8uhymq","tb1qmk8dfg7dfzn9uesxtrwgcmgkneqclw39pnycndjscr35sxlnkqyqzcvn9x","tb1q2exgm8edud2hdnngcze7n62j2n644npqlr7ffqmg35vkg25j9cjqyg5tnw","tb1q5dkpaftvvmtsyg2dx3xqats9ql056zjurz92tqa4nqr2an5ku57stp2vxf","tb1qp9sgh7rup2pf6xmj7pgc3nw833txgd3ergxqrpfcajzjzuvjsg0qqf8yad","tb1qnd7t7jkn2xy4fwjzxuq6wkkglupmdeglzl4l6veqng0hsk22969svhf5t0","tb1qftdrndcqtaalte848fkvmt5mhuy660585mug8hhz7cmzhzru2e8qvs6tts","tb1qg5vt5fsvchq6243syv0lg8m4tsfdl976mh533f8l95xe32yrpkest64k8u","tb1qfnkxkyhe6ex3dclaqlhvs4redcujw0xg6lv48m7cl2wcnqq5xcns0fplcg","tb1qwamgd8289m2y7zg9422ppa3yx0y0l066qa0qh5ct7lwxx2jddx7qtexh8c","tb1qpw3rfcmayuzpuc94wmuj6gnavu9j22fdgrn8asnly7wlmj4dl6dq9ehyhp","tb1quapjvfnhv702zr35x6g5vhrd5k5rvwl83suzr0r3kxlhysrjkytszemkml","tb1q8tgqllnasc04dc6gf9zzprm302g5ghe2hsgd3adh4xv4h8s3252qvm80cr","tb1qxs06255k2ep0hu269jtc9adfqa6p2mc79rhlc6285af03fawda6sgdqszu","tb1qutgaf4c72naj2dpp3gaywzhzx6khtw3qmdhaq8v5w858fa2gvlpqx6jj9r","tb1qelp3lh2jk95xuhr6ffm9z5cg7552kjqknymtq0ja3nq5az3wg5hs34mt05","tb1qhg4u5gadszqsve8zctx27q7eax4sw0mu06fe09992t84lqvg9aesghral4","tb1qrq2zz4yrcj7njkk94d4x2csrukp0frvrpd2njnq8kmkntetfc2hq99enkc","tb1q5xnxgjlvr2lqx79vg93hjscfdd7wpa7r3fjt2hepn6674amdm96s8jxpr9","tb1q6z83sjh07p02r7rp9ag27gyvk4z9ar69n25evqj55gusj6j2c9ssseny7v","tb1qalvh74f04fshu0ee0v0r6g6hnk5py4rxzx9dd9sy4970rnwrlaxs9l8e5z","tb1qqc0f803ytqapulw4zdc5zju42mq9ukkljd9ggr88hk8z6u30kn6smpdz6j","tb1qm7d7rruqh9gxnf3yj97xr4ayaqne38ycuhhcw4eczkng9ahglals7zve82","tb1q3puafp92tfzh5psacmq67mdf4u5qanmjj947enllxq82vqfg4e6qw5euxx","tb1q685rg422fazvptysmcy6nh3cwhmhzun6grw05kjqxvj4kf4sqvns532368","tb1q98sq5smaaxmd0edd5zxg2e0npcxuel20rp54fnd39dg2jluzeqgqngcssf","tb1q3c5lvr0k66tnt04405gaux6w9j670f2mzmmcnyylzlqdd2zqvtjqu8teds","tb1qpeda44c4f3fn2nqunsweytzkuq3xleexfxn94h7p6taa4n0uavvq3xnru6","tb1qc0puyp9n6js5edgeq95hgj4yg7c7psqwz3vfanhlndkk8pg2tphq8ss63a","tb1qpfvjq86mk48tpsjjrx2v5qjtkxxw8vzjplwwh3uy9fhnq2h5232svaxlm4","tb1q55sfpe3s0ddqh6xjzpdhpjfhqn3t8na042lpma40c4prevsyz8mspqzwn0","tb1qxlp64rgc39jcvkasdndkxdt48uyqddws875n0l627z4468eercls3k5uxs","tb1q8wpundsj7vr5p4tx5pza06s4g7f0r99xtd7euqhqy63pwafu63dq59gxem","tb1qunaqu7m3908ra7re78eu9vc74zl2rqsaxvr9qs2yqjhkumx936tsddmv7z","tb1qp4kye7xax60gqsh0wesvrq3gq2crxcqcwkjdax8rxk26qevkzrsq4fjhf7","tb1qx59mhqfwqp9gprt8qujcacmuv263w866ttuskpc9svrgk7l89j2stgpf2l","tb1qn262y3d0szjzhkg0dl287qpxkt3n9skvk7asgl5zdklakja8ahhqj5za05","tb1qxe62ljrd3uasncs5vmxk8d6qwwrcfljasjm6qsr0jkv6z8h6jg6s7p4a79","tb1qn6ev5cgcc4v0007u6xq632e77ku4w899jredy57a5mgpyvsqkeusrfrnug","tb1qvyzxerka6au4re0y02437ya2f09aad6nks36l6u6gxv3s3cxas5s8qmv6j","tb1qfhydy46auksshl893tm6crpnp4tdyhzymcns025mtuhh7pwxkgeqprvjp2","tb1qt4dp2cgklaugaax5yxhpaguy92203tajxwxhgu5vxwd6ml0r3h7qq7gznu","tb1q94e3ygwjscqntm5jw4zpwggjhnnql0eundjvzqctds920pv38w4q4jl20v","tb1qz2acgyh2hy7hk93av6750695ykjw6yw6h7300azr470my2d26ngqw6cv28","tb1qg57w722xc59xe4rsw5z7ddu825fqfa5qv3jtsmdtl3h56r9ct9ysnqftnh","tb1qm59tcqsg2kpj9ry05ldr7f5cqka9alw24npy8khsrt3qhjqjmtjsa3lzvn","tb1qut73xxg08heks0gjaxst9c8mlrydqpqdafan0r030gzsw9s9uvzqdqt0g9","tb1q4mdcnyz30j3j97mrtywwjy409l9gvgeqakwaedudctcp9gnunceqkt3lyf"]}',
			)
			.reply(
				200,
				'{"data":{"tb1qsyz35zpeueuwmcjap75flg93mny2gn7v3urnnwe4k05rcnvnp4cqq7hew2":true,"tb1q9dpf5gjwgwmdftn22tfmq4cmw3qt825nf3xgd4wkdg3ktw6z2shsa5wauj":true,"tb1qlj3qkv9c5j5gfqgfnqjl0nkwuvw8ktq9u3ahg0du4jnde852nrcstf4cka":true,"tb1qes5lcckv97t0umnyvwxcjh7y4lemad0utwjl4lcg54yhxkdtlgyq35hlw3":false,"tb1qv42ern8yjn3lq9rywl4ky2kdxtk783w8vtvsf3qf4u8r9lj4cjesu9htw6":false,"tb1q0jhddny2g66g9w9e5nnsy7a0wpmtee60tcdx5jkwd9eq408vdueqv89r3z":false,"tb1qs4jcfl66n7kjvml04ggj4qaqsygnkzxy5fznc8tek8l9js8dda7s0dfdxd":false,"tb1qjqtgnkr24p7snzd7tfrvaw730ncsgk8vyg9z278a8gdcw2vln7dsezhp45":false,"tb1q5q6vxfgvfx2pnsusrhhcjda7nt34v7m5hsd3909pvvjvcxg796zq8jccdc":false,"tb1q6y0hr6sskangsempgej9udsw6q8xqgg5m4gejhww3tl9dphyy4ks0ggefg":false,"tb1q486z3sqhlmk50q7fwuevvle75dpezylhw9jfe8hhe0f6f4vuhu9qfhjxa2":false,"tb1qewyw7fwzm94l4z3xvtqgr7clx0z3f0r0z8lxd9tcr8s7ps9n8gqq787nql":false,"tb1qh62yhwxt4jlmdhjj6qg8q77evhgpsfrr0t9gkgvu7luacdjl8snsudzhxn":false,"tb1qznlwvphh66m0j39g5mpp8fxkydxcutngsj7d9f0x42sc5s9tv5xq6rpzuc":false,"tb1qmu92s68qtal0wkq53l4yh6q70ke28p6nzm5wux2dk3kyu3g96xvsz4cgdl":false,"tb1qdh0r96zj7news5l64uklwp36nhglcens4tpcvr95xxureq4f7vnsgr8y5y":false,"tb1qrrn3pzqfnw39yxfhhhprluyy357977s220r0ja2edkgkf5q70rpsj7jpex":false,"tb1qaxxrvgyjxrcjgy06ds2ljv8hnn298nthdf4l4gjc2typ2kfu0wqqjzgr2z":false,"tb1qdrczmglape6ag62smukzne8wuvg8c7ggkfu7azktq3vxlwjej0ksl94drz":false,"tb1q0kpqnp2hxp4l8jckp5ppvvdvdvntd8yslsdwv760yn4f29n3n8sqhzuz29":false,"tb1qwr3z7clyuhffdp08e0dnkq93gfdeac3m07df25y40gjuq9zgwm4qrcyfvt":false,"tb1q82yksm7jn93k7u5y9pke3mknztrw3asux84g7dm4drvq6m4fg8tsdnjuse":false,"tb1qqf9r2g8pm2fcwth4f566khtzwelsg2f950qhgy0gww9kfnudxjuq5xgdtn":false,"tb1q5h9hfm9ywgkggjnaz5c93qz5kukm3lgykxf737s7veexhprzgmxqhtz7s9":false,"tb1que7sm42cu7kmg56zj9p8jwewphtmfwm58ghrlqgud5977zkwqxkqug7hzu":false,"tb1qp0yg4p6fzk86fr489d3arcdshgg0wz5ep7876e7n7y79kdmeg0hsmczd8j":false,"tb1qssa4q8zj2xkmvk02pwhe6el5p3y2n8p8lffzuk82w9gne25fmqgsksd0vu":false,"tb1qensuvjf6qyd2xc0fva07ajcc6m450h2ftp5zxmpwgcf7fggtew0sq99uf6":false,"tb1q4stfz7f8004n3fr5ujm9vuuv3eyxz63a65zr3yddl3q77pvelutq0lznac":false,"tb1q9n6uzs3twfnzdqspy9u3lr4ynqcwrcsyc4sjvwfns4rc4tdzp0yszvvnf0":false,"tb1q3xqnux9pc7wxmlmezztezdrst0gqhf6l50z3xvguz2yw6ukzv6eqr4fp9v":false,"tb1qwruumlpyrkfgm5dsy40pp3259w8vxsrz0x7dvhhape59a27sk2yq57nyzl":false,"tb1qwjjdnmf6fndyztphs7rgq0j46hannsmzxcjyfhedwcpq0v6aszeqyclphv":false,"tb1q0g9afx3ewsy5a5uhp9p7p4n8crcmkh69dyetr5u0radavmdshrwshzznm6":false,"tb1qy99hykem62a70r6ahsnljkp0gfpxyykv8ex3530cvurxdm7ccwtqzdvghf":false,"tb1qghyr3p9e40uqev09petul667lmjsrf82xg4ns5fnwtmxytm3y5wqehrl32":false,"tb1q4xue89lc34n3j0xpfn9hjjzame387tvx7t95fhpu2e8pswneq7ascp975r":false,"tb1qqgr4wqqt5g8qv9jmwg5p034snqfud8zgk8dj3fhxtg5mpvsnzywsl3qg9f":false,"tb1qngx9m0rp53z2mtyavlz753cwr3mcw34ep0q2vszk7ng0ae8e5f7qurj6vs":false,"tb1qe224f77gzgt83ukgr67ddgsu40f0u5l4vhaz43wg3k8kq9j9s5cshha5xp":false,"tb1qz8773msdl5ns83dcefk372mwr0exrfrht8ktd9qr4y74dqwc6xnq5qrn0j":false,"tb1q3aqr7rc9selufk4cwk969k7tu9p94zgfzfmw2dvypw3tzkpfy23sgu9n9n":false,"tb1qrf0eg2yz8sfyldn66zztccpfy7sm75waf5ksncrau6l33qr5tgfsndj5r3":false,"tb1qzhf2en6txh4sudtpeczwkey280rk23hhw0qpmrrzuuxjfmzynytshtd0ey":false,"tb1q2k8wghl6q62t7hqyau0h24lewffvy9akwjcw68jfr2z2kxpazhlsw9dz9f":false,"tb1q5hly0a5x203gwttaat0d4rqk3zy7ekmyv90yusa0vawzkcg5fj6scflj3x":false,"tb1qxu95r2fhrqfjmnm25y4f33pcnernx64ms602ruerzjmtgufguagsc3rxu0":false,"tb1q5e2de4t0xg3jnn988vswkake0qnvz22uqy0s0hfmk27plvzqm9zqu4vfa2":false,"tb1q7wztc5wdw7nugw00tuemhlhjq7efjgugsdcn6sht4fhnquhu7a8szda5j7":false,"tb1qjwxc6e50edtmhajnm7kt36rjs7els4f2mvqrwc9yzrcdz54tj34syunpyv":false,"tb1qtwtnmx4n76tlnl5j6p7rp8t6yu32y03dngxm8ya3pwrs0jrn4sdqpvcyk4":false,"tb1qupyyudc53knneugdz7qynrdjjane88gkw7wclm7y936gfud3n8sqyuht2l":false,"tb1qxkl7njf7lyt9njr3tyhcxyt87y3262ayxyrz3at0c5ea9gdeaj9s8uhymq":false,"tb1qmk8dfg7dfzn9uesxtrwgcmgkneqclw39pnycndjscr35sxlnkqyqzcvn9x":false,"tb1q2exgm8edud2hdnngcze7n62j2n644npqlr7ffqmg35vkg25j9cjqyg5tnw":false,"tb1q5dkpaftvvmtsyg2dx3xqats9ql056zjurz92tqa4nqr2an5ku57stp2vxf":false,"tb1qp9sgh7rup2pf6xmj7pgc3nw833txgd3ergxqrpfcajzjzuvjsg0qqf8yad":false,"tb1qnd7t7jkn2xy4fwjzxuq6wkkglupmdeglzl4l6veqng0hsk22969svhf5t0":false,"tb1qftdrndcqtaalte848fkvmt5mhuy660585mug8hhz7cmzhzru2e8qvs6tts":false,"tb1qg5vt5fsvchq6243syv0lg8m4tsfdl976mh533f8l95xe32yrpkest64k8u":false,"tb1qfnkxkyhe6ex3dclaqlhvs4redcujw0xg6lv48m7cl2wcnqq5xcns0fplcg":false,"tb1qwamgd8289m2y7zg9422ppa3yx0y0l066qa0qh5ct7lwxx2jddx7qtexh8c":false,"tb1qpw3rfcmayuzpuc94wmuj6gnavu9j22fdgrn8asnly7wlmj4dl6dq9ehyhp":false,"tb1quapjvfnhv702zr35x6g5vhrd5k5rvwl83suzr0r3kxlhysrjkytszemkml":false,"tb1q8tgqllnasc04dc6gf9zzprm302g5ghe2hsgd3adh4xv4h8s3252qvm80cr":false,"tb1qxs06255k2ep0hu269jtc9adfqa6p2mc79rhlc6285af03fawda6sgdqszu":false,"tb1qutgaf4c72naj2dpp3gaywzhzx6khtw3qmdhaq8v5w858fa2gvlpqx6jj9r":false,"tb1qelp3lh2jk95xuhr6ffm9z5cg7552kjqknymtq0ja3nq5az3wg5hs34mt05":false,"tb1qhg4u5gadszqsve8zctx27q7eax4sw0mu06fe09992t84lqvg9aesghral4":false,"tb1qrq2zz4yrcj7njkk94d4x2csrukp0frvrpd2njnq8kmkntetfc2hq99enkc":false,"tb1q5xnxgjlvr2lqx79vg93hjscfdd7wpa7r3fjt2hepn6674amdm96s8jxpr9":false,"tb1q6z83sjh07p02r7rp9ag27gyvk4z9ar69n25evqj55gusj6j2c9ssseny7v":false,"tb1qalvh74f04fshu0ee0v0r6g6hnk5py4rxzx9dd9sy4970rnwrlaxs9l8e5z":false,"tb1qqc0f803ytqapulw4zdc5zju42mq9ukkljd9ggr88hk8z6u30kn6smpdz6j":false,"tb1qm7d7rruqh9gxnf3yj97xr4ayaqne38ycuhhcw4eczkng9ahglals7zve82":false,"tb1q3puafp92tfzh5psacmq67mdf4u5qanmjj947enllxq82vqfg4e6qw5euxx":false,"tb1q685rg422fazvptysmcy6nh3cwhmhzun6grw05kjqxvj4kf4sqvns532368":false,"tb1q98sq5smaaxmd0edd5zxg2e0npcxuel20rp54fnd39dg2jluzeqgqngcssf":false,"tb1q3c5lvr0k66tnt04405gaux6w9j670f2mzmmcnyylzlqdd2zqvtjqu8teds":false,"tb1qpeda44c4f3fn2nqunsweytzkuq3xleexfxn94h7p6taa4n0uavvq3xnru6":false,"tb1qc0puyp9n6js5edgeq95hgj4yg7c7psqwz3vfanhlndkk8pg2tphq8ss63a":false,"tb1qpfvjq86mk48tpsjjrx2v5qjtkxxw8vzjplwwh3uy9fhnq2h5232svaxlm4":false,"tb1q55sfpe3s0ddqh6xjzpdhpjfhqn3t8na042lpma40c4prevsyz8mspqzwn0":false,"tb1qxlp64rgc39jcvkasdndkxdt48uyqddws875n0l627z4468eercls3k5uxs":false,"tb1q8wpundsj7vr5p4tx5pza06s4g7f0r99xtd7euqhqy63pwafu63dq59gxem":false,"tb1qunaqu7m3908ra7re78eu9vc74zl2rqsaxvr9qs2yqjhkumx936tsddmv7z":false,"tb1qp4kye7xax60gqsh0wesvrq3gq2crxcqcwkjdax8rxk26qevkzrsq4fjhf7":false,"tb1qx59mhqfwqp9gprt8qujcacmuv263w866ttuskpc9svrgk7l89j2stgpf2l":false,"tb1qn262y3d0szjzhkg0dl287qpxkt3n9skvk7asgl5zdklakja8ahhqj5za05":false,"tb1qxe62ljrd3uasncs5vmxk8d6qwwrcfljasjm6qsr0jkv6z8h6jg6s7p4a79":false,"tb1qn6ev5cgcc4v0007u6xq632e77ku4w899jredy57a5mgpyvsqkeusrfrnug":false,"tb1qvyzxerka6au4re0y02437ya2f09aad6nks36l6u6gxv3s3cxas5s8qmv6j":false,"tb1qfhydy46auksshl893tm6crpnp4tdyhzymcns025mtuhh7pwxkgeqprvjp2":false,"tb1qt4dp2cgklaugaax5yxhpaguy92203tajxwxhgu5vxwd6ml0r3h7qq7gznu":false,"tb1q94e3ygwjscqntm5jw4zpwggjhnnql0eundjvzqctds920pv38w4q4jl20v":false,"tb1qz2acgyh2hy7hk93av6750695ykjw6yw6h7300azr470my2d26ngqw6cv28":false,"tb1qg57w722xc59xe4rsw5z7ddu825fqfa5qv3jtsmdtl3h56r9ct9ysnqftnh":false,"tb1qm59tcqsg2kpj9ry05ldr7f5cqka9alw24npy8khsrt3qhjqjmtjsa3lzvn":false,"tb1qut73xxg08heks0gjaxst9c8mlrydqpqdafan0r030gzsw9s9uvzqdqt0g9":false,"tb1q4mdcnyz30j3j97mrtywwjy409l9gvgeqakwaedudctcp9gnunceqkt3lyf":false}}',
			)
			.post(
				"/api/wallets/transactions/unspent",
				'{"addresses":["tb1qzdtkhgwyqnufeuc3tq88d74plcagcryzmfwclyadxgj90kwvhpps0gu965","tb1qq57mp9ygm7d6ps9mzgelzwj806dfszw4paqzmuds8n24q9eacspq4t20kv","tb1qsyz35zpeueuwmcjap75flg93mny2gn7v3urnnwe4k05rcnvnp4cqq7hew2","tb1q9dpf5gjwgwmdftn22tfmq4cmw3qt825nf3xgd4wkdg3ktw6z2shsa5wauj","tb1qlj3qkv9c5j5gfqgfnqjl0nkwuvw8ktq9u3ahg0du4jnde852nrcstf4cka"]}',
			)
			.reply(
				200,
				'{"data":[{"address":"tb1qlj3qkv9c5j5gfqgfnqjl0nkwuvw8ktq9u3ahg0du4jnde852nrcstf4cka","txId":"96fd8958fc3d07e73be8adc1888f6fbd1a302df067a3784bdd8ef6e11e1a2afc","outputIndex":1,"script":"0020fca20b30b8a4a88481099825f7cecee31c7b2c05e47b743dbcaca6dc9e8a98f1","satoshis":29400},{"address":"tb1qsyz35zpeueuwmcjap75flg93mny2gn7v3urnnwe4k05rcnvnp4cqq7hew2","txId":"dfa81f23ae409a2b82184c05a8f8bb30d72997e45947577ee2a3e859bc712349","outputIndex":1,"script":"002081051a0839e678ede25d0fa89fa0b1dcc8a44fcc8f0739bb35b3e83c4d930d70","satoshis":200}],"links":{"first":"https:\\/\\/btc-test.payvo.com\\/api\\/wallets\\/transactions\\/unspent?page=1","last":"https:\\/\\/btc-test.payvo.com\\/api\\/wallets\\/transactions\\/unspent?page=1","prev":null,"next":null},"meta":{"current_page":1,"from":1,"last_page":1,"links":[{"url":null,"label":"&laquo; Previous","active":false},{"url":"https:\\/\\/btc-test.payvo.com\\/api\\/wallets\\/transactions\\/unspent?page=1","label":"1","active":true},{"url":null,"label":"Next &raquo;","active":false}],"path":"https:\\/\\/btc-test.payvo.com\\/api\\/wallets\\/transactions\\/unspent","per_page":15,"to":2,"total":2}}',
			)
			.post(
				"/api/wallets/transactions/raw",
				'{"transaction_ids":["96fd8958fc3d07e73be8adc1888f6fbd1a302df067a3784bdd8ef6e11e1a2afc","dfa81f23ae409a2b82184c05a8f8bb30d72997e45947577ee2a3e859bc712349"]}',
			)
			.reply(
				200,
				'{"data":{"96fd8958fc3d07e73be8adc1888f6fbd1a302df067a3784bdd8ef6e11e1a2afc":"020000000001014a0faedaff74b18f7006f2b2f81307cc5b8154c000e25d3118bc87cac13fb66d0100000000feffffff021027000000000000160014a01a1636f33506c052bf4a364ce53b394e7aa45bd872000000000000220020fca20b30b8a4a88481099825f7cecee31c7b2c05e47b743dbcaca6dc9e8a98f1040047304402202d6b1c5ef37be273068c14f95fc8fc20099d8657d6766662d42956fad084a29c022016a9c48bdc33b50ff120a11f1840016b6bbaac248fd2d189557ff3a6d5a786750147304402205a5c5a659b1f290fdebcab7d12544d2a65814be6d088008ec59ba32f2d108b6c022058bd6dc0558dc7a8ae399a37fffaa1bf7e9be8dd7e4afe55e138957158c957150169522102fea3527c9398971bc6c91be1e65d68bf831bd47e458576b2f9b5a79275d74ff121037c2d5c9b848807f6e71d7b463b378f86a975833e2d2cf589f90c6a9bc4ff402c210393b4e3bdc8b44a771bdb94032a973c918cd430f57b44ca90fe5c7a94e470a15653ae2bff1f00","dfa81f23ae409a2b82184c05a8f8bb30d72997e45947577ee2a3e859bc712349":"0200000000010106d3da99cdc6d87d89a1c0196ea105aa62ba0a431f163ed981a456646a3a067b0100000000ffffffff02f08101000000000017a9141fa993e76d714a6b603abea2361c20c0c7f003bb87c80000000000000022002081051a0839e678ede25d0fa89fa0b1dcc8a44fcc8f0739bb35b3e83c4d930d700400483045022100cdbd7729f8a25152e2eef2e4a737240dd553165c62370c12b9ee85f67c0c512302203a69e1285e21aff88f75ed144fe90a1bd1a826c9b2f042b9360ffdf54c33055b0147304402205150444107b40c102ae1455fe7099653216de2eba83009105722e5d879e2be9602200443f5866804005e0f37dcf7b343ad56c137b9c49eaaf19e54b5c52a5561b6ca016952210314e9ec814e8f5c7e7b16e17a0a8a65efea64c88f01085aaed41ebac7df9bf6e121032b0996a84fb0449a899616ca746c8e6cfc5d8f823114ba6bd7aed5b4e90442e221033830fa105ee889ae98074506e9d5f1153aafa64fa828904843204564f95a492653ae00000000"}}',
			)
			.get("/api/fees")
			.reply(200, {
				data: {
					min: 0.00001074,
					avg: 0.00000002,
					max: 0.00180617,
				},
			})
			.persist();
	});

	it("should generate a transfer transaction", async (context) => {
		const multiSignatureAsset = {
			min: 2,
			publicKeys: musig.accounts.map((account) => account.nativeSegwitMasterPublicKey),
		};
		const signatory = new Signatories.Signatory(
			new Signatories.MultiSignatureSignatory(multiSignatureAsset, "address"),
			multiSignatureAsset,
		);
		const result = await context.subject.transfer({
			data: {
				amount: 0.0001,
				to: "tb1q705a7ak4ejlmfc5uq3afg2q45v4yw7kyv8jgsn",
			},
			signatory,
		});

		assert.is(result.id(), "5f74b4e299f42315727024fde9cb95a387d31f260e7c0a91cea6724fa656e458");
		assert.is(result.sender(), "tb1qzdtkhgwyqnufeuc3tq88d74plcagcryzmfwclyadxgj90kwvhpps0gu965");
		assert.is(result.recipient(), "tb1q705a7ak4ejlmfc5uq3afg2q45v4yw7kyv8jgsn");
		assert.is(result.amount().toNumber(), 10_000);
		assert.is(result.fee().toNumber(), 374);
		assert.instance(result.timestamp(), DateTime);
		assert.is(result.toBroadcast(), unsignedNativeSegwitMusigTransferTx.psbt);

		// Now make participants sign their parts

		const wallet1 = {
			signingKey: musig.accounts[0].mnemonic,
			path: musig.accounts[0].nativeSegwitMasterPath,
		};
		const signatory1 = new Signatories.Signatory(
			new Signatories.MnemonicSignatory({
				signingKey: wallet1.signingKey,
				address: "address", // Not needed / used
				publicKey: wallet1.path, // TODO for now we use publicKey for passing path
				privateKey: "privateKey", // Not needed / used
			}),
		);

		const signed1 = await context.musigService.addSignature(
			{
				id: result.id(),
				...result.data(),
				psbt: result.toBroadcast(),
				signatures: [],
			},
			signatory1,
		);

		assert.is(signed1.id(), "5f74b4e299f42315727024fde9cb95a387d31f260e7c0a91cea6724fa656e458");
		assert.is(signed1.sender(), "tb1qzdtkhgwyqnufeuc3tq88d74plcagcryzmfwclyadxgj90kwvhpps0gu965");
		assert.is(signed1.recipient(), "tb1q705a7ak4ejlmfc5uq3afg2q45v4yw7kyv8jgsn");
		assert.is(signed1.amount().toNumber(), 10_000);
		assert.is(signed1.fee().toNumber(), 374);
		assert.instance(signed1.timestamp(), DateTime);
		assert.is(signed1.toBroadcast(), oneSignatureNativeSegwitMusigTransferTx.psbt);

		const wallet2 = {
			signingKey: musig.accounts[1].mnemonic,
			path: musig.accounts[1].nativeSegwitMasterPath,
		};
		const signatory2 = new Signatories.Signatory(
			new Signatories.MnemonicSignatory({
				signingKey: wallet2.signingKey,
				address: "address", // Not needed / used
				publicKey: wallet2.path, // TODO for now we use publicKey for passing path
				privateKey: "privateKey", // Not needed / used
			}),
		);

		const signed2 = await context.musigService.addSignature(
			{
				id: signed1.id(),
				...signed1.data(),
				psbt: signed1.toBroadcast(),
				signatures: [],
			},
			signatory2,
		);

		assert.is(signed2.id(), "5f74b4e299f42315727024fde9cb95a387d31f260e7c0a91cea6724fa656e458");
		assert.is(signed2.sender(), "tb1qzdtkhgwyqnufeuc3tq88d74plcagcryzmfwclyadxgj90kwvhpps0gu965");
		assert.is(signed2.recipient(), "tb1q705a7ak4ejlmfc5uq3afg2q45v4yw7kyv8jgsn");
		assert.is(signed2.amount().toNumber(), 10_000);
		assert.is(signed2.fee().toNumber(), 374);
		assert.instance(signed2.timestamp(), DateTime);
		assert.is(signed2.toBroadcast(), twoSignatureNativeSegwitMusigTransferTx.psbt);

		const signedFinal = bitcoin.Psbt.fromBase64(signed2.toBroadcast());
		assert.true(signedFinal.validateSignaturesOfAllInputs(signatureValidator));

		signedFinal.finalizeAllInputs();
		assert.is(
			signedFinal.extractTransaction().toHex(),
			"02000000000101fc2a1a1ee1f68edd4b78a367f02d301abd6f8f88c1ade83be7073dfc5889fd960100000000ffffffff021027000000000000160014f3e9df76d5ccbfb4e29c047a942815a32a477ac4524a000000000000220020cc29fc62cc2f96fe6e64638d895fc4aff3beb5fc5ba5faff08a5497359abfa080400473044022066a9bba1433025ddfd2e8915c91ef7a83815f7487844ede9d0fc7e508734de24022067058b1d83eaff20075624e72225f1c2795faeccc74841a44f209b7b1f0d91aa01473044022062d77ba018c7c4bcef5e2e12a88a7487458ff621092faf860a337f79785750f3022068277031a2b04c731b381789d4dc9471a75baee2136e7c6cf4d72f836fd409d20169522102694992474a7b5f54e32f9533eb8638e3fe2febe1fd91fa58851206c1fe65d18a2102a0bc42bd4d44a93e066381c442733401357a9a6f30bd0ed9c35dd70e9a0947062103da12a46cc7bd880762b4e9fb7e99496e88dd2ab8cf15dbb195d3d8348a462ac053ae00000000",
		);
	});
});

describe("Musig (fake) registration", async ({ assert, it, stub, beforeEach }) => {
	beforeEach(async (context) => {
		await createLocalServices(context);

		stub(UUID, "random").returnValueOnce("189f015c-2a58-4664-83f4-0b331fa9172a");
	});

	it("should succeed", async (context) => {
		const wallet1 = {
			signingKey: musig.accounts[0].mnemonic,
			path: musig.accounts[0].nativeSegwitMasterPath,
		};

		const wallet2 = {
			signingKey: musig.accounts[1].mnemonic,
			path: musig.accounts[1].nativeSegwitMasterPath,
		};

		const wallet3 = {
			signingKey: musig.accounts[2].mnemonic,
			path: musig.accounts[2].nativeSegwitMasterPath,
		};

		const transaction1 = await context.subject.renamedMultiSignature({
			signatory: new Signatories.Signatory(
				new Signatories.MnemonicSignatory({
					signingKey: wallet1.signingKey,
					address: "address", // Not needed / used
					publicKey: wallet1.path, // @TODO for now we use publicKey for passing path
					privateKey: "privateKey", // Not needed / used
				}),
			),
			data: {
				min: 2,
				numberOfSignatures: 3,
				publicKeys: [musig.accounts[0].nativeSegwitMasterPublicKey],
				derivationMethod: "nativeSegwitMusig",
			},
		});

		assert.instance(transaction1, SignedTransactionData);
		assert.snapshot("musig-registration-transaction1", transaction1);

		const transaction2 = await context.musigService.addSignature(
			transaction1.data(),
			new Signatories.Signatory(
				new Signatories.MnemonicSignatory({
					signingKey: wallet2.signingKey,
					address: "address", // Not needed / used
					publicKey: wallet2.path, // @TODO really? We need a way to pass in the account path
					privateKey: "privateKey", // Not needed / used
				}),
			),
		);

		assert.instance(transaction2, SignedTransactionData);
		assert.snapshot("musig-registration-transaction2", transaction2);

		const transaction3 = await context.musigService.addSignature(
			transaction2.data(),
			new Signatories.Signatory(
				new Signatories.MnemonicSignatory({
					signingKey: wallet3.signingKey,
					address: "address", // Not needed / used
					publicKey: wallet3.path, // @TODO really?
					privateKey: "privateKey", // Not needed / used
				}),
			),
		);

		assert.instance(transaction3, SignedTransactionData);
		assert.snapshot("musig-registration-transaction3", transaction3);
	});
});
