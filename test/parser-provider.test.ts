import { ParserProvider } from './../src/parsers/parser-provider';
import { expect } from 'chai';


describe('getAllParsers() with arguments', () => {
    it('should give tradingview and bitcoin live parser when getting all', () => {
        // Arrange
        let parserProvider = new ParserProvider();

        // Act
        let parsers = parserProvider.getAllParsers();
        let parserNames = parsers.map(parser => parser.constructor.name);
        
        // Assert
        expect(parserNames).to.include('TradingViewParser');
        expect(parserNames).to.include('BitcoinLiveParser');
    });

    it('should give tradingview and not bitcoin live parser when frequent', () => {
        // Arrange
        let parserProvider = new ParserProvider();

        // Act
        let parsers = parserProvider.getAllParsers(true);
        let parserNames = parsers.map(parser => parser.constructor.name);
        
        // Assert
        expect(parserNames).to.include('TradingViewParser');
        expect(parserNames).to.not.include('BitcoinLiveParser');
    });

    it('should not give tradingview yet give bitcoin live parser when not frequent', () => {
        // Arrange
        let parserProvider = new ParserProvider();

        // Act
        let parsers = parserProvider.getAllParsers(false);
        let parserNames = parsers.map(parser => parser.constructor.name);
        
        // Assert
        expect(parserNames).to.not.include('TradingViewParser');
        expect(parserNames).to.include('BitcoinLiveParser');
    });
});