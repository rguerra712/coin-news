export interface SiteParser {
    getSites(take?: number, after?: Date): ParsedSite[];
}

export interface ParsedSite {
    description: string;
    url: string;
    videoUrls: string[];
}