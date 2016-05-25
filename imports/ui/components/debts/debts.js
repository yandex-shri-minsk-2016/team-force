import utils from '../../../../lib/utils';

Template.debts.helpers({
    debtsOrders: () => {
        const allDebts = Orders.find({}, { limit:Template.instance().data.ordersLimit })
            .fetch()
            .map(order => {
                order.poolOwnerId = Pools.findOne(order.poolId).ownerId;
                order.isNoSelfDebt = order.poolOwnerId !== order.userId;
                order.items.map(item => {
                    item.item = Items.findOne({ _id: item.id });
                    return item;
                });
                return order;
            });

        const isAllOwner = allDebts.map(order => { return order.isNoSelfDebt; }).every((isNoSelfDebt) => {
            return isNoSelfDebt === false;
        });

        return isAllOwner ? [] : allDebts;

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
