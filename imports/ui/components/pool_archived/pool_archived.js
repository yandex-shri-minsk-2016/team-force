import moment from 'moment';
import 'moment/locale/ru';

Template.poolArchived.helpers({
    poolOrders: () => {
        let orders = [];

        let baseOrders = Orders.find({ poolId: Template.instance().data._id }).fetch();
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

Template.poolHeader.rendered = function() {
    const time = Pools.findOne(Template.instance().data._id).time;
    $('.timer').text(moment(time).fromNow());
};
