import { ParsedSite } from "./../types/types";

export default function sitesToHtml(sites: ParsedSite[]) {
    let siteHtmls = sites.map(site => getSiteHtml(site))
        .join('<br /><br /><br />');
    return `
    <!DOCTYPE html>
    <html>
        <head>
            <title>
            Coin News
            </title>
            <link rel="stylesheet" href="https://maxcdn.bootstrapcdn.com/bootstrap/3.3.7/css/bootstrap.min.css" integrity="sha384-BVYiiSIFeK1dGmJRAkycuHAHRg32OmUcww7on3RYdg4Va+PmSTsz/K68vbdEjh4u" crossorigin="anonymous">
        </head>
        <body>
${siteHtmls}       
        </body>
    </html>
`;
}

function getSiteHtml(site: ParsedSite): string {
    let videoHtml = site.videoUrls.map(videoUrl => `
    <iframe src="${videoUrl}" width="700" height="400"></iframe>
    <br />
    <a href="${videoUrl}">Link to above video</a>`)
        .join('<br />');
    return `
            <div class="sites">
                <h3><a href="${site.url}">${site.title}</a></h3>
                <p>${site.date}</p>
                <h4>Details:</h4>
                <p>${site.description}</p>
                <div class="videos">
                    ${videoHtml}
                </div>
            </div>
    `;
}