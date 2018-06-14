import { ParsedSite } from "./types/types";
import { APIGatewayEvent, Callback, Context, Handler } from "aws-lambda";
import { ParserProvider } from "./lib/parsers/parser-provider";

let onerror = (error: any) => console.error(error);

export const news: Handler = (
    event: APIGatewayEvent,
    context: Context,
    cb: Callback
) => {
    let sites = getSites(event)
        .then(sites => {
            const response = {
                statusCode: 200,
                body: JSON.stringify(sites, null, 2)
            };
            cb(null, response);
        })
        .catch(onerror);
};

function getSites(event: APIGatewayEvent): Promise<ParsedSite[]> {
    let parserProvider = new ParserProvider();
    let parsers = parserProvider.getAllParsers();
    let parserPromises = parsers.map(parser => parser.getSites());
    let promiseAll = Promise.all(parserPromises)
        .then(sites => flatten(sites))
        .catch(onerror);
    return Promise.resolve(promiseAll);
}

function flatten(arrays: ParsedSite[][]) {
    return [].concat.apply([], arrays);
}