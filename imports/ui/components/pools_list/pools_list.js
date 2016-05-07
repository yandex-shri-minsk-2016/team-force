Template.poolsList.helpers({
    poolsWithDates: () => {
        // @TODO need aggregation of date
        // [{'date', 'pools'}, {'date', 'pools'} ...]
        return [{
            date: 'Сегодня',
            pools: Pools.getCompanyPools(Meteor.user().profile.company).fetch().map((pool) => {
                pool.poolPrice = utils.getPriceWithFormat(Pools.getPoolPrice(pool._id));
                pool.userCount = Orders.find({ poolId: pool._id }).count();
                return pool;
            })
        }];
    }
});
