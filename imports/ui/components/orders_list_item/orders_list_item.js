Template.ordersList.helpers({
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
    }
});

Template.ordersListItem.helpers({
    haveOrder: (poolId) => {
        return Orders.findOne({ poolId: poolId, userId: Meteor.userId() });
    }
});

Template.ordersListItem.events({
    'click .js-ispaid': () => {
        let order = Orders.findOne(Template.instance().data._id);
        Orders.update(order._id, { $set: { isPaid: !order.isPaid } });
        if (order.isPaid) {
            throwNotification('warning', 'Вам снова должны:)');
        }else {
            throwNotification('success', 'Долг снят.');
        }
    },

    'click .order__copy-order': (event) => {
        let orderId = event.currentTarget.getAttribute('data-orderId');
        Orders.copyOrder(orderId, Meteor.userId());
        throwNotification('warning', 'Вы скопировали пулл.');
    }
});
