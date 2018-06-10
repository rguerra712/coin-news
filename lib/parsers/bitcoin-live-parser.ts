import { SiteParser, ParsedSite } from "../../types/types";

export default class BitcoinLiveParser implements SiteParser {
    getSites(take?: number, after?: Date): ParsedSite[] {
        let sites:ParsedSite[] = [];
        return sites;
    }
}