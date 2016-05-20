import urlApi from 'url';
import normalizeUrl from 'normalize-url';
import shopsConfig from './shops.json';

const utils = {
    DATETIME_FORMAT: 'DD/MM/YYYY HH:mm',
    ITEMS_PER_PAGE: 8,
    VALID_URL: /^((http|ftp|https):\/\/)?[\w-]+(\.[\w-]+)+([\w.,@?^=%&amp;:\/~+#-]*[\w@?^=%&amp;\/~+#-])?/,
    POOL_STATE: {
        PENDING: 'pending',
        SUMMARY: 'summary',
        ARCHIVED: 'archived'
    },
    MEAN_SPEED: 10, // 10м/с ~ 36км/ч - средняя скорость по Минску
    MEAN_PRICE: 100000, // 100000 - средний чек на человека
    MEAN_TCOOK: 25 * 60, // 25 минут - средняя подача блюда:)

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
        const shops = shopsAnother || shopsConfig;
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
     * Возвращает адрес аватара
     * @param {String} userId пользователь
     * @param {Number} size размер картинки
     * @returns {String} адрес картинки
     */
    getAvatar(userId, size=100) {
        const email = Meteor.users.findOne({ _id: userId }).emails[0].address;
        return `https://api.adorable.io/avatars/${size}/${email}.png`;
    },

    /**
     * Возвращает username или email пользователя
     * @param {String} userId пользователь
     * @returns {String} username или email, смотря что есть
     */
    getUsermail(userId) {
        const user = Meteor.users.findOne({ _id: userId });
        if (user.profile.username) {
            return user.profile.username;
        }

        return user.emails[0].address;
    },

    /**
     * @param {String} shop имя магазина
     * @param {Array} shopsAnother другой контекст магазинов
     */
    getShopMail(shop, shopsAnother) {
        const shops = shopsAnother || shopsConfig;
        if (shop in shops && 'email' in shops[shop]) {
            return shops[shop].email;
        }

        return undefined;
    },

    /**
     * @param {String} poolId пулл
     * @param {Array} shopsAnother другой контекст магазинов
     * @returns {Boolean} присутствует ли магазин в shops.json
     */
    isExistShop(poolId, shopsAnother) {
        const shop = Pools.findOne(poolId).shop;
        const shops = shopsAnother || shopsConfig;
        return !!(shop in shops && shop !== 'Untitled');
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
    },

    /**
     * Возвращает массив объектов
     * @param Object obj перечислимый объект (ex. магазинов)
     * @returns [Object] arr массив объектов
     */
    toArr(obj) {
        return Object.keys(obj).map((i) => obj[i]);
    }

};

export default utils;
