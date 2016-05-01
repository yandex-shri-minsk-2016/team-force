import { chai } from 'meteor/practicalmeteor:chai';
import shopsConfig from './shops.json';
import utils from './utils';

const expect = chai.expect;

describe('Utils', () => {

    it('valid Url http://www.ya.ru', () => {
        expect(utils.validUrl('http://www.ya.ru')).to.equal(true);
        expect(utils.validUrl('www.ya.ru')).to.equal(true);
        expect(utils.validUrl('ya.ru')).to.equal(true);
    });

    it('should find invalid urls', () => {
        expect(utils.validUrl('ya..ru')).to.equal(false);
        expect(utils.validUrl('y,a.ru')).to.equal(false);
        expect(utils.validUrl('htssdj://ya.ru')).to.equal(false);
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
    
    it('get shops name and fields - flatten', () => {

        const testShop = {
            'test.shop': {
                minDelivery: '111',
                costDelivery: '222',
                freeDelivery: '333',
                encoding: 'binary',
                charset: 'cp1251',
                fields: {
                    title:  '.info h1',
                    weight: '.info h2',
                    price:  '.info h3',
                    descr:  '.info h4'
                }
            }
        };

        const shops = utils.getShops(testShop);
        const shopMethod = shops[0];

        expect(Object.keys(testShop)[0]).to.equal(shopMethod.name);
        expect(testShop['test.shop']).to.equal(shopMethod.data);
    });

    it('obj to arr', () => {
        const obj0 = {
            param1: 1,
            param2: 2,
            param3: 3
        };
        const obj1 = {
            param4: 4,
            param5: 5,
            param6: 6
        };

        const objs = {
            key0: obj0,
            key1: obj1
        };

        const arrs = [
            obj0, obj1
        ];

        expect(obj0).to.equal(utils.toArr(objs)[0]);
        expect(obj1).to.equal(utils.toArr(objs)[1]);
    });

});
