import Parser from './../../../../lib/parser';
import utils from './../../../../lib/utils';
import normalizeUrl from 'normalize-url';

let itemFields = [];
let itemFieldsDep = new Tracker.Dependency();

Template.appendPool.helpers({
    itemFields: () => {
        itemFieldsDep.depend();
        return itemFields;
    }
});

Template.appendPool.events({
    'keyup .new-product-dynamic-input-group input': (event) => {
        let emptyFields = [];
        const joinButton = $('.join-button');
        const hideGroup = $('.new-product-hide-input-group');

        $('.new-product-dynamic-input-group input').each((input, element) => {
            emptyFields.push(!!$(element).val());
        });

        if (!emptyFields.reduce((result, current) => { return result && current; })) {
            hideGroup.hide();
        }else {
            hideGroup.show();
            joinButton.removeClass('disabled');
        }
    },

    'click .js-new-product': (event) => {
        const errorClass = 'has-error';
        const hideGroup  = $('.new-product-hide-input-group');
        const joinButton = $('.join-button');
        const addButton  = $('.js-new-product');
        const inputGroup = $('.new-product-input-group');
        const labels = {
            title: 'Название',
            weight:'Вес',
            price: 'Цена',
            descr: 'Описание'
        };

        itemFields = [];
        hideGroup.hide();
        joinButton.addClass('disabled');
        addButton.toggleClass('active');
        inputGroup.removeClass(errorClass);

        if (addButton.hasClass('active')) {
            itemFields = Object.keys(labels).map(label => {
                return {
                    title: labels[label],
                    value: '',
                    key: `form-elem-${label}`
                };
            });
        }

        itemFieldsDep.changed();
    },

    'keyup #new-shop-input': (event) => {
        const inputValue = $('#new-shop-input').val();
        Pools.update(Template.instance().data._id, { $set: { shop: normalizeUrl(inputValue) } });
    },

    'paste #new-shop-input': (event) => {
        const inputValue = event.originalEvent.clipboardData.getData('text');
        if (utils.validUrl(inputValue)) {
            const shopUrl = normalizeUrl(inputValue);
            Pools.update(Template.instance().data._id, { $set: { shop: shopUrl } });
            throwNotification('success', `Название магазина изменено на ${shopUrl}`);
        }else {
            throwNotification('danger', 'Неправильный адрес магазина');
        }

    },

    'paste #new-product-input': (event) => {
        const errorClass = 'has-error';
        const pool = Pools.findOne(Template.instance().data._id);
        const inputValue = event.originalEvent.clipboardData.getData('text');
        const inputGroup = $('.new-product-input-group');
        const joinButton = $('.join-button');
        const hideGroup  = $('.new-product-hide-input-group');
        const labels = {
            title: 'Название',
            weight:'Вес',
            price: 'Цена',
            descr: 'Описание'
        };

        itemFields = [];
        itemFieldsDep.changed();
        hideGroup.hide();
        joinButton.addClass('disabled').val('Загружаем...').parent().show();
        inputGroup.removeClass(errorClass);

        Parser(inputValue, pool.shop).parse()
            .then((result) => {

                itemFields = Object.keys(result).map(field => {
                    return {
                        title: labels[field],
                        value: result[field],
                        key: `form-elem-${field}`
                    };
                });
                itemFieldsDep.changed();

                hideGroup.show();
                joinButton.val('Присоединиться').removeClass('disabled');
            })
            .catch(error => {
                hideGroup.hide();
                inputGroup.addClass(errorClass);
                throwNotification('danger', error.toString());
            });
    },

    'submit #append_pool': (event) => {
        event.preventDefault();
        const pool = Pools.findOne(Template.instance().data._id);
        const poolId = pool._id;
        const target = event.target;
        const joinButton = $('.join-button');
        const addButton = $('.js-new-product');
        const hideGroup = $('.new-product-hide-input-group');
        const productInput = $('#new-product-input');
        const productCount = parseInt($('#new-product-count').val());

        if (!productInput.val()) {
            productInput.val(normalizeUrl(pool.shop)); // to manually add
        }

        const newItem = {
            title: target['form-elem-title'].value,
            price: utils.getPriceFromString(target['form-elem-price'].value),
            description: target['form-elem-descr'].value,
            weight: target['form-elem-weight'].value,
            link: normalizeUrl(target['item-link'].value)
        };

        Pools.appendItemForUser(poolId, Meteor.userId(), newItem, productCount)
            .then((itemId) => {
                itemFields = [];
                itemFieldsDep.changed();

                joinButton.val('Присоединиться');
                addButton.removeClass('active');
                productInput.val('');
                hideGroup.hide();

                Feeds.addToPool(poolId, {
                    userId: Meteor.userId(),
                    type:   'level-up',
                    message:` добавил в #pool{${poolId}}, #item{${itemId}} на сумму ${newItem.price * productCount}`
                });

                Router.go('pool', { poolId: poolId });
            })
            .catch(error => {
                alert(error); //TODO: Notify user
            });
    }
});
