import { Meteor } from 'meteor/meteor';
import Items from './../../../api/items/items';

Template.pool.helpers({
    poolOrders: () => {
        let orders = [];

        let baseOrders = Template.instance().data.orders;
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

    haveOrder: () => {
        let orders = Template.instance().data.orders;
        for (let order of orders) {
            if (order.owner === Meteor.userId())
                return true;
        }
        
        return false;
    },
     
    ourOrder: (owner) => {
        return owner === Meteor.userId();
    }
});

Template.pool.events({
    'click .copy_order'(event) {
        let poolId = Template.instance().data._id;
        let orderIndex = event.currentTarget.getAttribute('data-index');
        Orders.copyOrder(poolId, orderIndex);
    }
});
