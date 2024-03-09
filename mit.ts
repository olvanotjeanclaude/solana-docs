import base58 from 'bs58';

import { percentAmount, generateSigner, signerIdentity, createSignerFromKeypair, Umi, KeypairSigner } from '@metaplex-foundation/umi'
import { Metadata, TokenStandard, createAndMint } from '@metaplex-foundation/mpl-token-metadata'
import { mplCandyMachine } from "@metaplex-foundation/mpl-candy-machine";
import { createUmi } from '@metaplex-foundation/umi-bundle-defaults';
import { CLUSTER_URL } from './constant';
import { LAMPORTS_PER_SOL } from '@solana/web3.js';

import "@solana/web3.js";

export async function generateWalletSigner(secretKey: string): Promise<{ mint: KeypairSigner, umi: any }> {
    const umi = createUmi(CLUSTER_URL); //Replace with your QuickNode RPC Endpoint
    const secretArray = new Uint8Array(base58.decode(secretKey));
    const userWallet = umi.eddsa.createKeypairFromSecretKey(secretArray);

    const userWalletSigner = createSignerFromKeypair(umi, userWallet);

    const mint: KeypairSigner = generateSigner(umi);

    umi.use(signerIdentity(userWalletSigner));

    umi.use(mplCandyMachine());

    return {
        mint,
        umi
    }
}

export async function buildMint(umi: Umi, mint: KeypairSigner, metadata: any, userWalletSecret: string, amount: number) {
    const secret = base58.decode(userWalletSecret);
    const userWallet = umi.eddsa.createKeypairFromSecretKey(new Uint8Array(secret));

    const userWalletSigner = createSignerFromKeypair(umi, userWallet);

    return await createAndMint(umi, {
        mint,
        authority: umi.identity,
        name: metadata.name,
        symbol: metadata.symbol,
        uri: metadata.uri,
        sellerFeeBasisPoints: percentAmount(0),
        decimals: 9,
        amount: amount * LAMPORTS_PER_SOL,
        tokenOwner: userWallet.publicKey,
        tokenStandard: TokenStandard.Fungible,
    }).sendAndConfirm(umi).then(() => {

        console.log(`Successfully minted  million tokens ( ${mint.publicKey} ")`);
    });
}