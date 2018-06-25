import * as cheerio from "cheerio";

export class TradingViewHtmlLinkParser {
    private $: CheerioStatic;

    /**
     * Initialize parser, so that we can have state for the html and load it only once
     */
    constructor(html: string) {
        this.$ = cheerio.load(html);
    }

    getChats(): string[] {
        const $ = this.$;
        const chats = $("div .ch-item-text");
        const strings: string[] = [];
        $(chats).each((i, chat) => {
            const chatElement = $(chat);
            const html = chatElement.html()
                ? chatElement.html()
                : chatElement.text();
            strings.push(html || "");
        });
        return strings;
    }

    getLinksFromChats(): string[] {
        const $ = this.$;
        const chats = this.getChats();
        const linkUrls = chats.map(chat => cheerio.load(chat))
            .map($ => $('a[href]'))
            .filter(element => element)
            .map(element => element.attr('href'))
            .filter(this.isValidLink);
        return linkUrls;
    }

    private isValidLink (link: string) {
        if (!link) return false;
        link = link.toLocaleLowerCase();
        let forbiddenWords = ['aws', 'tradingview', 'youtube', 'twitter', 'facebook'];
        const coins = ['usd', 'btc', 'bch', 'eth', 'ltc', 'etc', 'eos'];
        const forbiddenCoinWords = coins.map(coin => `/${coin}`);
        forbiddenWords = forbiddenWords.concat(forbiddenCoinWords);
        return !link.startsWith('/')
            && !forbiddenWords.some(forbidden => link.includes(forbidden));
    }
}
