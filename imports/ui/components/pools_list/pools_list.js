Template.poolsList.helpers({
    poolsWithDates: () => {
        const PoolsCompanyWithPrice = Pools.getCompanyPools(Meteor.user().profile.company).fetch().map((pool) => {
            pool.poolPrice = utils.getPriceWithFormat(Pools.getPoolPrice(pool._id));
            pool.userCount = Orders.find({ poolId: pool._id }).count();
            return pool;
        });

        let PoolsWithDates = {};

        PoolsCompanyWithPrice.forEach(pool => {
            if (!PoolsWithDates[pool.dayOfYear]) {
                PoolsWithDates[pool.dayOfYear] = [pool];
            }else {
                PoolsWithDates[pool.dayOfYear].push(pool);
            }
        });

        return Object.keys(PoolsWithDates).map((date) => {
            return {
                date: date,
                pools: PoolsWithDates[date]
            };
        });
    }
});
