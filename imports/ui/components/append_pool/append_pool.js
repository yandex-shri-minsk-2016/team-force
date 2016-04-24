import {Meteor} from 'meteor/meteor';
import Pools from './../../../api/pools/pools';
import Parser from './../../../../lib/parser';
import Items from './../../../api/items/items';
import Orders from './../../../api/orders/orders';

let itemFields = [];
let itemFieldsDep = new Tracker.Dependency();

Template.appendPool.helpers({
    itemFields: () => {
        itemFieldsDep.depend();
        return itemFields;
    }
});

Template.appendPool.events({
    'paste #new-product-input': (event) => {
        const errorClass = 'has-error';

        const inputGroup = $('.new-product-input-group');
        const inputValue = event.originalEvent.clipboardData.getData('text');
        const joinButton = $('.join-button');
        
        joinButton.button('loading');

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
                joinButton.button('reset');
            });
    },

    'submit #append_pool': (event) => {
        event.preventDefault();

        const target = event.target;

        let newItem = {
            title: target['form-elem-title'].value,
            price: parseInt(target['form-elem-price'].value.split(' ').join('')), //FIXME string to int
            description: target['form-elem-descr'].value,
            weight: target['form-elem-weight'].value,
            link: target['item-link'].value
        };

        const poolId = Router.current().params.poolId;
        const userOrder = Orders.findOne({ poolId: poolId, userId: Meteor.userId() });
        Items.findOrInsert(newItem)
            .then((itemId) => {
                if (!userOrder) {
                    Orders.add({
                        userId: Meteor.userId(),
                        poolId,
                        items: [{
                            count: 1,
                            id: itemId
                        }]
                    });
                } else {
                    Orders.update(userOrder._id, { $addToSet: { items: { count: 1, id: itemId } } });
                }

                itemFields = [];
                itemFieldsDep.changed();

                Router.go('pool', { poolId: poolId });
            })
            .catch((e) => {
                //TODO: Show notification
                alert(e);
            });
    }
});
