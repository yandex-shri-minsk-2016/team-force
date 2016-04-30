import { Meteor } from 'meteor/meteor';
import Pools from './../../../api/pools/pools';
import utils from './../../../../lib/utils';
import Items from './../../../api/items/items';
import Orders from './../../../api/orders/orders';

Template.poolSummary.helpers({
    poolItems: () => {
        return utils.toArr(Pools.getGroupByItemWithData(Template.instance().data._id));
    }
});

Template.poolSummary.events({
    'click .close-pool': () => {
        Pools.changePoolState(Template.instance().data._id, utils.POOL_STATE.ARCHIVED);
    }
});
