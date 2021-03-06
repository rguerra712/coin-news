import { ParsedSite } from "./types/types";
import { APIGatewayEvent, Callback, Context, Handler } from "aws-lambda";
import { ParserProvider } from "./lib/parsers/parser-provider";
import isNewsNew from "./lib/new-news-determiner";
import WebhookNotifier from "./lib/webhook-notifier";
import sitesToHtml from "./lib/sites-to-html";

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
        .catch(onerror);
};

export const newsAlert: Handler = () => {
    getSites(1)
        .then(sites => {
            if (isNewsNew(sites)) {
                new WebhookNotifier().trigger();
            }
        })
        .catch(onerror);
};

async function getSites(take: number, after?: Date): Promise<ParsedSite[]> {
    let parserProvider = new ParserProvider();
    let parsers = parserProvider.getAllParsers();
    let parserPromises = parsers.map(parser => parser.getSites(take, after));
    let sites = await Promise.all(parserPromises);
    return flatten(sites);
}

function flatten(arrays: ParsedSite[][]) {
    return [].concat.apply([], arrays);
}
