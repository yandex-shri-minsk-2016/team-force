import { Meteor } from 'meteor/meteor';
import Pools from './../../../api/pools/pools';

Template.poolsList.helpers({
    pools: () => {
        return Pools.getCompanyPools(Meteor.user().profile.company);
    }
});
