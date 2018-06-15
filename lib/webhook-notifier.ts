import request from 'axios';

export default class WebhookNotifier {
    trigger():void {
        request(process.env["WEBHOOK_URL"] || '')
            .then(data => console.log(`Coin news webhook triggered: ${data}`))
            .catch(error => console.error(`Coin News webhook error: ${error}`));
    }
}