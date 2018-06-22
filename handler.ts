import { ParsedSite } from "./types/types";
import { APIGatewayEvent, Callback, Context, Handler } from "aws-lambda";
import { ParserProvider } from "./src/parsers/parser-provider";
import isNewsNew from "./src/new-news-determiner";
import WebhookNotifier from "./src/webhook-notifier";
import sitesToHtml from "./src/sites-to-html";

let onerror = (error: any) => console.error(error);

export const news: Handler = (
    event: APIGatewayEvent,
    context: Context,
    cb: Callback
) => {
    let take = event.queryStringParameters
        ? Number(event.queryStringParameters["take"])
        : 3;
    let after = event.queryStringParameters
        ? new Date(Date.parse(event.queryStringParameters["after"]))
        : undefined;
    getSites(take, after)
        .then(sites => {
            const response = {
                statusCode: 200,
                headers: {
                    'Content-Type': 'text/html',
                  },
                body: sitesToHtml(sites)
            };
            cb(null, response);
        })
        .catch(error => {
            console.error(error);
            const response = {
                statusCode: 500,
                headers: {
                    'Content-Type': 'text/html',
                  },
                body: JSON.stringify(`Internal Server Error: ${error}`, null, 2)
            };
            cb(null, response);
        });
};

export const infrequentNewsAlert: Handler = () => {
    getSites(1, undefined, false)
        .then(sites => {
            if (isNewsNew(sites)) {
                new WebhookNotifier().trigger(sites);
            }
        })
        .catch(onerror);
};

export const frequentNewsAlert: Handler = () => {
    getSites(1, undefined, true)
        .then(sites => {
            new WebhookNotifier().trigger(sites);
        })
        .catch(onerror);
};

async function getSites(take: number, after?: Date, isFrequent?: boolean): Promise<ParsedSite[]> {
    let parserProvider = new ParserProvider();
    let parsers = parserProvider.getAllParsers(isFrequent);
    let parserPromises = parsers.map(parser => parser.getSites(take, after));
    let sites = await Promise.all(parserPromises);
    return flatten(sites);
}

function flatten(arrays: ParsedSite[][]) {
    return [].concat.apply([], arrays);
}