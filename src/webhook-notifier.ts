import { ParsedSite } from './../src/types/types';
import request from 'axios';

export class WebhookNotifier {
    trigger(sites: ParsedSite[]):void {
        sites.forEach(site => {
            const baseUrl = process.env['WEBHOOK_URL'] || '';
            const url = site.shouldUseUrlForLink
                ? site.url
                : process.env['GATEWAY_URL'];
            request(baseUrl + site.url)
            .then(data => console.log(`Coin news webhook triggered: ${data}`))
            .catch(error => console.error(`Coin News webhook error: ${error}`));
        });
    }
}