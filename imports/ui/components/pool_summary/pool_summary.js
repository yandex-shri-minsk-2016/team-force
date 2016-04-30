import { Meteor } from 'meteor/meteor';
import Pools from './../../../api/pools/pools';
import utils from './../../../../lib/utils';

Template.poolSummary.helpers({
    poolItems: () => {
        console.log(Pools.getGroupByItemWithData(Template.instance().data._id));
        return utils.toArr(Pools.getGroupByItemWithData(Template.instance().data._id));
    }
});
