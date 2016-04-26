import { chai } from 'meteor/practicalmeteor:chai';
import utils from './utils';
import ParserClass from './parser';
import normalizeUrl from 'normalize-url';

let Parser = ParserClass;
const expect = chai.expect;

describe('ParserClass', () => {

    it('valid class', () => {
        let url = 'http://www.test.ru';
        let parcerCls = Parser(url);
        expect(parcerCls.url).to.equal(normalizeUrl(url));
    });

    it('approve Url', () => {
        let shop = utils.getShops()[0].name;
        let shopUrl = 'http://' + shop + '/page?param=1';
        expect(Parser(shopUrl).approveFromUrl()).to.equal(true);
    });

    it('does not approve Url', () => {
        let shopUrl = 'doesnotapprove';
        expect(Parser(shopUrl).approveFromUrl()).to.equal(false);
    });

    // it('valid serverRequest', () => {
    //     let url = 'http://www.yandex.ru/';
    //     expect(Parser.request(url).then((result) => {
    //         return result.statusCode;
    //     })).to.equal(200);
    // });
});
