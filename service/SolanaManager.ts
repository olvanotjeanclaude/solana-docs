import { Connection, Keypair } from "@solana/web3.js";
import WalletManager, { WalletInformation } from "./WalletManager";
import base58 from "bs58";
import Airdrop from "./Airdrop";
import MintManager, { IMetadata } from "./MintManager";


class SolanaManager {
    private mainWallet: Keypair = Keypair.generate();
    private walletManager: WalletManager;
    private metaData: IMetadata;

    constructor() {
        this.metaData = {
            uri: "test",
            name: "AKORY ABY E",
            symbol: ""
        };
        this.walletManager = new WalletManager();

        // generate wallets
        this.walletManager.generateWallets();
    }

    public async fundAllWallets() {
        // fund main wallet : wallet 0
        Airdrop.send(this.mainWallet, 1);

        // fund wallet 1 -> wallet 5;
        const wallets = this.walletManager.getWallets();

        await Airdrop.send(wallets[1], 0.001);
        setTimeout(() => { }, 3000);

        await Airdrop.send(wallets[2], 0.003);
        setTimeout(() => { }, 3000);

        await Airdrop.send(wallets[3], 0.009);
        setTimeout(() => { }, 3000);

        await Airdrop.send(wallets[4], 0.009);
        setTimeout(() => { }, 3000);
        await Airdrop.send(wallets[5], 0.009);
    }

    public mintToken(amount:number) {
        const mintManager = new MintManager(this.walletManager.getMainWalletSecret());

        mintManager.setMetadata(this.metaData);

        mintManager.buildMint(amount);
    }

    generateWalletAndAirdropOneSOL() {
        function _generateWallet() {
            const wallet = Keypair.generate();
            console.log(`Generated new KeyPair. Wallet PublicKey: `, wallet.publicKey.toString());

            const privateKey = base58.encode(wallet.secretKey);
            console.log(`Wallet PrivateKey:`, privateKey);

            return wallet;
        }

        Airdrop.send(_generateWallet(), 1);
    }

    public getMainWallet(): Keypair {
        return this.mainWallet;
    }

    public getWalletInformations():Array<WalletInformation>{
        return this.walletManager.getWalletInformations();
    }
}

export default SolanaManager;