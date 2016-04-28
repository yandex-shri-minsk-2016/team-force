import urlApi from 'url';
import normalizeUrl from 'normalize-url';
import shopsConfig from './shops.json';

const utils = {
    DATETIME_FORMAT: 'DD/MM/YYYY HH:mm',
    VALID_URL: /(http|ftp|https):\/\/[\w-]+(\.[\w-]+)+([\w.,@?^=%&amp;:\/~+#-]*[\w@?^=%&amp;\/~+#-])?/,

    /**
     * @param {String} price строка содержащая цену
     * @returns {Number} цена
     */
    getPriceFromString(price) {
        return parseInt(price.replace(/[^\d.]/g, ''));
    },

    /**
     * @param {Number} price цена
     * @returns {String} отформатированное представление цены
     */
    getPriceWithFormat(price) {
        return String(price).split('').reverse().reduce(function(acc, n, i) {
                return n + (i && !(i % 3) ? ' ' : '') + acc;
            }, '') + ' руб.';
    },

    /**
     * @param {Array} shopsAnother другой контекст магазинов
     */
    getShops(shopsAnother) {
        let shops = shopsAnother || shopsConfig;
        let result = [];
        for (let name in shops) {
            result.push({
                name,
                data: shops[name]
            });
        }

        return result;
    },

    /**
     * Ищет хост магазина из url по нему и будет определяться объект
     *
     * @returns {string} хост магазина
     */
    getHost(url) {
        let link = urlApi.parse(url);
        return link.hostname;
    },

    /**
     * Проверяет корректность url
     * @param {String} url сайта
     * @returns {bool} Валиден?
     */
    validUrl(url) {
        return this.VALID_URL.test(normalizeUrl(url));
    }

};

export default utils;
