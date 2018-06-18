import { Lambda, AWSError } from "aws-sdk";

let siteParser: Lambda;
const configuration = {
    region: process.env["SOURCE_AS_A_SERVICE_REGION"]
};
siteParser = new Lambda(configuration);

export default function getHtml(url: string): Promise<string> {
    return new Promise((resolve, reject) => {
        let callback = (error: AWSError, data: any) => {
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
        let event = {
            queryStringParameters: {
                url: url
            }
        };
        let request = {
            FunctionName:
                process.env["SOURCE_AS_A_SERVICE_NAME"] ||
                "NAME_ENV_VARIABLE_MISSING",
            Payload: JSON.stringify(event, null, 2)
        };
        siteParser.invoke(request, callback);
    });
}
