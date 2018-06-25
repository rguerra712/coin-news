import { ParsedSite } from "./types/types";

export function isNewsNew(
    sites: ParsedSite[],
    minutesThatDetermineIfNew = 60
): boolean {
    return sites.filter(site => site && site.date).some(site => {
        if (!site.date) return true;
        const siteDate = site.date;
        const dateDifference = Date.now() - siteDate.valueOf();
        return dateDifference < minutesThatDetermineIfNew * 1000 * 60;
    });
}
