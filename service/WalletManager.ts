import { Connection, Keypair, LAMPORTS_PER_SOL } from "@solana/web3.js";
import base58 from "bs58";
import Airdrop from "./Airdrop";

export interface WalletInformation {
    public_key: string,
    private_key: string
}


class WalletManager {
    private COUNT_WALLET = 33;
    private wallets: Keypair[];
    private walletInformations: Array<WalletInformation>;
    private mainWallet: Keypair;

    public airdropWallet() {
        if (this.wallets.length == 0) throw "Provide the wallet";

        Airdrop.send(this.mainWallet, 1);
    }

    public generateWallets() {
        for (let i = 0; i < this.COUNT_WALLET; i++) {
            const newWallet = Keypair.generate();
            this.wallets.push(newWallet);

            this.walletInformations.push({
                public_key: newWallet.publicKey.toBase58(),
                private_key: base58.encode(newWallet.secretKey)
            });
        }

        this.mainWallet = this.wallets[0];
    }

    public getMainWallet(): Keypair {
        return this.mainWallet;
    }

    public getWallets(): Array<Keypair> {
        return this.wallets;
    }

    public getWalletInformations(): Array<WalletInformation> {
        return this.walletInformations;
    }

    public getMainWalletSecret(): string {
        return base58.encode(this.mainWallet.secretKey)
    }
}

export default WalletManager;