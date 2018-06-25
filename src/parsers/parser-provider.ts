import { SiteParser } from "../types/types";
import { BitcoinLiveParser } from "./bitcoin-live/bitcoin-live-parser";
import { TradingViewParser } from "./trading-view/trading-view-parser";

export class ParserProvider {
    getAllParsers(isFrequent?: boolean): SiteParser[] {
        const allParsers = [new TradingViewParser(), new BitcoinLiveParser()];
        if (isFrequent === true) {
            return allParsers.filter(parser => parser.isFrequent());
        } else if (isFrequent === false) {
            return allParsers.filter(parser => !parser.isFrequent());
        }
        return allParsers;
    }
}
