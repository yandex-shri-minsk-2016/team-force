import utils from '../../../../lib/utils';

Template.debts.helpers({
    debtsOrders: () => {
        let orders = [];

        Orders.find({}, { limit:Template.instance().data.ordersLimit }).fetch()
            .forEach((baseOrder, index) => {
                orders.push(baseOrder);

                orders[index].poolOwnerId = Pools.findOne(baseOrder.poolId).ownerId;

                baseOrder.items.forEach((baseItem, itemIndex) => {
                    orders[index].items[itemIndex] = {
                        id: baseItem.id,
                        count: baseItem.count,
                        item: Items.findOne({ _id: baseItem.id })
                    };
                });
            });

        return orders;
    }
});

Template.debtsHeader.helpers({
    allOrdersPrice: () => {
        return utils.getPriceWithFormat(Orders.getOrderPriceForUser(Meteor.userId()))
    },

    paidOrdersPrice: () => {
        return utils.getPriceWithFormat(Orders.getOrderIsPaidPriceForUser(Meteor.userId(), true));
    }
});
