import TradingViewHtmlLinkParser from "../src/parsers/trading-view/trading-view-html-link-parser";
import * as fs from "fs";
import * as path from "path";
import { expect } from "chai";

const html = fs.readFileSync(
    path.resolve(__dirname + "/../../test", "trading-view-example.html"),
    "utf8"
);

describe("html", () => {
    it("should load file properly", () => {
        expect(html).to.not.be.undefined;
    });
});

describe("getChats() with example html", () => {
    it("should have 822 chat items", () => {
        // Arrange
        let parser = new TradingViewHtmlLinkParser(html);

        // Act
        let chats = parser.getChats();

        // Assert
        expect(chats).to.not.be.undefined;
        expect(chats.length).to.equal(
            822,
            "should have expected number of chats"
        );
    });

    it("should have at least one chat item chat item with a bloomberg link", () => {
        // Arrange
        let parser = new TradingViewHtmlLinkParser(html);

        // Act
        let chats = parser.getChats();
        let bloombergChats = chats.filter(chat =>
            chat.toLocaleLowerCase().includes("https://www.bloomberg.com")
        );

        // Assert
        expect(bloombergChats.length).to.be.greaterThan(
            1,
            "should contain bloomberg link at least once"
        );
    });
});

describe("getLinksFromChats() with example html", () => {
    it("should have only one chat item chat item with a bloomberg link to avoid referenes", () => {
        // Arrange
        let parser = new TradingViewHtmlLinkParser(html);

        // Act
        let links = parser.getLinksFromChats();
        let bloombergLinks = links.filter(link =>
            link.includes("https://www.bloomberg.com")
        );

        // Assert
        expect(bloombergLinks.length).to.equal(
            1,
            "should contain bloomberg link and not other references"
        );
    });

    it("should only bloomberg link as other chats were not useful, e.g. youtube, twitter, etc", () => {
        // Arrange
        let parser = new TradingViewHtmlLinkParser(html);

        // Act
        let links = parser.getLinksFromChats();

        // Assert
        expect(links.length).to.equal(
            1,
            "should only contain bloomberg link and not other references"
        );
    });
});
