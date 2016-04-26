import cheerio from 'cheerio';
import rp from 'request-promise';
import iconv from 'iconv-lite';
import jschardet from 'jschardet';
import encoding from 'encoding';
import normalizeUrl from 'normalize-url';
import shopsConfig from './shops.json';
import utils from './utils';

if (Meteor.isServer) {
    Meteor.methods({
        serverRequest: (url, encoding) => {
            return rp({
                url: url,
                encoding: encoding
            });
        }
    });
}

class ParserClass {
    /**
     * @param {String} url адрес страницы
     * @param {Array} shopsAnother другой контекст магазинов
     */
    constructor(url, shopsAnother) {
        let shops = shopsAnother || shopsConfig;
        this.url = normalizeUrl(url);
        this.shopkey = utils.getHost(this.url);
        this.shop = shops[this.shopkey];
    }

    /**
     * Проверяет знает ли он такой url
     *
     * @returns {bool} Одобрить?
     */
    approveFromUrl() {
        if (utils.validUrl(this.url)) {
            return utils.getHost(this.url) == utils.getHost(normalizeUrl(this.shopkey));
        }

        return false;
    }

    /**
     * проверяет его корректность
     * проверяет может ли заапрувить его
     * делает запрос на сервер по url
     *
     * @returns {Promise.String} body страницы
     */
    request() {
        return new Promise((resolve, reject) => {
            if (this.approveFromUrl()) {
                Meteor.call('serverRequest', this.url, this.shop.encoding, (error, result) => {
                    resolve(result);
                });
            }else {
                reject(new Error('invalid url'));
            }
        });
    }

    /*
     * подбирает парсинг-объект
     * выбирает нужные параметры
     *
     * @returns {Object} выбранный товар
     */
    parse() {
        return this.request()
            .then(result => {

                let endetect = jschardet.detect(result);
                result = encoding.convert(result, 'utf8', this.shop.charset);

                let $ = cheerio.load(result);
                let resultparse = {};

                for (let key in this.shop.fields) {
                    let value = $(this.shop.fields[key]).text();

                    if (key == 'price') { // sorry crutch
                        value = utils.getPriceFromString(value);
                    }

                    resultparse[key] = value;
                }

                // @TODO remove line
                console.log(resultparse);
                return resultparse;
            })
            .catch(error => {
                throw new Error('error request');
            });
    }
}

export default (url) => new ParserClass(url);
