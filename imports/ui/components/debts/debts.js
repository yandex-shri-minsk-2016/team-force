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
