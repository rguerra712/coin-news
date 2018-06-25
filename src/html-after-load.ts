import { Lambda, AWSError } from "aws-sdk";
import request from "axios";

let siteParser: Lambda;
const configuration = {
    region: process.env["SOURCE_AS_A_SERVICE_REGION"]
};
siteParser = new Lambda(configuration);

export class HtmlAfterLoad {
    getHtml(url: string): Promise<string> {
        if (process.env["ENVIRONMENT"] === "dev") {
            return this.getHtmlFromGateway(url);
        }
        return new Promise((resolve, reject) => {
            // tslint:disable-next-line:no-any
            const callback = (error: AWSError, data: any) => {
                if (error) {
                    reject(error);
                    return;
                }
                if (data.Payload) {
                    resolve(data.Payload);
                } else {
                    throw new Error(
                        `No payload found from lambda, data was ${JSON.stringify(
                            data,
                            null,
                            2
                        )}`
                    );
                }
            };
            const event = {
                queryStringParameters: {
                    url
                }
            };
            const request = {
                FunctionName:
                    process.env["SOURCE_AS_A_SERVICE_NAME"] ||
                    "NAME_ENV_VARIABLE_MISSING",
                Payload: JSON.stringify(event, null, 2)
            };
            siteParser.invoke(request, callback);
        });
    }

    async getHtmlFromGateway(url: string): Promise<string> {
        const lambdaUrl = `${process.env["SOURCE_AS_A_SERVICE_URL"]}/?url=${url}`;
        const response = await request(lambdaUrl);
        return response.data;
    }
}
