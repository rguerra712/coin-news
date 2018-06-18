import { SiteParser } from "../../types/types";
import BitcoinLiveParser from "./bitcoin-live/bitcoin-live-parser";
import TradingViewParser from "./trading-view/trading-view-parser";

export class ParserProvider {
    getAllParsers(): SiteParser[] {
        return [
            // new TradingViewParser(),
            new BitcoinLiveParser(),
        ];
    }
}
