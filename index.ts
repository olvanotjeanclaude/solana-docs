
import { Connection, Keypair, LAMPORTS_PER_SOL, PublicKey, Transaction, clusterApiUrl, sendAndConfirmTransaction } from "@solana/web3.js"
import bs58 from "bs58";
import { AuthorityType, createFreezeAccountInstruction, createMint, createSetAuthorityInstruction, getAccount, getMint, getOrCreateAssociatedTokenAccount, mintTo, revoke, transfer } from "@solana/spl-token"
import base58 from "bs58";

(async () => {
    try {
        const connection = new Connection(clusterApiUrl('devnet'), 'confirmed');

        // create account
        const payer = Keypair.generate();
        const payerPublicKey = payer.publicKey.toBase58();

        console.log("public_key:", payerPublicKey);
        console.log("private key:", bs58.encode(payer.secretKey));

        // const payer = Keypair.fromSecretKey(Buffer.from(bs58.decode("5Uy7H8vhh4QKyq8m5J2sJ4fYHKiGjMSVZUaMcUsSTgwy5nXCH8U419RA6iCrchDFCoQC8csHcWpoNstqgBkUCcC1")));

        // send 1 sol to new account
        const airdropSignature = await connection.requestAirdrop(
            new PublicKey(payer.publicKey.toBase58()), 1 * LAMPORTS_PER_SOL
        )

        console.log("airdroping signature:", airdropSignature)

        // create mint
        const mint = await createMint(connection, payer, payer.publicKey, null, 9)
        console.log("mint:", mint.toString());

        const mintAddress = new PublicKey("4Mwbyou5SEPvsK2U1cqZ2z3RGfG3V5avNNu6fU3JiMdK");

        // mint information
        const mintInfo = await getMint(connection, mintAddress)
        console.log("mint info:", mintInfo.supply);

        const tokenAccount = await getOrCreateAssociatedTokenAccount(
            connection,
            payer,
            mintAddress,
            payer.publicKey
        )

        console.log("token info:", tokenAccount.address.toBase58());

        // check token info balance

        // Mint  tokens
        const signature = await mintTo(
            connection,
            payer,
            mintAddress,
            tokenAccount.address,
            payer,
            100_000_000_000 // because decimals for the mint are set to 9 
        )

        const destinstion = new PublicKey("4V47DLnmBFCczcXgRCMcquwoppye9mdUT2Aa3XMDrexy");
        const receiverTokenAccount = await getOrCreateAssociatedTokenAccount(
            connection,
            payer,
            mintAddress,
            destinstion
        )

        console.log("receiver token acoount: " + receiverTokenAccount.address)

        // transfering mint
        const transferSignature = await transfer(
            connection,
            payer,
            tokenAccount.address,
            receiverTokenAccount.address,
            payer.publicKey,
            20);

        console.log("transfer Signature " + transferSignature);

        // const transaction = new Transaction();

        // transaction.add(
        //     // createFreezeAccountInstruction(mintAddress, mintAddress, payer.publicKey),
        //     createSetAuthorityInstruction(
        //         mintAddress,
        //         payer.publicKey,
        //         AuthorityType.MintTokens,
        //         null,
        //     ))

        // const data = await sendAndConfirmTransaction(connection, transaction, [payer]);

        // console.log(data);

    } catch (error) {
        console.log(error);
    }

})()

