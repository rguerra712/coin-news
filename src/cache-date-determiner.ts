import request from 'axios';

const urlTemplate = 'http://webcache.googleusercontent.com/search?num=1&strip=1&vwsrc=0&q=cache:';

export async function getCacheDateFor(url: string): Promise<Date> {
    const regex = /appeared on ([^\.]+)\./gm;
    url = url.split(/[?#]/)[0];
    url = urlTemplate + url;
    const response = await request(url);
    const html = response.data;
    const matches = regex.exec(html);
    if (!matches) {
        throw new Error('unable to find date part in cached page');
    }
    const dateValue = matches[1];
    return new Date(Date.parse(dateValue));
}