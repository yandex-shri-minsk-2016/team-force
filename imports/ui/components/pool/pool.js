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
    }
    notOurOrder: function() {
        return (this.owner != Meteor.userId());
    }
});

Template.pool.events({
    'click .order_up'(event) {
        poolId = Template.instance().data._id;
        orderId = event.currentTarget.getAttribute('data-orderId');
        Orders.orderUp(poolId, orderId);
    }
});
