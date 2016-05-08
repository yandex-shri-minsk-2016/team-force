import Parser from './../../../../lib/parser';
import utils from './../../../../lib/utils';

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
        let isEmpty = [];
        const joinButton = $('.join-button');
        const hideGroup = $('.new-product-hide-input-group');

        $('.new-product-dynamic-input-group input').each((input, element) => {
            isEmpty.push(!!$(element).val());
        });

        if (isEmpty.reduce((result, current) => { return result && current; })) {
            hideGroup.show();
            joinButton.removeClass('disabled');
        }else {
            hideGroup.hide();
            joinButton.addClass('disabled');
        }
    },

    'click .js-new-product': (event) => {
        let result = {
            title: '',
            weight:'',
            price: '',
            descr: ''
        };

        for (let item in result) {
            let title = item;
            switch (item) {
                case 'title':
                    title = 'Название';
                    break;
                case 'weight':
                    title = 'Вес';
                    break;
                case 'price':
                    title = 'Цена';
                    break;
                case 'descr':
                    title = 'Описание';
                    break;
            }

            itemFields.push({
                title,
                value: result[item],
                key: `form-elem-${item}`
            });
        }

        itemFieldsDep.changed();
    },

    'paste #new-product-input': (event) => {
        const errorClass = 'has-error';

        const inputGroup = $('.new-product-input-group');
        const inputValue = event.originalEvent.clipboardData.getData('text');
        const joinButton = $('.join-button');
        const hideGroup = $('.new-product-hide-input-group');

        hideGroup.hide();
        joinButton.val('Загружаем...').parent().show();
        joinButton.addClass('disabled');

        if (inputGroup.hasClass(errorClass)) {
            inputGroup.removeClass(errorClass);
        }

        Parser(inputValue).parse()
            .then((result) => {
                for (let item in result) {
                    let title = item;
                    switch (item) {
                        case 'title':
                            title = 'Название';
                            break;
                        case 'weight':
                            title = 'Вес';
                            break;
                        case 'price':
                            title = 'Цена';
                            break;
                        case 'descr':
                            title = 'Описание';
                            break;
                    }

                    itemFields.push({
                        title,
                        value: result[item],
                        key: `form-elem-${item}`
                    });
                }

                itemFieldsDep.changed();
            })
            .catch((error) => {
                inputGroup.addClass(errorClass);
            })
            .finally(() => {
                hideGroup.show();
                joinButton.val('Присоединиться');
                joinButton.removeClass('disabled');
            });
    },

    'submit #append_pool': (event) => {
        event.preventDefault();

        const target = event.target;
        const joinButton = $('.join-button');
        const hideGroup = $('.new-product-hide-input-group');
        const productInput = $('#new-product-input');

        let newItem = {
            title: target['form-elem-title'].value,
            price: utils.getPriceFromString(target['form-elem-price'].value),
            description: target['form-elem-descr'].value,
            weight: target['form-elem-weight'].value,
            link: target['item-link'].value
        };

        const poolId = Router.current().params.poolId;

        Pools.appendItemForUser(poolId, Meteor.userId(), newItem)
            .then(() => {
                itemFields = [];
                itemFieldsDep.changed();

                joinButton.val('Присоединиться');
                joinButton.addClass('disabled');
                productInput.val('');
                hideGroup.hide();

                Router.go('pool', { poolId: poolId });
            })
            .catch(e => {
                //TODO: Notify user
                alert(e);
            });
    }
});
