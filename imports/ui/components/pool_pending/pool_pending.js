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
    },

    haveOrder: () => {
        return Orders.findOne({ poolId: Template.instance().data._id, userId: Meteor.userId() });
    }
});

Template.poolPending.events({
    'click .copy_order'(event) {
        let orderId = event.currentTarget.getAttribute('data-orderId');
        Orders.copyOrder(orderId, Meteor.userId());
    }

});
