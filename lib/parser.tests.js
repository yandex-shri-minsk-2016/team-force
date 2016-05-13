import { chai } from 'meteor/practicalmeteor:chai';
import utils from './utils';
import ParserClass from './parser';
import normalizeUrl from 'normalize-url';

let Parser = ParserClass;
const expect = chai.expect;

describe('ParserClass', () => {

    it('valid class', () => {
        let url = 'http://www.test.ru';
        let parcerCls = Parser(url, 'test.ru');
        expect(parcerCls.url).to.equal(normalizeUrl(url));
    });

    it('approve Url', () => {
        let shop = utils.getShops()[0].name;
        let parseUrl = 'http://' + shop + '/page?param=1';
        expect(Parser(parseUrl, shop).approveFromUrl()).to.equal(true);
    });

    it('does not approve Url invalid link', () => {
        let parseUrl = 'doesnotapprove';
        expect(() => { Parser(parseUrl, 'validshop.ru').approveFromUrl(); }).to.throw('Неправильный адрес');
    });

    it('does not approve Url another shop', () => {
        let parseUrl = 'http://www.eda.by/catalog/dish/1848.html';
        expect(() => { Parser(parseUrl, 'wok.by').approveFromUrl(); }).to.throw('Ссылка не принадлежит магазину');
    });

});
