import { SiteParser, ParsedSite } from "../../../types/types";
import request from "axios";
import * as cheerio from "cheerio";

export default class BitcoinLiveParser implements SiteParser {
    getLatestSites(): Promise<ParsedSite[]> {
        return this.getSites(1);
    }
    private url: string = "https://bitcoin.live/blogs?author=8";

    async getSites(take?: number, after?: Date): Promise<ParsedSite[]> {
        let response = await request(this.url);
        let articles = findArticles(response.data);
        let promises = articles.map(getSitesFromArticle);
        if (take) {
            promises = promises.slice(0, take);
        }
        let sitesPromises = Promise.all(promises);
        let sites = await sitesPromises;
        if (after) {
            sites = sites.filter(site => site.date && site.date > after);
        }
        return sites;
    }
}

let findArticles = (html: string): string[] => {
    const $ = cheerio.load(html);
    let links = $(".link-block a[href]");
    let urls = links.map((index, element) => element.attribs.href).get();
    return urls;
};

let getSitesFromArticle = async (url: string): Promise<ParsedSite> => {
    let response = await request(url);
    let site = parseArticle(response.data);
    site.url = url;
    return site;
};

let parseArticle = (html: string): ParsedSite => {
    const $ = cheerio.load(html, { xmlMode: false });
    let site = new ParsedSite();
    site.title = $('meta[property*="title"]').attr("content");
    site.description = $('meta[property*="description"]').attr("content");
    let swatch = $('img[src*="swatch"]').attr("src");
    if (swatch) {
        let videoUrl = swatch.replace("swatch", "");
        site.videoUrls = [videoUrl];
    }
    let dateString = $(".published_at").text();
    if (dateString) {
        dateString += " CST";
        site.date = new Date(Date.parse(dateString));
    }
    return site;
};
