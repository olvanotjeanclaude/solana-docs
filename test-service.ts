import { IMetadata } from "./service/MintManager";
import SolanaManager from "./service/SolanaManager";


const metaData :IMetadata={
    uri: "test",
    name: "AKORY ABY E",
    symbol: ""
}
const service = new SolanaManager();


console.log(service);