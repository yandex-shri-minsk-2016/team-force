import Pools from './../../../api/pools/pools';

Template.poolsList.helpers({
    pools: () => {
        // company id from user
        return Pools.getCompanyPools('google');
    }
});
