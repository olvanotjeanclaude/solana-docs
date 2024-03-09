import base58 from 'bs58';
import { percentAmount, generateSigner, signerIdentity, createSignerFromKeypair, Umi, KeypairSigner } from '@metaplex-foundation/umi'
import { TokenStandard, createAndMint } from '@metaplex-foundation/mpl-token-metadata'
import { mplCandyMachine } from "@metaplex-foundation/mpl-candy-machine";
import { createUmi } from '@metaplex-foundation/umi-bundle-defaults';
import { LAMPORTS_PER_SOL } from '@solana/web3.js';
import { CLUSTER_URL } from '../constant';
import "@solana/web3.js";

export interface IMetadata {
    uri: string,
    name: string,
    symbol: string
}

class MintManager {
    private umi: Umi;
    private mint: KeypairSigner;
    private secretKey: string;
    private metadata: IMetadata;

    constructor(secretKey: string) {
        this.umi = createUmi(CLUSTER_URL);
        this.secretKey = secretKey;
        this.mint = generateSigner(this.umi);

        this.initializeWalletSigner();
    }

    public setMetadata(metadata: IMetadata) {
        if (!this.mint) throw "Please provide the mint";

        const data = {
            updateAuthority: this.umi.identity,
            mint: this.mint,
            uri: metadata.uri,
            name: metadata.name,
            symbol: metadata.symbol,
        };

        this.metadata = data;
    }

   private initializeWalletSigner(): KeypairSigner {
        const secretArray = new Uint8Array(base58.decode(this.secretKey));
        const userWallet = this.umi.eddsa.createKeypairFromSecretKey(secretArray);

        const userWalletSigner = createSignerFromKeypair(this.umi, userWallet);

        this.umi.use(signerIdentity(userWalletSigner));

        this.umi.use(mplCandyMachine());

        return userWalletSigner;
    }

    async buildMint(amount: number) {
        if (!this.mint) throw "Please provide the mint";

        if (!this.metadata.name && !this.metadata.symbol && !this.metadata.uri) {
            throw "Please provide the metaname";
        }

        const secret = base58.decode(this.secretKey);

        const userWallet = this.umi.eddsa.createKeypairFromSecretKey(new Uint8Array(secret));

        if (!userWallet) throw "Unable to retrieve user wallet";

        await createAndMint(this.umi, {
            mint: this.mint,
            authority: this.umi.identity,
            name: this.metadata.name,
            symbol: this.metadata.symbol,
            uri: this.metadata.uri,
            sellerFeeBasisPoints: percentAmount(0),
            decimals: 9,
            amount: amount * LAMPORTS_PER_SOL,
            tokenOwner: userWallet.publicKey,
            tokenStandard: TokenStandard.Fungible,
        })
            .sendAndConfirm(this.umi)
            .then(() => {
                console.log(`Successfully minted  million tokens ( ${this.mint.publicKey} ")`);
            })
            .catch(err => {
                throw err;
            });

        return this;
    }

    public getMint() {
        return this.mint;
    }
}

export default MintManager;