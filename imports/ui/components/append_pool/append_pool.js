import {Meteor} from 'meteor/meteor';
import Pools from './../../../api/pools/pools';
import Parser from './../../../../lib/parser';
import Items from './../../../api/items/items';

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
        const currentPool = Pools.findOne({ _id: poolId });
        const currentOrders = currentPool.orders;
        let currentUserOrderIndex = null;
        currentOrders.forEach((order, index) => {
            if (order.owner === Meteor.userId()) {
                currentUserOrderIndex = index;
            }
        });

        Items.findOrInsert(newItem)
            .then((itemId) => {
                if (!currentUserOrderIndex) {
                    currentOrders.push({
                        owner: Meteor.userId(),
                        items: [{ id: itemId, count: 1 }]
                    });
                } else {
                    let exist = false;
                    currentOrders[currentUserOrderIndex].items.forEach((item, index) => {
                        if (item.id === itemId) {
                            currentOrders[currentUserOrderIndex].items[index].count++;
                            exist = true;
                        }
                    });
                    if (!exist) {
                        currentOrders[currentUserOrderIndex].items.push({ id: itemId, count: 1 });
                    }
                }

                itemFields = [];
                itemFieldsDep.changed();

                Pools.update(currentPool._id, { $set: { orders: currentOrders } });
                Router.go('pool', { poolId: poolId });
            })
            .catch((e) => {
                //TODO: Show notification
                alert(e);
            });
    }
});
