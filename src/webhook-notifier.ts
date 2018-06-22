import { ParsedSite } from './../types/types';
import request from 'axios';

export default class WebhookNotifier {
    trigger(sites: ParsedSite[]):void {
        sites.forEach(site => {
            let baseUrl = process.env['WEBHOOK_URL'] || '';
            let url = site.shouldUseUrlForLink
                ? site.url
                : process.env['GATEWAY_URL'];
            request(baseUrl + site.url)
            .then(data => console.log(`Coin news webhook triggered: ${data}`))
            .catch(error => console.error(`Coin News webhook error: ${error}`));
        });
    }
}