Template.history.helpers({
    pools: Pools.find({ ownerId: Meteor.userId() }),
    orders: Orders.find({ userId: Meteor.userId() })
});
