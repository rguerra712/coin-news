import { HtmlAfterLoad } from "./../../html-after-load";
import { SiteParser, ParsedSite } from "../../../types/types";
import request from "axios";
import TradingViewHtmlLinkParser from "./trading-view-html-link-parser";
import * as cheerio from "cheerio";
import getCacheDateFor from "../../cache-date-determiner";

export default class TradingViewParser implements SiteParser {
    isFrequent(): boolean {
        return true;
    }
    private url: string = "https://www.tradingview.com/chat/%23bitcoin";

    getLatestSites(): Promise<ParsedSite[]> {
        return this.getSites(2, new Date(Date.now() - 3 * 1000 * 60));
    }

    async getSites(take?: number, after?: Date): Promise<ParsedSite[]> {
        let html = await this.getHtml(this.url);
        if (!html) {
            throw new Error(`unable to load html for site at ${this.url}`);
        }
        let linkParser = new TradingViewHtmlLinkParser(html);
        let chats = linkParser.getChats();
        if (chats.length === 0) {
            let htmlAfterLoad = new HtmlAfterLoad();
            html = await htmlAfterLoad.getHtml(this.url);
            linkParser = new TradingViewHtmlLinkParser(html);
        }
        let links = linkParser.getLinksFromChats();
        if (links.length > 0) {
            links.forEach(link =>
                console.log(`link found for trading view at: ${link}`)
            );
        }
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
        site.title = $("title").text();
        site.description = htmlToText.fromString(html);
        site.url = url;
        site.shouldUseUrlForLink = false;
        try {
            site.date = await getCacheDateFor(url);
        } catch (error) {
            console.error(`error logging date for ${url} with error ${error}`);
        }
        return site;
    }
}
