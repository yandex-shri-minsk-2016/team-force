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
    }
});
