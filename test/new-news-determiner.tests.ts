import { ParsedSite } from "./../src/types/types";
import { expect } from "chai";
import { isNewsNew } from "./../src/new-news-determiner";

const minutesThatConstituteNew = 15;
const fiveMinutesAgo = Date.now() - 1000 * 60 * 5;
const twentyMinutesAgo = Date.now() - 1000 * 60 * 20;
const oneDayAgo = Date.now() - 1000 * 60 * 60 * 24;
const nonNewSite = new ParsedSite();
nonNewSite.date = new Date(0);

describe("isNewsNew() tests in a broad range (not caring about precision really", () => {
    it("should be new if now", () => {
        // Arrange
        const site = new ParsedSite();
        site.date = new Date(Date.now());

        // Act
        const isNew = isNewsNew([site], minutesThatConstituteNew);

        // Assert
        expect(isNew).to.equal(true, "now is new");
    });

    it("should be new if in the past 5 minutes", () => {
        // Arrange
        const site = new ParsedSite();
        site.date = new Date(fiveMinutesAgo);

        // Act
        const isNew = isNewsNew([site], minutesThatConstituteNew);

        // Assert
        expect(isNew).to.equal(true, "5 minutes ago is new");
    });

    it("should not be new if in the past 20 minutes", () => {
        // Arrange
        const site = new ParsedSite();
        site.date = new Date(twentyMinutesAgo);

        // Act
        const isNew = isNewsNew([site], minutesThatConstituteNew);

        // Assert
        expect(isNew).to.equal(false, "20 minutes ago is not new");
    });

    it("should not be new if in the past day", () => {
        // Arrange
        const site = new ParsedSite();
        site.date = new Date(oneDayAgo);

        // Act
        const isNew = isNewsNew([site], minutesThatConstituteNew);

        // Assert
        expect(isNew).to.equal(false, "1 day ago is not new");
    });

    it("should not be new if no date", () => {
        // Arrange
        const site = new ParsedSite();

        // Act
        const isNew = isNewsNew([site], minutesThatConstituteNew);

        // Assert
        expect(isNew).to.equal(false, "undefined is not new");
    });
});

describe("isNewsNew() tests with two values in a broad range (not caring about precision really", () => {
    it("should be new if now", () => {
        // Arrange
        const site = new ParsedSite();
        site.date = new Date(Date.now());

        // Act
        const isNew = isNewsNew([site, nonNewSite], minutesThatConstituteNew);

        // Assert
        expect(isNew).to.equal(true, "now is new");
    });

    it("should be new if in the past 5 minutes", () => {
        // Arrange
        const site = new ParsedSite();
        site.date = new Date(fiveMinutesAgo);

        // Act
        const isNew = isNewsNew([site, nonNewSite], minutesThatConstituteNew);

        // Assert
        expect(isNew).to.equal(true, "5 minutes ago is new");
    });

    it("should not be new if in the past 20 minutes", () => {
        // Arrange
        const site = new ParsedSite();
        site.date = new Date(twentyMinutesAgo);

        // Act
        const isNew = isNewsNew([site, nonNewSite], minutesThatConstituteNew);

        // Assert
        expect(isNew).to.equal(false, "20 minutes ago is not new");
    });

    it("should not be new if in the past day", () => {
        // Arrange
        const site = new ParsedSite();
        site.date = new Date(oneDayAgo);

        // Act
        const isNew = isNewsNew([site, nonNewSite], minutesThatConstituteNew);

        // Assert
        expect(isNew).to.equal(false, "1 day ago is not new");
    });

    it("should not be new if no date", () => {
        // Arrange
        const site = new ParsedSite();

        // Act
        const isNew = isNewsNew([site, nonNewSite], minutesThatConstituteNew);

        // Assert
        expect(isNew).to.equal(false, "undefined is not new");
    });
});
