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

});
