import { chai } from 'meteor/practicalmeteor:chai';
import utils from './utils';

const expect = chai.expect;

describe('Utils', () => {

    it('valid Url http://www.yandex.ru', () => {
        expect(utils.validUrl('http://www.yandex.ru')).to.equal(true);
    });

    it('valid Url http://wok.by/menu/full/main/chernaya-lapsha-s-osminogami', () => {
        expect(utils.validUrl('http://wok.by/menu/full/main/chernaya-lapsha-s-osminogami')).to.equal(true);
    });

    it('valid Url http://www.wok.by/menu/full/main/chernaya-lapsha-s-osminogami', () => {
        expect(utils.validUrl('http://www.wok.by/menu/full/main/chernaya-lapsha-s-osminogami')).to.equal(true);
    });

    it('valid Url www.wok.by/menu/full/main/chernaya-lapsha-s-osminogami', () => {
        expect(utils.validUrl('www.wok.by/menu/full/main/chernaya-lapsha-s-osminogami')).to.equal(true);
    });

    it('valid Url wok.by/menu/full/main/chernaya-lapsha-s-osminogami', () => {
        expect(utils.validUrl('wok.by/menu/full/main/chernaya-lapsha-s-osminogami')).to.equal(true);
    });

    it('invalid Url no.domain', () => {
        expect(utils.validUrl('noyandexru')).to.equal(false);
    });

    it('get price from string 100 000', () => {
        expect(utils.getPriceFromString('100 000 руб')).to.equal(100000);
    });

    it('get price from string 100 100', () => {
        expect(utils.getPriceFromString('100 100')).to.equal(100100);
    });

    it('get price from string 100 200', () => {
        expect(utils.getPriceFromString('100200')).to.equal(100200);
    });

    it('get price with format 99', () => {
        expect(utils.getPriceWithFormat(99)).to.equal('99 руб.');
    });

    it('get price with format 10000', () => {
        expect(utils.getPriceWithFormat(10000)).to.equal('10 000 руб.');
    });

    it('get price with format 1000000', () => {
        expect(utils.getPriceWithFormat(1000000)).to.equal('1 000 000 руб.');
    });

});
