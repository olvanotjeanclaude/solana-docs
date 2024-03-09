import { Keypair, LAMPORTS_PER_SOL } from "@solana/web3.js";
import bs58 from 'bs58';
import { connection } from "./constant";

export async function airdropSol(wallet: Keypair, amount: number) {
    const airdropSignature = connection.requestAirdrop(
        wallet.publicKey,
        amount * LAMPORTS_PER_SOL,
    );
    try {
        const txId = await airdropSignature;
        console.log(`Airdrop Transaction Id: ${txId}`);
        console.log(`https://explorer.solana.com/tx/${txId}?cluster=devnet`)

        return airdropSignature;
    }
    catch (err) {
        console.log(err);
    }
};

export async function generateWalletAndAirdrop() {
    function _generateWallet() {
        const wallet = Keypair.generate();
        console.log(`Generated new KeyPair. Wallet PublicKey: `, wallet.publicKey.toString());
    
        const privateKey = bs58.encode(wallet.secretKey);
        console.log(`Wallet PrivateKey:`, privateKey);
    
        return wallet;
    }

    airdropSol(_generateWallet(), 1);
}
