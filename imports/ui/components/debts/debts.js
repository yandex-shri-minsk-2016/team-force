import utils from '../../../../lib/utils';

Template.debts.helpers({
    debtsOrders: () => {
        let orders = [];
        const userPoolIds = Pools.find({ ownerId: Meteor.userId() }, { _id: 1 })
            .fetch().map((obj) => { return obj._id; });

        return Orders.find({ poolId: { $nin: userPoolIds } }, { limit:Template.instance().data.ordersLimit })
            .fetch()
            .map(order => {
                order.poolOwnerId = Pools.findOne(order.poolId).ownerId;
                order.items.map(item => {
                    item.item = Items.findOne({ _id: item.id });
                    return item;
                });
                return order;
            });
    }
});

Template.debtsHeader.helpers({
    allOrdersPrice: () => {
        return utils.getPriceWithFormat(Orders.getOrderPriceForUser(Meteor.userId()));
    },

    paidOrdersPrice: () => {
        return utils.getPriceWithFormat(Orders.getOrderIsPaidPriceForUser(Meteor.userId(), false));
    }
});

Template.debtsListItem.events({
    'click .js-ispaid': () => {
        const order = Orders.findOne(Template.instance().data._id);
        Orders.update(order._id, { $set: { isPaid: !order.isPaid } });
    }
});
