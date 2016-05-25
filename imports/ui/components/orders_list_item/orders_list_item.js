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

        const pool = Pools.findOne({ _id:order.poolId });

        if (order.isPaid) {
            throwNotification('warning', 'Вам снова должны:)');

            Feeds.add({
                userId:   order.userId,
                ownerId:  order.userId,
                companyId:Meteor.user().profile.company,
                type:     'remove-sign',
                message:  ` снова взял в долг ${utils.getPriceWithFormat(Orders.getOrderPrice(order._id))} за #pool{${pool._id}}.`
            });

            Feeds.add({
                userId:   order.userId,
                ownerId:  pool.ownerId,
                companyId:Meteor.user().profile.company,
                seen:     true,
                type:     'remove-sign',
                message:  ` снова взял в долг ${utils.getPriceWithFormat(Orders.getOrderPrice(order._id))} за #pool{${pool._id}}.`
            });

        }else {
            throwNotification('success', 'Долг снят.');

            Feeds.add({
                userId:   order.userId,
                ownerId:  order.userId,
                companyId:Meteor.user().profile.company,
                type:     'info-sign',
                message:  ` отдал долг ${utils.getPriceWithFormat(Orders.getOrderPrice(order._id))} за #pool{${pool._id}}.`
            });

            Feeds.add({
                userId:   order.userId,
                ownerId:  pool.ownerId,
                companyId:Meteor.user().profile.company,
                seen:     true,
                type:     'info-sign',
                message:  ` отдал вам долг ${utils.getPriceWithFormat(Orders.getOrderPrice(order._id))} за #pool{${pool._id}}.`
            });
        }
    },

    'click .order__copy-order': (event) => {
        const orderId = event.currentTarget.getAttribute('data-orderId');
        Orders.copyOrder(orderId, Meteor.userId());
        throwNotification('warning', 'Вы скопировали пулл.');

        Feeds.notifyEveryoneInPool({
            userId:   Meteor.userId(),
            ownerId:  Meteor.userId(),
            companyId:Meteor.user().profile.company,
            type:     'copy',
            message:  ` скопировал товары в #pool{${pool._id}}.`
        });

    }
});
