import { CLUSTER_URL } from './../constant';
import { Connection, Keypair, LAMPORTS_PER_SOL } from "@solana/web3.js";

class Airdrop {
    public static async send(wallet: Keypair, amount: number): Promise<string> {
        const connection = new Connection(CLUSTER_URL);
        const airdropSignature = await connection.requestAirdrop(
            wallet.publicKey,
            amount * LAMPORTS_PER_SOL,
        ).then(airdropSignature => {
            const txId = airdropSignature;
            console.log(`Airdrop Transaction Id: ${txId}`);
            console.log(`https://explorer.solana.com/tx/${txId}?cluster=devnet`)

            return airdropSignature;
        })
            .catch((err) => {
                throw err;
            });

        return airdropSignature;
    };
}

export default Airdrop;