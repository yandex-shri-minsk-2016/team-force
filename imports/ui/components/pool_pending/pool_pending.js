import Parser from './../../../../lib/parser';
import utils from './../../../../lib/utils';

let itemFields = [];
let itemFieldsDep = new Tracker.Dependency();

Template.poolPending.helpers({
    poolOrders: () => {
        let orders = [];

        let baseOrders = Orders.find({ poolId: Template.instance().data._id }).fetch();
        baseOrders.forEach((baseOrder, index) => {
            orders.push(baseOrder);
            baseOrder.items.forEach((baseItem, itemIndex) => {
                orders[index].items[itemIndex] = {
                    count: baseItem.count,
                    item: Items.findOne({ _id: baseItem.id })
                };
            });
        });

        return orders;
    },

    itemFields: () => {
        itemFieldsDep.depend();
        return itemFields;
    }
});

Template.poolPending.events({
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

                Router.go('pool', { poolId: poolId });
            })
            .catch(e => {
                //TODO: Notify user
                alert(e);
            });
    }
});
