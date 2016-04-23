import { Meteor } from 'meteor/meteor';

Template.pool.events({
    'click .order_up'(event) {
        poolId = Template.instance().data._id;
        orderId = event.currentTarget.getAttribute('data-orderId');
        Orders.orderUp(poolId, orderId);
    }
});

Template.pool.helpers({
    notOurOrder: function() {
        return (this.owner != Meteor.userId());
    }
});
