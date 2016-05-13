import cheerio from 'cheerio';
import rp from 'request-promise';
import iconv from 'iconv-lite';
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
    constructor(url, shop, shopsAnother) {
        let shops = shopsAnother || shopsConfig;
        this.url = normalizeUrl(url);
        this.shopkey = shop;
        this.shop = shops[this.shopkey];
    }

    /**
     * Проверяет знает ли он такой url
     *
     * @returns {Boolean} Одобрить?
     */
    approveFromUrl() {
        if (!utils.validUrl(this.url)) {
            throw new Error('Неправильный адрес');
        }

        if (utils.getHost(this.url) !== utils.getHost(normalizeUrl(this.shopkey))) {
            throw new Error('Ссылка не принадлежит магазину');
        }

        return true;
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
                reject(new Error('Проверьте соединение с интернетом'));
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

                result = encoding.convert(result, 'utf8', this.shop.charset);

                const $ = cheerio.load(result);
                let resultparse = {};

                for (let field in this.shop.fields) {
                    let value = $(this.shop.fields[field]).text();

                    if (field === 'price') {
                        value = utils.getPriceWithFormat(utils.getPriceFromString(value));
                    }

                    resultparse[field] = value;
                }

                // @TODO remove line
                console.log(resultparse);
                return resultparse;
            })
            .catch(error => {
                throw error;
            });
    }
}

export default (url, shop) => new ParserClass(url, shop);
