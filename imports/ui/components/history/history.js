import { Meteor } from 'meteor/meteor';
import Pools from './../../../api/pools/pools';
import Orders from './../../../api/orders/orders';

Template.history.helpers({
    pools: Pools.find({ ownerId: Meteor.userId() }),
    orders: Orders.find({ userId: Meteor.userId() })
});
