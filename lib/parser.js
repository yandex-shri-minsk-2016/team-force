import cheerio from 'cheerio';
import rp from 'request-promise';
import urlApi from 'url';
import normalizeUrl from 'normalize-url';

if (Meteor.isServer) {
    Meteor.methods({
        serverRequest: (url) => {
            return rp(url);
        }
    });
}

class ParserClass {
    /**
     * @param {string} url адрес страницы
     */
    constructor(url) {
        this.url = normalizeUrl(url);
        this.shops = {
            'eda.by': {
                title:  '.dishinfo > h2',
                weight: '.dishinfo > span',
                price:  '.dishinfo > b',
                descr:  '.summary'
            },
            'wok.by': {
                title:  '.sldier_container h1.productTitle',
                weight: '.sldier_container .controls .checkbox',
                price:  '.sldier_container span.price',
                descr:  '.sldier_container span.productIntro'
            }
        };
    }

    /**
     * Проверяет корректность url
     *
     * @returns {bool} Валиден?
     */
    validUrl() {
        const pattern = /(http|ftp|https):\/\/[\w-]+(\.[\w-]+)+([\w.,@?^=%&amp;:\/~+#-]*[\w@?^=%&amp;\/~+#-])?/;

        return pattern.test(this.url);
    }

    /**
     * Проверяет знает ли он такой url
     *
     * @returns {bool} Одобрить?
     */
    approveFromUrl() {
        return this.getShop(this.url) in this.shops;
    }

    /**
     * Ищет хост магазина из url по нему и будет определяться объект
     *
     * @returns {string} хост магазина
     */
    getShop() {
        let link = urlApi.parse(this.url);
        return link.hostname;
    }

    /**
     * проверяет его корректность
     * проверяет может ли заапрувить его
     * делает запрос на сервер по url
     *
     * @returns {Promise} body страницы
     */
    request() {
        return new Promise((resolve, reject) => {
            if (this.validUrl() && this.approveFromUrl()) {
                Meteor.call('serverRequest', this.url, (error, result) => {
                    resolve(result);
                });
            }else {
                reject(new Error('invalid url'));
            }
        });
    }

    /*
     * выбирает магазин
     * подбирает нужный парсинг-объект из выбранного магазина
     * @returns {Object} выбранный товар
     */
    getParseObj() {
        let shopkey = this.getShop();
        let objparse = this.shops[shopkey];
        return objparse;
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
                let $ = cheerio.load(result);
                let objparse = this.getParseObj();
                let resultparse = {};

                for (let key in objparse) {
                    resultparse[key] = $(objparse[key]).text();
                }

                console.log(resultparse);
                return resultparse;
            })
            .catch(error => {
                throw new Error('error request');
            });
    }
}

export default (url) => new ParserClass(url);

// for test in browser
// > Parser('http://www.eda.by/catalog/dish/1834.html').parse()
// > Parser('http://www.wok.by/menu/full/soup/laksa').parse()
