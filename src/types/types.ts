export interface SiteParser {
    getSites(take?: number, after?: Date): Promise<ParsedSite[]>;
    getLatestSites(): Promise<ParsedSite[]>;
    isFrequent(): boolean;
}

export class ParsedSite {
    title!: string;
    description!: string;
    url!: string;
    videoUrls!: string[];
    date?: Date;
    shouldUseUrlForLink!: boolean;
}
