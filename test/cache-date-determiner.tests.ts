import getCacheDateFor from '../src/cache-date-determiner';
import { expect } from 'chai';

describe('getCacheDateFor(url)', () => {
    it('should work for stack overflow', () => {
        let url = 'http://www.stackoverflow.com';
        return getCacheDateFor(url).then(date => {
            expect(date).to.not.be.undefined;
            expect(date instanceof Date).to.equal(true, 'should be of type date');
            expect(date.getFullYear()).to.equal(2018, 'latest cache is expected to be this year');
        });
    });

    it('should work for query string', () => {
        
        let url = 'https://www.google.com/webhp?safe=off&source=hp&ei=hkIsW-a0M8apjwTN85-oDA&q=this+is+a+test&oq=this+is+a+test&gs_l=psy-ab.3..0l10.713.1939.0.2059.15.11.0.0.0.0.196.1068.0j7.7.0....0...1.1.64.psy-ab..8.7.1067.0..35i39k1j0i131k1j0i20i264k1.0.buH_9_eebd0';
        return getCacheDateFor(url).then(date => {
            expect(date).to.not.be.undefined;
            expect(date instanceof Date).to.be.equal(true, 'should be of type date');
            expect(date.getFullYear()).to.equal(2018, 'latest cache is expected to be this year');
        });
    });

    it('should throw for url that does not exist', () => {
        
        let url = 'http://www.fsafsafdsadfstackedoverflow.com';
        return getCacheDateFor(url)
            .then(data => expect(data).to.be.undefined)
            .catch(error => expect(error).to.not.be.undefined);
    });
});