import { ParsedSite } from "./types/types";
import { APIGatewayEvent, Callback, Context, Handler } from "aws-lambda";
import { ParserProvider } from "./parsers/parser-provider";
import {isNewsNew} from "./new-news-determiner";
import {WebhookNotifier} from "./webhook-notifier";
import {sitesToHtml} from "./sites-to-html";

const onerror = (error: Error) => console.error(error);

export const news = (
    event: APIGatewayEvent,
    context: Context,
    cb: Callback
) => {
    const take = event.queryStringParameters
        ? Number(event.queryStringParameters["take"])
        : 3;
        const after = event.queryStringParameters
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
    const parserProvider = new ParserProvider();
    const parsers = parserProvider.getAllParsers(isFrequent);
    const parserPromises = parsers.map(parser => parser.getSites(take, after));
    const sites = await Promise.all(parserPromises);
    return flatten(sites);
}

function flatten(arrays: ParsedSite[][]) {
    return [].concat.apply([], arrays);
}