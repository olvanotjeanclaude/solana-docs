import { KeypairSigner, Umi } from "@metaplex-foundation/umi";
import { buildMint, generateWalletSigner } from "./mit";
import base58 from "bs58";

interface BuildMint {
    mint: KeypairSigner; // Assuming KeypairSigner is the type of your mint
    umi: Umi; // Adjust 'any' to the appropriate type for umi
}

(async () => {
    try {
        // await generateWalletAndAirdrop();
        const secretKey = "34bbWP7LEmTxEAk2zkzKSCJHeoL3jFJSb93agHQvMFncpEzjXiz2REKfL9bG5tQZ9ZfyRFCYqgqDSQtxhoqs2GuA";
       
        // const payer = Keypair.fromSecretKey(Buffer.from(base58.decode(secretKey)));

        const { mint, umi }: BuildMint = await generateWalletSigner(secretKey);

        const metaData = {
            updateAuthority: umi.identity,
            mint: mint,
            uri: "https://bafkreids5orlndz7c2kfclbd5f2metjokytkqbpbvrvs65edonv3xftb2e.ipfs.nftstorage.link/",
            name: "Olibaba Token",
            symbol: "OT",
            additionalMetadata: [["description", "Nice to see you bro, we have fun"]],
        };

        await buildMint(umi, mint, metaData, secretKey, 200);
    } catch (error) {

    }
})()

