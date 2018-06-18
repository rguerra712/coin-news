import { ParsedSite } from './../types/types';
import {expect} from 'chai';
import isNewNews from "./../src/new-news-determiner";

const minutesThatConstituteNew = 15;
const fiveMinutesAgo = Date.now() - 1000 * 60 * 5;
const twentyMinutesAgo = Date.now() - 1000 * 60 * 20;
const oneDayAgo = Date.now() - 1000 * 60 * 60 * 24;
const nonNewSite = new ParsedSite();
nonNewSite.date = new Date(0);

describe('isNewsNew() tests in a broad range (not caring about precision really', () => {
    it('should be new if now', () => {
        // Arrange
        let site = new ParsedSite();
        site.date = new Date(Date.now());

        // Act
        let isNew = isNewNews([site], minutesThatConstituteNew);

        // Assert
        expect(isNew).to.equal(true, 'now is new')
    });

    it('should be new if in the past 5 minutes', () => {
        // Arrange
        let site = new ParsedSite();
        site.date = new Date(fiveMinutesAgo);

        // Act
        let isNew = isNewNews([site], minutesThatConstituteNew);

        // Assert
        expect(isNew).to.equal(true, '5 minutes ago is new')
    });

    it('should not be new if in the past 20 minutes', () => {
        // Arrange
        let site = new ParsedSite();
        site.date = new Date(twentyMinutesAgo);

        // Act
        let isNew = isNewNews([site], minutesThatConstituteNew);

        // Assert
        expect(isNew).to.equal(false, '20 minutes ago is not new')
    });

    it('should not be new if in the past day', () => {
        // Arrange
        let site = new ParsedSite();
        site.date = new Date(oneDayAgo);

        // Act
        let isNew = isNewNews([site], minutesThatConstituteNew);

        // Assert
        expect(isNew).to.equal(false, '1 day ago is not new')
    });

    it('should not be new if no date', () => {
        // Arrange
        let site = new ParsedSite();

        // Act
        let isNew = isNewNews([site], minutesThatConstituteNew);

        // Assert
        expect(isNew).to.equal(false, 'undefined is not new')
    });
});

describe('isNewsNew() tests with two values in a broad range (not caring about precision really', () => {
    it('should be new if now', () => {
        // Arrange
        let site = new ParsedSite();
        site.date = new Date(Date.now());

        // Act
        let isNew = isNewNews([site, nonNewSite], minutesThatConstituteNew);

        // Assert
        expect(isNew).to.equal(true, 'now is new')
    });

    it('should be new if in the past 5 minutes', () => {
        // Arrange
        let site = new ParsedSite();
        site.date = new Date(fiveMinutesAgo);

        // Act
        let isNew = isNewNews([site, nonNewSite], minutesThatConstituteNew);

        // Assert
        expect(isNew).to.equal(true, '5 minutes ago is new')
    });

    it('should not be new if in the past 20 minutes', () => {
        // Arrange
        let site = new ParsedSite();
        site.date = new Date(twentyMinutesAgo);

        // Act
        let isNew = isNewNews([site, nonNewSite], minutesThatConstituteNew);

        // Assert
        expect(isNew).to.equal(false, '20 minutes ago is not new')
    });

    it('should not be new if in the past day', () => {
        // Arrange
        let site = new ParsedSite();
        site.date = new Date(oneDayAgo);

        // Act
        let isNew = isNewNews([site, nonNewSite], minutesThatConstituteNew);

        // Assert
        expect(isNew).to.equal(false, '1 day ago is not new')
    });

    it('should not be new if no date', () => {
        // Arrange
        let site = new ParsedSite();

        // Act
        let isNew = isNewNews([site, nonNewSite], minutesThatConstituteNew);

        // Assert
        expect(isNew).to.equal(false, 'undefined is not new')
    });
});