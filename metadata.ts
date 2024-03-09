import bas58 from 'bs58';
import {
    Connection,
    Keypair,
    PublicKey,
    SystemProgram,
    Transaction,
    clusterApiUrl,
    sendAndConfirmTransaction,
} from "@solana/web3.js";
import {
    ExtensionType,
    TOKEN_2022_PROGRAM_ID,
    createInitializeMintInstruction,
    getMintLen,
    createInitializeMetadataPointerInstruction,
    getMint,
    getMetadataPointerState,
    getTokenMetadata,
    TYPE_SIZE,
    LENGTH_SIZE,
    createUpdateMetadataPointerInstruction,
} from "@solana/spl-token";
import {
    createInitializeInstruction,
    createUpdateFieldInstruction,
    createRemoveKeyInstruction,
    pack,
    TokenMetadata,
} from "@solana/spl-token-metadata";

try {
    demo()
} catch (error) {
    console.log(error);
}

async function demo() {
    const connection = new Connection(clusterApiUrl("devnet"), "confirmed");
    const payer = Keypair.fromSecretKey(Buffer.from(bas58.decode("5Uy7H8vhh4QKyq8m5J2sJ4fYHKiGjMSVZUaMcUsSTgwy5nXCH8U419RA6iCrchDFCoQC8csHcWpoNstqgBkUCcC1")));
    const mint = new PublicKey("4Mwbyou5SEPvsK2U1cqZ2z3RGfG3V5avNNu6fU3JiMdK");

    const metaData: TokenMetadata = {
        updateAuthority: new PublicKey(payer.publicKey),
        mint: mint,
        name: "Olibaba Token",
        symbol: "OT",
        uri: "https://bafkreids5orlndz7c2kfclbd5f2metjokytkqbpbvrvs65edonv3xftb2e.ipfs.nftstorage.link/",
        additionalMetadata: [["description", "Nice to see you bro, we have fun"]],
    };


    // Instruction to update metadata, adding custom field
    const updateFieldInstruction = createUpdateFieldInstruction({
        programId: TOKEN_2022_PROGRAM_ID, // Token Extension Program as Metadata Program
        metadata: mint, // Account address that holds the metadata
        updateAuthority: new PublicKey(payer.publicKey), // Authority that can update the metadata
        field: metaData.additionalMetadata[0][0], // key
        value: metaData.additionalMetadata[0][1], // value
    });

    // Add instructions to new transaction
    const transaction = new Transaction();

    transaction.add(
        updateFieldInstruction,
    );

    // Send transaction
    const transactionSignature = await sendAndConfirmTransaction(
        connection,
        transaction,
        [payer], // Signers
    );

    console.log(
        "\nCreate Mint Account:",
        `https://solana.fm/tx/${transactionSignature}?cluster=devnet-solana`,
    );

    // Retrieve mint information
    const mintInfo = await getMint(
        connection,
        mint,
        "confirmed",
        TOKEN_2022_PROGRAM_ID,
    );

    // Retrieve and log the metadata pointer state
    const metadataPointer = getMetadataPointerState(mintInfo);
    console.log("\nMetadata Pointer:", JSON.stringify(metadataPointer, null, 2));

    // Retrieve and log the metadata state
    const metadata = await getTokenMetadata(
        connection,
        mint, // Mint Account address
    );
    console.log("\nMetadata:", JSON.stringify(metadata, null, 2));
}