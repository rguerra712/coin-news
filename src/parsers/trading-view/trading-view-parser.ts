import { ParsedSite } from './../../../types/types';
import { SiteParser, ParsedSite } from "../../../types/types";
import request from "axios";
import TradingViewHtmlLinkParser from "./trading-view-html-link-parser";

export default class TradingViewParser implements SiteParser {
    private url: string = "https://www.tradingview.com/chat/#bitcoin";

    getLatestSites(): Promise<ParsedSite[]> {
        return this.getSites(1);
    }

    async getSites(take?: number, after?: Date): Promise<ParsedSite[]> {
        let html = await this.getHtml(this.url);
        if (!html) {
            throw new Error(`unable to load html for site at ${this.url}`);
        }
        let linkParser = new TradingViewHtmlLinkParser(html);
        let links = linkParser.getLinksFromChats();
        let sitePromises = links.map(link => this.getParsedSiteFrom(link));
        return Promise.all(sitePromises);
    }

    async getHtml(url: string): Promise<string> {
        let response = await request(url);
        return response.data;
    }

    async getParsedSiteFrom(url: string): Promise<ParsedSite> {
        let html = await this.getHtml(url);
        let $ = cheerio.load(html);
        let site = new ParsedSite();
        site.title = $('title').text();
        site.url = url;
        return site;
    }
}
