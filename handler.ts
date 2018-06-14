import { ParsedSite } from "./types/types";
import { APIGatewayEvent, Callback, Context, Handler } from "aws-lambda";
import { ParserProvider } from "./lib/parsers/parser-provider";
import isNewsNew from "./lib/new-news-determiner";
import WebhookNotifier from "./lib/webhook-notifier";

let onerror = (error: any) => console.error(error);

export const news: Handler = (
    event: APIGatewayEvent,
    context: Context,
    cb: Callback
) => {
    let take = event.queryStringParameters ? Number(event.queryStringParameters['take']) : 3;
    let sites = getSites(take)
        .then(sites => {
            const response = {
                statusCode: 200,
                body: JSON.stringify(sites, null, 2)
            };
            cb(null, response);
        })
        .catch(onerror);
};

export const newsAlert: Handler = (
    event: APIGatewayEvent,
    context: Context,
    cb: Callback
) => {
    let sites = getSites(1)
        .then(sites => {
            alertIfAnySitesAreNew(sites);
        })
        .catch(onerror);
};

function getSites(take: number): Promise<ParsedSite[]> {
    let parserProvider = new ParserProvider();
    let parsers = parserProvider.getAllParsers();
    let parserPromises = parsers.map(parser => parser.getSites(take));
    let promiseAll = Promise.all(parserPromises)
        .then(sites => flatten(sites))
        .catch(onerror);
    return Promise.resolve(promiseAll);
}

function flatten(arrays: ParsedSite[][]) {
    return [].concat.apply([], arrays);
}

function alertIfAnySitesAreNew(sites: ParsedSite[]): void {
    if (isNewsNew(sites)) {
        new WebhookNotifier().trigger();
    }    
}