import PoolsCollection from './../../../api/pools/pools';

Pools = PoolsCollection;

Template.poolsList.helpers({
    pools: () => {
        // company id from user
        return Pools.getCompanyPools('google');
    }
});
