import request from 'axios';

const urlTemplate = 'http://webcache.googleusercontent.com/search?num=1&strip=1&vwsrc=0&q=cache:'

export default async function getCacheDateFor(url: string): Promise<Date> {
    const regex = /appeared on ([^\.]+)\./gm;
    url = url.split(/[?#]/)[0];
    url = urlTemplate + url;
    let response = await request(url);
    let html = response.data;
    let matches = regex.exec(html);
    if (!matches) {
        throw new Error('unable to find date part in cached page');
    }
    let dateValue = matches[1];
    return new Date(Date.parse(dateValue));
}