import { Connection, clusterApiUrl } from "@solana/web3.js";

export const metaData = {
    "name": "Olibaba Token",
    "symbol": "OT",
    "uri": "https://bafkreids5orlndz7c2kfclbd5f2metjokytkqbpbvrvs65edonv3xftb2e.ipfs.nftstorage.link/",
    "additionalMetadata": [["description", "Nice to see you bro, we have fun"]],
};

export const tokenAsset = {
    ...metaData,
    "image": "https://bafkreiciuekeralfdkay2ahgnwnulxlbvf7z3x4iqje3jjpd5ywtwgocky.ipfs.nftstorage.link/"
}

export const CLUSTER_URL = clusterApiUrl("devnet");

export const connection = new Connection(CLUSTER_URL);
