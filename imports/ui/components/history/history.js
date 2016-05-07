Template.history.helpers({
    pools: () => {
        return Pools.find({ ownerId: Meteor.userId() }).fetch().map((pool) => {
            pool.poolPrice  = utils.getPriceWithFormat(Pools.getPoolPrice(pool._id));
            pool.userCount = Orders.find({ poolId:pool._id }).count();

            return pool;
        });
    }
});
