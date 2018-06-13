import { SiteParser, ParsedSite } from "../../../types/types";
import request from "axios";
import * as cheerio from "cheerio";

export default class BitcoinLiveParser implements SiteParser {
    private url: string = "https://bitcoin.live/blogs?author=8";

    getSites(take?: number, after?: Date): Promise<ParsedSite[]> {
        return new Promise<ParsedSite[]>((resolve, reject) => {
            request(this.url)
                .then(response => {
                    let articles = findArticles(response.data);
                    let promises = articles.map(getSitesFromArticle);
                    let sites = Promise.all(promises);
                    resolve(sites);
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
                resolve(parseArticle(response.data));
            })
            .catch(error => reject(error));
    });
};

let parseArticle = (html: string): ParsedSite => {
    const $ = cheerio.load(html, { xmlMode: false });
    let site = new ParsedSite();
    site.description = $('meta[property*="description"]').attr("content");
    let swatch = $('img[src*="swatch"]').attr('src');
    if (swatch) {
      let videoUrl = swatch.replace('swatch', '');
      site.url = videoUrl;
    }
    return site;
};
