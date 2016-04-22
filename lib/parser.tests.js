import { chai } from 'meteor/practicalmeteor:chai';
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

    it('valid Url http://www.yandex.ru', () => {
        expect(Parser('http://www.yandex.ru').validUrl()).to.equal(true);
    });

    it('valid Url http://wok.by/menu/full/main/chernaya-lapsha-s-osminogami', () => {
        expect(Parser('http://wok.by/menu/full/main/chernaya-lapsha-s-osminogami').validUrl()).to.equal(true);
    });

    it('valid Url http://www.wok.by/menu/full/main/chernaya-lapsha-s-osminogami', () => {
        expect(Parser('http://www.wok.by/menu/full/main/chernaya-lapsha-s-osminogami').validUrl()).to.equal(true);
    });

    it('valid Url www.wok.by/menu/full/main/chernaya-lapsha-s-osminogami', () => {
        expect(Parser('www.wok.by/menu/full/main/chernaya-lapsha-s-osminogami').validUrl()).to.equal(true);
    });

    it('valid Url wok.by/menu/full/main/chernaya-lapsha-s-osminogami', () => {
        expect(Parser('wok.by/menu/full/main/chernaya-lapsha-s-osminogami').validUrl()).to.equal(true);
    });

    it('invalid Url no.domain', () => {
        expect(Parser('noyandexru').validUrl()).to.equal(false);
    });

    it('get shop from url', () => {
        let shopUrl = 'http://www.shop.com/test/request?data=1';
        expect(Parser(shopUrl).getShop()).to.equal('shop.com');
    });

    it('getShop Url', () => {
        let shop = Object.keys(Parser('/').shops)[0];
        let shopUrl = 'http://' + shop + '/page?param=1';
        expect(Parser(shopUrl).getShop()).to.equal(shop);
    });

    it('approve Url', () => {
        let shop = Object.keys(Parser('/').shops)[0];
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
