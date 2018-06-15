import { SiteParser, ParsedSite } from "../../../types/types";
import request from "axios";
import * as cheerio from "cheerio";

export default class BitcoinLiveParser implements SiteParser {
    getLatestSites(): Promise<ParsedSite[]> {
        return this.getSites(1);
    }
    private url: string = "https://bitcoin.live/blogs?author=8";

    getSites(take?: number, after?: Date): Promise<ParsedSite[]> {
        return new Promise<ParsedSite[]>((resolve, reject) => {
            request(this.url)
                .then(response => {
                    let articles = findArticles(response.data);
                    let promises = articles.map(getSitesFromArticle);
                    if (take) {
                        promises = promises.slice(0, take);
                    }
                    let sitesPromise = Promise.all(promises);
                    sitesPromise
                        .then(sites => {
                            if (after) {
                                sites = sites.filter(site => site.date && site.date > after);
                            }
                            resolve(sites);
                        })
                        .catch(error => reject(error));
                })
                .catch(error => reject(error));
        });
    }
}

let findArticles = (html: string): string[] => {
    const $ = cheerio.load(html);
    let links = $(".link-block a[href]");
    let urls = links.map((index, element) => element.attribs.href).get();
    return urls;
};

let getSitesFromArticle = (url: string): Promise<ParsedSite> => {
    return new Promise((resolve, reject) => {
        request(url)
            .then(response => {
                let site = parseArticle(response.data);
                site.url = url;
                resolve(site);
            })
            .catch(error => reject(error));
    });
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
