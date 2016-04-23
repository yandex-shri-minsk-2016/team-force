import { Meteor } from 'meteor/meteor';
import Pools from './../../../api/pools/pools';

Template.poolsListItem.helpers({
    isPending: (poolId) => {
        return Pools.findOne({ _id: poolId }).state === 'pending';
    }
});
