import { ParsedSite } from "./../types/types";

export default function isNewsNew(sites: ParsedSite[], minutesThatDetermineIfNew: number = 15): boolean {
    let newMinutesAgo = new Date( Date.now() - 1000 * 60 * minutesThatDetermineIfNew );
    return sites
        .filter(site => site && site.date)
        .some(site => {
            if (!site.date) return true;
            let siteDate = site.date;
            let dateDifference = Date.now() - siteDate.valueOf();
            return  dateDifference < minutesThatDetermineIfNew * 1000 * 60;
        });
}
