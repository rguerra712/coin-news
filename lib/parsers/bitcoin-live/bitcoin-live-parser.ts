import { SiteParser, ParsedSite } from "../../../types/types";
import request from 'axios';
import { findArticles } from "./article-finder";

export default class BitcoinLiveParser implements SiteParser {
    private url:string = '';

    getSites(take?: number, after?: Date): Promise<ParsedSite[]> {
        return new Promise<ParsedSite[]>((resolve, reject) => {
            request(this.url)
                .then(response => {
                    let articles = findArticles(response.data);
                    let sites:ParsedSite[] = [];
                    return sites;
                })
                .catch(error => resolve(error));
        });
    }
}