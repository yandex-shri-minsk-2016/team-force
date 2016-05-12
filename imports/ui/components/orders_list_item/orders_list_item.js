Template.ordersList.helpers({
    poolOrders: () => {
        return Orders.find({ poolId: Template.instance().data._id }).fetch()
                .map(order => {
                    order.items.map(item => {
                        item.item = Items.findOne({ _id: item.id });
                        return item;
                    });
                    return order;
                });
    }
});

Template.ordersListItem.helpers({
    haveOrder: (poolId) => {
        return Orders.findOne({ poolId: poolId, userId: Meteor.userId() });
    }
});

Template.ordersListItem.events({
    'click .js-ispaid': () => {
        const order = Orders.findOne(Template.instance().data._id);
        Orders.update(order._id, { $set: { isPaid: !order.isPaid } });
        if (order.isPaid) {
            throwNotification('warning', 'Вам снова должны:)');
        }else {
            throwNotification('success', 'Долг снят.');
        }
    },

    'click .order__copy-order': (event) => {
        const orderId = event.currentTarget.getAttribute('data-orderId');
        Orders.copyOrder(orderId, Meteor.userId());
        throwNotification('warning', 'Вы скопировали пулл.');
    }
});
