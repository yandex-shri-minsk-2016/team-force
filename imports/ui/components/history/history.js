Template.history.helpers({
    pools: Pools.find({ ownerId: Meteor.userId() }),
    orders: () => {
        let orders = [];

        let baseOrders = Orders.find({ userId: Meteor.userId() }).fetch();
        baseOrders.forEach((baseOrder, index) => {
            orders.push(baseOrder);
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
