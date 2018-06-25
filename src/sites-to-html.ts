import { ParsedSite } from "./types/types";

export function sitesToHtml(sites: ParsedSite[]) {
    const siteHtmls = sites
        .map(site => getSiteHtml(site))
        .join("<br /><br /><br />");
    return `
    <!DOCTYPE html>
    <html>
        <head>
            <meta charset="utf-8">
            <meta name="viewport" content="width=device-width, initial-scale=1">
            <link rel="stylesheet" href="https://maxcdn.bootstrapcdn.com/bootstrap/3.3.7/css/bootstrap.min.css"> 
            <title>
            Coin News
            </title>
        </head>
        <body>
${siteHtmls}       
        </body>
        <script src="https://ajax.googleapis.com/ajax/libs/jquery/3.3.1/jquery.min.js"></script>
        <script src="https://maxcdn.bootstrapcdn.com/bootstrap/3.3.7/js/bootstrap.min.js"></script>
    </html>
`;
}

function getSiteHtml(site: ParsedSite): string {
    let videoHtml = '';
    if (site.videoUrls) {
        videoHtml = site.videoUrls
            .map(
                videoUrl => `
    <iframe src="${videoUrl}" width="700" height="400"></iframe>
    <br />
    <a href="${videoUrl}">Link to above video</a>`
            )
            .join("<br />");
    }
    return `
            <div class="container">
                <h3><a href="${site.url}">${site.title}</a></h3>
                <p>${site.date}</p>
                <h4>Details:</h4>
                <p>${site.description}</p>
                <div class="container-fluid">
                    ${videoHtml}
                </div>
            </div>
    `;
}
