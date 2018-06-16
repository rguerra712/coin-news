
import { SiteParser, ParsedSite } from "../../../types/types";

export default class TradingViewParser implements SiteParser {
    private url: string = "https://www.tradingview.com/chat/#bitcoin";
    
    getLatestSites(): Promise<ParsedSite[]> {
        return this.getSites(1);
    }
    
    async getSites(take?: number, after?: Date): Promise<ParsedSite[]> {
        return [new ParsedSite()];
    }


}
