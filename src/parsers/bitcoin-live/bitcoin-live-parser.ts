import { SiteParser, ParsedSite } from "../../types/types";
import request from "axios";
import * as cheerio from "cheerio";

export class BitcoinLiveParser implements SiteParser {
    isFrequent(): boolean {
        return false;
    }
    getLatestSites(): Promise<ParsedSite[]> {
        return this.getSites(1);
    }
    private url = "https://bitcoin.live/blogs?author=8";

    async getSites(take?: number, after?: Date): Promise<ParsedSite[]> {
        const response = await request(this.url);
        const articles = findArticles(response.data);
        let promises = articles.map(getSitesFromArticle);
        if (take) {
            promises = promises.slice(0, take);
        }
        const sitesPromises = Promise.all(promises);
        let sites = await sitesPromises;
        if (after) {
            sites = sites.filter(site => site.date && site.date > after);
        }
        return sites;
    }
}

const findArticles = (html: string): string[] => {
    const $ = cheerio.load(html);
    const links = $(".link-block a[href]");
    const urls = links.map((index, element) => element.attribs.href).get();
    return urls;
};

const getSitesFromArticle = async (url: string): Promise<ParsedSite> => {
    const response = await request(url);
    const site = parseArticle(response.data);
    site.url = url;
    return site;
};

const parseArticle = (html: string): ParsedSite => {
    const $ = cheerio.load(html, { xmlMode: false });
    const site = new ParsedSite();
    site.title = $('meta[property*="title"]').attr("content");
    site.description = $('meta[property*="description"]').attr("content");
    const swatch = $('img[src*="swatch"]').attr("src");
    if (swatch) {
        const videoUrl = swatch.replace("swatch", "");
        site.videoUrls = [videoUrl];
    }
    let dateString = $(".published_at").text();
    if (dateString) {
        dateString += " CDT";
        site.date = new Date(Date.parse(dateString));
    }
    site.shouldUseUrlForLink = false;
    return site;
};
