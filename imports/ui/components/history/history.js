Template.history.helpers({
    pools: () => {
        return Pools.find({}, { sort: { time:-1 }, limit:Template.instance().data.poolsLimit }).fetch().map((pool) => {
            pool.poolPrice  = utils.getPriceWithFormat(Pools.getPoolPrice(pool._id));
            pool.userCount = Orders.find({ poolId:pool._id }).count();

            return pool;
        });
    }
});
