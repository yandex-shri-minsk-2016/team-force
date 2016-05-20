Template.poolsList.helpers({
    poolsWithDates: () => {
        const PoolsCompanyWithPrice = Pools.getCompanyPools(Meteor.user().profile.company).fetch().map(pool => {
            const poolPrice = Pools.getPoolPrice(pool._id);
            pool.poolPrice = utils.getPriceWithFormat(poolPrice);
            pool.userCount = Orders.find({ poolId: pool._id }).count();

            const tDelivery = pool.distance / utils.MEAN_SPEED;
            const tCooking  = poolPrice > 0 ? utils.MEAN_TCOOK * Math.pow(Math.log(poolPrice) / Math.log(utils.MEAN_PRICE), 4) : 0;
            pool.timeDelivery = (tDelivery + tCooking) ? (tDelivery + tCooking) : 0;
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

        return Object.keys(PoolsWithDates).map(date => {
            return {
                date: date,
                pools: PoolsWithDates[date]
            };
        });
    }
});
