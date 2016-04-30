import { Meteor } from 'meteor/meteor';
import Pools from './../../../api/pools/pools';
import utils from './../../../../lib/utils';

Template.poolSummary.helpers({
    poolItems: () => {
        return utils.toArr(Pools.getGroupByItemWithData(Template.instance().data._id));
    }
});
