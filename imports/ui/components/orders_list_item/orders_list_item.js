Template.ordersListItem.events({
    'click .js-ispaid': () => {
        let order = Orders.findOne(Template.instance().data._id);
        Orders.update(order._id, { $set: { isPaid: !order.isPaid } });
    }
});
