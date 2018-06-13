import { SiteParser } from "../../types/types";
import BitcoinLiveParser from "./bitcoin-live/bitcoin-live-parser";

export class ParserProvider {
    getAllParsers(): SiteParser[] {
        return [new BitcoinLiveParser()];
    }
}
